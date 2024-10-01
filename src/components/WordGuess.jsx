import React, { useState, useEffect } from "react";
import "./WordGuess.css";

const WordGuess = ({ word }) => {
  const [guess, setGuess] = useState(Array(word.length).fill(""));
  const [letterUsed, setLetterUsed] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);
  const [clickedIndices, setClickedIndices] = useState([]);

  useEffect(() => {
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

  const resetGame = () => {
    setGuess(Array(word.length).fill(""));
    setClickedIndices([]);
    setGameStatus(null);
  };

  useEffect(() => {
    if (gameStatus === "wrong") {
      setTimeout(() => {
        resetGame();
      }, 2000);
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
            className={`letter-button ${
              clickedIndices.includes(index) ? "letter-button-done" : ""
            }`}
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
    </div>
  );
};

export default WordGuess;
