import React, { useState, useCallback } from 'react';

const Timer = (props) => {
    const { seconds, timerIsActive, onStartTimer, onEndTimer } = props;
    const [time, setTime] = useState(seconds);
    const [inter, setInter] = useState(null);

    const handleChange = (e) => {
        setTime(e.target.value);
        clearInterval(inter);
        setInter(null);
    };

    const startTimer = useCallback(() => {
        const decrement = () => {
            setTime((prevTime) => Math.max(prevTime - 1, 0));
        };

        if (inter === null) {
            onStartTimer();
            setInter(setInterval(decrement, 1000));
            return () => clearInterval(inter);
        }
    }, [setTime, inter, setInter, onStartTimer]);

    const displayTime = (time) => {
        if (time <= 0) {
            onEndTimer();
            clearInterval(inter);
            return 'Time!';
        }

        const padZero = (number) => {
            return number < 10 ? '0' + number : number.toString();
        };

        return Math.floor(time / 60) + ':' + padZero(time % 60);
    };

    if (timerIsActive) {
        startTimer();
    }

    return (
        <div className='timer'>
            <h1 className='timer-display'>{displayTime(time)}</h1>
            <div className='timer-config'>
                <input onChange={handleChange} />
                <button onClick={startTimer}>Start timer</button>
            </div>
        </div>
    );
};

export default Timer;
