import React from 'react';

export default class Slider extends React.Component {
    constructor() {
        super();
        this.state = {
            time: {},
            seconds: 10,
            showbtn: true,
            selectedMin: false,
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
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

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
    }

    startTimer() {
        this.setState({ showbtn: false });
        if (this.timer === 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds === 0) {
            console.log('000000');
            this.props.callback();
            clearInterval(this.timer);
        }
    }

    handleRollChange() {
        // debugger;
    }

    render() {
        return (
            <div className='container'>
                <div className='remngtime'>
                    {this.state.showbtn ? 'Select Timer' : 'Remaining Time'}
                </div>
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
                <form ref='form' className='btnform'>
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
