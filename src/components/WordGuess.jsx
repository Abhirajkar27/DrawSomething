import React, { useState, useEffect } from 'react';

const WordGuess = ({ word }) => {
  const [guess, setGuess] = useState(Array(word.length).fill(''));
  const [letterUsed, setLetterUsed] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);

  useEffect(() => {
    if (word.length > 8) {
      console.error('Word must be 8 letters or less');
      return;
    }

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const wordLetters = word.toUpperCase().split('');
    const randomLetters = Array(word.length)
      .fill()
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)]);

    setLetterUsed(shuffleArray([...wordLetters, ...randomLetters]));
  }, [word]);

  const handleLetterClick = (letter) => {
    const newGuess = [...guess];
    const emptyIndex = newGuess.findIndex(l => l === '');
    if (emptyIndex !== -1) {
      newGuess[emptyIndex] = letter;
      setGuess(newGuess);

      if (newGuess.join('') === word.toUpperCase()) {
        setGameStatus('correct');
      } else if (!newGuess.includes('')) {
        setGameStatus('wrong');
      }
    }
  };

  return (
    <div className="word-guess-game">
      <div className="guess-boxes">
        {guess.map((letter, index) => (
          <div key={index} className="guess-box">
            {letter}
          </div>
        ))}
      </div>
      <div className="letter-grid">
        {letterUsed.map((letter, index) => (
          <button
            key={index}
            onClick={() => handleLetterClick(letter)}
            className="letter-button"
          >
            {letter}
          </button>
        ))}
      </div>
      {gameStatus && (
        <div className={`game-status ${gameStatus}`}>
          {gameStatus === 'correct' ? 'Correct!' : 'Wrong!'}
        </div>
      )}
      <style jsx>{`
        .word-guess-game {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .guess-boxes {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .guess-box {
          width: 40px;
          height: 40px;
          border: 2px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
        }
        .letter-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        .letter-button {
          width: 40px;
          height: 40px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }
        .letter-button:hover {
          background-color: #357ae8;
        }
        .game-status {
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: bold;
        }
        .game-status.correct {
          background-color: #4caf50;
          color: white;
        }
        .game-status.wrong {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default WordGuess;