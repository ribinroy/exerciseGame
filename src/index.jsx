import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import io from 'socket.io-client';

import EditableLabel from './EditableLabel';
import Card from './Card';
import Timer from './Timer';
import Slider from './Slider';
import BackgroundImageLegs from './Images/whm012220lavenderset-015-1583933144.png';
import BackgroundImageArms from './Images/dumbbell-exercises-1577465289.png';
import BackgroundImageCore from './Images/30-day-challenge-sldl-lb-wo0-1576613501.png';
import BackgroundImageCardio from './Images/goblet-squat-image-1577744214.png';
import BackgroundImageFun from './Images/wh-fitness-lateral-lunge-with-balancef-1598382504.png';
import UserImage1 from './Images/pexels-andrea-piacquadio-8.png';
import UserImage2 from './Images/pexels-andrea-piacquadio-3768918.png';
import copypng from './Images/copy.png';
import mute from './Images/Group 7.png';
import call from './Images/phone-call (2).png';
import novideo from './Images/Group 8.png';
import unmute from './Images/microphone-black-shape.png';
import video from './Images/video-player.png';
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import './index.css';
import 'react-bootstrap';
import './bootstrap.min.css';

const CategoryImageDict = {
    LEGS: BackgroundImageLegs,
    ARMS: BackgroundImageArms,
    CORE: BackgroundImageCore,
    CARDIO: BackgroundImageCardio,
    FUN: BackgroundImageFun,
};

const PLAYER_DATA = [
    {
        gradientColorClass: 'grad grad1',
        userImage: UserImage1,
    },
    {
        gradientColorClass: 'grad grad2',
        userImage: UserImage2,
    },
];

const socket = io('http://localhost:5000');

const GAME_ID = 6;

const EDITABLE_SUFFIX = ': enter name here';

