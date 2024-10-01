import React, { useState, useEffect } from "react";

const WordGuess = ({ word }) => {
  const [guess, setGuess] = useState(Array(word.length).fill(""));
  const [letterUsed, setLetterUsed] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);
  const [clickedIndices, setClickedIndices] = useState([]);

  useEffect(() => {
    if (word.length > 8) {
      console.error("Word must be 8 letters or less");
      return;
    }

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const wordLetters = word.toUpperCase().split("");
    const randomLetters = Array(word.length)
      .fill()
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)]);

    setLetterUsed(shuffleArray([...wordLetters, ...randomLetters]));
  }, [word]);

  const handleLetterClick = (letter, index) => {
    const newGuess = [...guess];
    if (!clickedIndices.includes(index)) {
      setClickedIndices([...clickedIndices, index]); 
    }
    const emptyIndex = newGuess.findIndex((l) => l === "");
    if (emptyIndex !== -1) {
      newGuess[emptyIndex] = letter;
      setGuess(newGuess);

      if (newGuess.join("") === word.toUpperCase()) {
        setGameStatus("correct");
      } else if (!newGuess.includes("")) {
        setGameStatus("wrong");
      }
    }
  };

  // Reset the game when the user guesses wrong
  const resetGame = () => {
    setGuess(Array(word.length).fill(""));  // Reset the guess boxes
    setClickedIndices([]);  // Reset clicked indices
    setGameStatus(null);  // Clear the game status
  };

  // Handle game status change to reset after a wrong guess
  useEffect(() => {
    if (gameStatus === "wrong") {
      setTimeout(() => {
        resetGame();  // Reset the game after a short delay
      }, 2000);  // Adjust the delay as needed
    }
  }, [gameStatus]);

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
            onClick={() => handleLetterClick(letter, index)}
            className={`letter-button ${clickedIndices.includes(index) ? 'letter-button-done' : ''}`}
            disabled={clickedIndices.includes(index)}  // Disable the button after it's clicked
          >
            {letter}
          </button>
        ))}
      </div>
      {gameStatus && (
        <div className={`game-status ${gameStatus}`}>
          {gameStatus === "correct" ? "Correct!" : "Wrong! Try Again!"}
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
        .letter-button-done {
          visibility: hidden;
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
