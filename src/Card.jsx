import React from 'react';

const Card = (props) => {
  const { number, text, link, winner, status, updater } = props;

  let classes = 'jeopardy-card';

  // Add gradient classes if there is a winner.
  if (winner) {
    classes += ' grad grad' + winner;
  }

  // status: 0 = number, 1 = text
  return (
    <div className={classes} onClick={updater}>
      {
        status === 0
          ? <h2>{number}</h2>
          : <a className='jeopardy-link' href={link} rel='noreferrer' target='_blank'>{text}</a>
      }
    </div>
  );
};

export default Card;
