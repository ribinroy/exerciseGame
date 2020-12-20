import React from 'react';
import TimerAudioNormal from './Audio/Timer 1 sec.wav';
import TimerAudioFinal from './Audio/Timer Last 3(5) seconds.wav';

export default class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: {},
            seconds: 0,
            showbtn: true,
            selectedmin: 0,
            selectedsec: 0,
            valueGroups: { minute: 0, seconds: 0 },
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.timerAudioNormal = new Audio(TimerAudioNormal);
        this.timerAudioFinal = new Audio(TimerAudioFinal);
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            h: hours,
            m: minutes,
            s: seconds,
        };
        return obj;
    }

    componentDidUpdate() {
        if (!this.props.running) {
            this.timerAudioFinal.currentTime = 0;
            this.timerAudioNormal.currentTime = 0;
            clearInterval(this.timer);
        }
    }
    componentDidMount() {
        if (this.props.time === 0 || this.props.time === undefined) {
            this.props.callback();
        }

        this.timerAudioNormal.currentTime = 0;
        this.timerAudioFinal.currentTime = 0;
        this.setState({ seconds: this.props.time });
        let timeLeftVar = this.secondsToTime(this.props.time);
        this.setState({ time: timeLeftVar });
    }

    startTimer() {
        // const totalsec =
        //     this.state.valueGroups.minute * 60 + this.state.valueGroups.seconds;
        // this.setState({ seconds: totalsec });
        if (this.timer === 0 && this.state.seconds > 0) {
            this.countDown();
            this.timerAudioNormal.play();
            this.timer = setInterval(this.countDown, 1000);
        }
        this.activateTimer();
    }

    activateTimer() {
        this.setState({ showbtn: false });
    }

    countDown() {
        if (!this.props.running) {
            clearInterval(this.timer);
            return false;
        }
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds <= 3) {
            this.timerAudioNormal.play();
            this.timerAudioNormal.pause();
            this.timerAudioFinal.currentTime = 0;
            this.timerAudioFinal.play();
        } else {
            this.timerAudioNormal.currentTime = 0;
            this.timerAudioNormal.play();
        }
        if (seconds === 0) {
            this.timerAudioFinal.pause();
            console.log('000000');
            this.props.callback();
            clearInterval(this.timer);
        }
    }

    handleRollChange(item, value) {
        let totalsec = 1;
        if (item === 'seconds') {
            totalsec = totalsec + this.state.valueGroups.minute * 60 + value;
        } else if (item === 'minute') {
            totalsec = totalsec + value * 60 + this.state.valueGroups.seconds;
        }
        this.setState(({ valueGroups }) => ({
            valueGroups: {
                ...valueGroups,
                [item]: value,
            },
            seconds: totalsec,
        }));
    }

    render() {
        let rollData = {
            minute: [],
            seconds: [],
        };
        for (let i = 0; i < 60; i++) {
            rollData.minute.push(i);
            rollData.seconds.push(i);
        }
        return (
            <div className='container'>
                <div className='remngtime'>Remaining Time</div>
                <div className='displayedTime'>
                    <h1>
                        {this.state.time.m < 10
                            ? `0${this.state.time.m}`
                            : this.state.time.m}{' '}
                        :{' '}
                        {this.state.time.s < 10
                            ? `0${this.state.time.s}`
                            : this.state.time.s}
                    </h1>
                </div>
                {/* <Input onSetCountdown={this.handleCountdown.bind(this)}/> */}
                <form ref='form' className='btnform flex-column'>
                    {/* <input type="text" ref="seconds" placeholder="enter time in seconds"/> */}
                    {this.state.showbtn ? (
                        <button className='btnbox' onClick={this.startTimer}>
                            Start Now
                        </button>
                    ) : null}
                </form>
            </div>
        );
    }
}
