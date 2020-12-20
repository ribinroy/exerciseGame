import React from 'react';
import ButtonAudio from './Audio/Button Click.wav';

const Card = (props) => {
    const { number, text, link, winner, status, updater } = props;
    const audio = new Audio(ButtonAudio);

    let classes = 'jeopardy-card';

    // Add gradient classes if there is a winner.
    if (winner) {
        classes += ' grad grad' + winner;
    }

    function onClickHandler() {
        audio.play();
        updater();
    }
    // status: 0 = number, 1 = text
    return (
        <div className={classes} onClick={onClickHandler}>
            {status === 0 ? (
                <h2>{number}</h2>
            ) : (
                <a
                    className='jeopardy-link'
                    href={link}
                    rel='noreferrer'
                    target='_blank'>
                    {text}
                </a>
            )}
        </div>
    );
};

export default Card;