const PLAYER1 = '';
const PLAYER2 = '';
const BOARD_DATA =
    '{"categories": ["LEGS", "ARMS", "CORE", "CARDIO"], "squares": [[{"number": 400, "text": "Squats, 30 secs"}, {"number": 400, "text": "10 push-ups"}, {"number": 400, "text": "Bicycle kicks, 30 secs"}, {"number": 400, "text": "Jumping jacks, 30 secs"}], [{"number": 500, "text": "Tree pose"}, {"number": 500, "text": "25 plank side walks", "link": "https://www.youtube.com/watch?v=hffjRd86Zno&t=10s"}, {"number": 500, "text": "Shoulder tap planks, 60 secs", "link": "https://www.youtube.com/watch?v=QOCn3_iOAro"}, {"number": 500, "text": "30 Skaters", "link": "https://greatist.com/fitness/cardio-bodyweight-exercises#:~:text=13.%20Skaters"}], [{"number": 600, "text": "20 lunges (10 on each side)"}, {"number": 600, "text": "10 rolling push-ups", "link": "https://www.youtube.com/watch?v=Wu5fWBMG20w"}, {"number": 600, "text": "80 Russian twists"}, {"number": 600, "text": "Alternating starfish jumps (30)", "link": "https://www.youtube.com/watch?v=x8vQrqEmAfo"}], [{"number": 700, "text": "High knees, 75 secs"}, {"number": 700, "text": "20 dive bomber push-ups", "link": "https://www.youtube.com/watch?v=mvNcSF-nXg4"}, {"number": 700, "text": "50 crunches"}, {"number": 700, "text": "25 mountain climbers + 25 jumping jacks"}], [{"number": 800, "text": "40 power jacks", "link": "https://www.youtube.com/watch?v=alaZwJE20Ds"}, {"number": 800, "text": "50 commandos", "link": "https://www.youtube.com/watch?v=yD7nl9Hh160"}, {"number": 800, "text": "Longest plank"}, {"number": 800, "text": "25 long jumps with jog back", "link": "https://greatist.com/fitness/cardio-bodyweight-exercises#:~:text=14.%20Long%20jump"}]]}';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.showwinnerTab = this.showwinnerTab.bind(this);
        this.state = {
            isMute: false,
            isVideo: false,
            player1: '',
            player2: '',
            categories: [],
            squares: [],
            timerIsActive: false,
            open: false,
            showTab: false,
            popupHead: '',
            popupExercise: '',
            popupLink: '',
        };
    }

    updateTimerStatus(status) {
        if (this.state.timerIsActive !== status) {
            this.setState({ timerIsActive: status });
        }
    }

    closeModal() {
        this.setState({
            open: false,
        });
    }

    updateGame() {
        // axios.get('http://localhost:5000/api/v0/game/' + GAME_ID).then(res => {
        //   const player1 = res.data.player1;
        //   const player2 = res.data.player2;
        //   const board = JSON.parse(res.data.board);
        const player1 = PLAYER1;
        const player2 = PLAYER2;
        const board = JSON.parse(BOARD_DATA);
        this.setState({
            player1: player1,
            player2: player2,
            categories: board.categories,
            squares: board.squares,
        });

        let openSquare = false;

        for (const row of this.state.squares) {
            for (const square of row) {
                if (square.status === 1) {
                    openSquare = true;
                }
            }
        }

        if (!openSquare) {
            this.updateTimerStatus(false);
        }
        // }).catch(console.log);
    }

    componentDidMount() {
        this.updateGame();

        // socket.on('board_update', () => {
        //   console.log('Received board_update');
        //   this.updateGame();
        // });

        // socket.on('start_timer', () => {
        //   console.log('Received start_timer');
        //   this.updateTimerStatus(true);
        // });
    }

    getBoardJson() {
        return JSON.stringify({
            categories: this.state.categories,
            squares: this.state.squares,
        });
    }

    pushStateUpdate() {
        // axios.post('http://localhost:5000/api/v0/update_game', {
        //   id: GAME_ID,
        //   player1: this.state.player1,
        //   player2: this.state.player2,
        //   board: this.getBoardJson()
        // });
    }

    getPlayerName(playerIndex, editable = false) {
        const name =
            playerIndex === 1 ? this.state.player1 : this.state.player2;
        const defaultName =
            'Player ' + playerIndex + (editable ? EDITABLE_SUFFIX : '');
        return name || defaultName;
    }

    setPlayerName(playerIndex, name) {
        if (!name || name.endsWith(EDITABLE_SUFFIX)) {
            return;
        }

        if (playerIndex === 1) {
            this.setState({ player1: name }, this.pushStateUpdate);
        } else {
            this.setState({ player2: name }, this.pushStateUpdate);
        }
    }

    getCurrentSquare() {
        const squares = this.state.squares;

        for (let r = 0; r < squares.length; r++) {
            for (let c = 0; c < squares[r].length; c++) {
                if (squares[r][c].status === 1) {
                    return [r, c];
                }
            }
        }

        return [];
    }

    getCurrentTurn() {
        let currentTurn = 1;

        for (const row of this.state.squares) {
            for (const square of row) {
                if (square.winner > 0) {
                    // Flip between 1 and 2.
                    currentTurn ^= 3;
                }
            }
        }

        return currentTurn;
    }

    showwinnerTab() {
        this.setState({ showTab: true });
    }

    getSquareUpdater(r, c) {
        return () => {
            const squares = this.state.squares.slice();

            if (squares[r][c].status === undefined) {
                squares[r][c].status = 0;
            }

            squares[r][c].status = (squares[r][c].status + 1) % 2;

            // Only allow one square at a time to be open.
            if (squares[r][c].status === 1) {
                for (const row of squares) {
                    for (const square of row) {
                        if (square.status === 1) {
                            square.status = 0;
                        }
                    }
                }

                squares[r][c].status = 1;
            } else {
                this.updateTimerStatus(false);
            }
            console.log(squares[r][c]);
            this.setState(
                {
                    squares: squares,
                    open: true,
                    showTab: false,
                    popupHead: squares[r][c].number,
                    popupLink: squares[r][c].link,
                    popupExercise: squares[r][c].text,
                },
                this.pushStateUpdate
            );
        };
    }

    toggle(value) {
        if (value === 'mute') {
            this.setState({ isMute: !this.state.isMute });
        } else if (value === 'video') {
            this.setState({ isVideo: !this.state.isVideo });
        }
    }

    computePoints(playerIndex) {
        let points = 0;

        for (const row of this.state.squares) {
            for (const square of row) {
                if (square.winner === playerIndex || square.winner === 3) {
                    points += square.number;
                }
            }
        }

        return points;
    }

    setWinner(winner) {
        const square = this.getCurrentSquare();
        console.assert(square.length > 0);

        const row = square[0];
        const col = square[1];
        const squares = this.state.squares.slice();
        squares[row][col].winner = winner;
        squares[row][col].status = 0;
        this.setState(
            { squares: squares, showTab: false, open: false },
            this.pushStateUpdate
        );
    }

    render() {
        const belowBoard = () => {
            const currentSquare = this.getCurrentSquare();

            if (currentSquare.length > 0) {
                const row = currentSquare[0];
                const col = currentSquare[1];
                const title =
                    this.state.categories[col] +
                    ' for ' +
                    this.state.squares[row][col].number +
                    '!';

                return (
                    <div className='popup-wrap'>
                        <div className='remngtime'>Select the winner</div>
                        <button
                            className='usernamebtnbox grad grad1'
                            onClick={() => this.setWinner(1)}>
                            {this.getPlayerName(1)}
                        </button>
                        <button
                            className='usernamebtnbox grad grad2'
                            onClick={() => this.setWinner(2)}>
                            {this.getPlayerName(2)}
                        </button>
                        <button
                            className='usernamebtnbox grad grad3'
                            onClick={() => this.setWinner(3)}>
                            Tied
                        </button>
                        {/* <Timer
                            seconds={30}
                            timerIsActive={this.state.timerIsActive}
                            onStartTimer={() => socket.emit('start_timer')}
                            onEndTimer={() => this.updateTimerStatus(false)}
                        /> */}
                    </div>
                );
            } else {
                const currentTurn = this.getCurrentTurn();

                return (
                    <div className='innertext'>
                        {this.getPlayerName(currentTurn) +
                            ', your turn to pick!'}
                    </div>
                );
            }
        };

        return (
            <div className='maindiv'>
                <div className='topMainWrap'>
                    <div className='leftmaindiv'>
                        <div className='jeopardy'>
                            <div className='jeopardy-table'>
                                <div className='category-row'>
                                    {Array.from(
                                        this.state.categories.entries()
                                    ).map((categoryPair) => {
                                        const category = categoryPair[1];
                                        return (
                                            <div
                                                className='category'
                                                key={category}>
                                                <img
                                                    src={
                                                        CategoryImageDict[
                                                            category
                                                        ]
                                                    }
                                                    width='100%'
                                                    alt='userimage'
                                                    className='catimgitem'
                                                />
                                                <div className='categoryName'>
                                                    {category}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className='jeopardy-squares'>
                                    {Array.from(
                                        this.state.squares.entries()
                                    ).map((rowPair) => (
                                        <div
                                            className='jeopardy-row'
                                            key={'jeopardy-row' + rowPair[0]}>
                                            {Array.from(
                                                rowPair[1].entries()
                                            ).map((entryPair) => {
                                                const square = entryPair[1];
                                                return (
                                                    <Card
                                                        number={square.number}
                                                        text={square.text}
                                                        link={square.link}
                                                        winner={square.winner}
                                                        status={
                                                            square.status || 0
                                                        }
                                                        updater={this.getSquareUpdater(
                                                            rowPair[0],
                                                            entryPair[0]
                                                        )}
                                                        storageKey={
                                                            'board' +
                                                            rowPair[0] +
                                                            entryPair[0]
                                                        }
                                                        key={
                                                            'board' +
                                                            rowPair[0] +
                                                            entryPair[0]
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                                <Modal
                                    show={this.state.open}
                                    onHide={() => this.closeModal()}
                                    aria-labelledby='ModalHeader'>
                                    <Modal.Header closeButton>
                                        <Modal.Title id='ModalHeader'>
                                            <div className='weightage'>
                                                {this.state.popupHead} Points
                                            </div>
                                            <div className='exercise'>
                                                {this.state.popupExercise}
                                            </div>
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {/* <video className="video-container video-container-overlay" autoPlay="" loop="" muted="" data-reactid=".0.1.0.0">
                                        </video> */}
                                        {/* <video src={video} width="750" height="500" controls>
                                            <source type="video/mp4" data-reactid=".0.1.0.0.0" src="https://www.youtube.com/watch?v=h3h035Eyz5A" />
                                        </video> */}
                                        <ReactPlayer
                                            controls={false}
                                            className='video-player'
                                            embedOptions={false}
                                            url={this.state.popupLink}
                                        />
                                        {this.state.showTab ? (
                                            belowBoard()
                                        ) : (
                                            <Slider
                                                callback={this.showwinnerTab.bind(
                                                    this
                                                )}
                                            />
                                        )}
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>
                        <div className='leftboxtext d-flex align-items-center'></div>
                    </div>
                    <div className='rightmaindiv'>
                        {Array.from(PLAYER_DATA.entries()).map((playerPair) => {
                            const playerIndex = playerPair[0] + 1;
                            const player = playerPair[1];
                            const playerName = this.getPlayerName(
                                playerIndex,
                                true
                            );

                            const modifyName = (text) => {
                                this.setPlayerName(playerIndex, text);
                            };

                            return (
                                <React.Fragment
                                    key={
                                        'player' +
                                        playerIndex +
                                        ' ' +
                                        playerName
                                    }>
                                    <img
                                        src={player.userImage}
                                        width='100%'
                                        alt='userimage'
                                        className='userlogoImage'
                                    />
                                    <div
                                        className={
                                            'userText grad grad' + playerIndex
                                        }>
                                        <EditableLabel
                                            inputClassName='name-input'
                                            labelClassName='name-label'
                                            text={playerName}
                                            inputPlaceHolder={
                                                'Player ' +
                                                playerIndex +
                                                EDITABLE_SUFFIX
                                            }
                                            onFocusOut={modifyName}
                                        />
                                        <div className='userPoints'>
                                            {this.computePoints(playerIndex) +
                                                ' points'}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                <div className='bottomMainWrap'>
                    <div className='bottomleft curs-pointer'>
                        <img src={copypng} className='copyimg' alt='copyimg' />
                        <div className='copytext'>Copy Room Joining Code</div>
                    </div>
                    <div className='bottomcenter'>
                        <div className='bottomicons'>
                            <img
                                src={this.state.isMute ? unmute : mute}
                                alt='functimage'
                                onClick={() => this.toggle('mute')}
                                className='bottomiconimg'
                            />
                            <img
                                src={call}
                                className='bottomiconimg'
                                alt='bottomiconimg'
                            />
                            <img
                                src={this.state.isVideo ? video : novideo}
                                alt='functimage'
                                onClick={() => this.toggle('video')}
                                className='bottomiconimg'
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));
