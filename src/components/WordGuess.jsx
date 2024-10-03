import React, { useState, useEffect } from "react";
import "./WordGuess.css";
import shuffle_btn from "../assets/img/SHUFFLE.png";
import clear_btn from "../assets/img/CLEAR.png";

const WordGuess = ({ word }) => {
  const [guess, setGuess] = useState(Array(word.length).fill(""));
  const [letterUsed, setLetterUsed] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);
  const [clickedIndices, setClickedIndices] = useState([]);
  const [isGuessedWrong, setIsGuessedWrong] = useState(false);
  const [isGuessedCorrect, setIsGuessedCorrect] = useState(false);

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

  function handleShuffleArray() {
    const newLetterUsed = [...letterUsed];
    const unclickedLetters = newLetterUsed.filter(
      (_, index) => !clickedIndices.includes(index)
    );
    for (let i = unclickedLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unclickedLetters[i], unclickedLetters[j]] = [
        unclickedLetters[j],
        unclickedLetters[i],
      ];
    }
    let unclickedIndex = 0;
    for (let i = 0; i < newLetterUsed.length; i++) {
      if (!clickedIndices.includes(i)) {
        newLetterUsed[i] = unclickedLetters[unclickedIndex++];
      }
    }
    setLetterUsed(newLetterUsed);
  }

  function handleClearGuess() {
    setGuess(Array(word.length).fill(""));
    setClickedIndices([]);
    setGameStatus(null);
  }

  function handleGuessBoxClick(index) {
    if (!guess[index]) return; 
  
    const updatedGuess = [...guess];
    const updatedLetterUsed = [...letterUsed];
    
    const currentIndice = clickedIndices[0]; 
    if (currentIndice !== undefined) { 
      updatedLetterUsed[currentIndice] = guess[index];
      setLetterUsed(updatedLetterUsed); 
      
      const updatedClickedIndices = clickedIndices.slice(1); //this slice method is used to remove 1st element from array...
      setClickedIndices(updatedClickedIndices); 
    }
  
    updatedGuess[index] = ""; 
    setGuess(updatedGuess); 
  }
  

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
        setIsGuessedCorrect(true);
        setGameStatus("correct");
      } else if (!newGuess.includes("")) {
        setIsGuessedWrong(true);
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
        setIsGuessedWrong(false);
        resetGame();
      }, 2000);
    }
  }, [gameStatus]);

  return (
    <div className="word-guess-game">
      <div className="guess-boxes">
        {guess.map((letter, index) => (
          <div
            key={index}
            onClick={()=>handleGuessBoxClick(index)}
            className={`guess-box ${
              isGuessedCorrect ? "letter-button-correct" : ""
            } ${isGuessedWrong ? "letter-button-wrong" : ""}`}
          >
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
          {gameStatus === "correct" ? "Correct" : "Wrong"}
        </div>
      )}
      <div className="guess_manage_btn_cont_G6">
        <img
          onClick={handleShuffleArray}
          className="guess_manage_btn_G6"
          src={shuffle_btn}
        />
        <img
          onClick={handleClearGuess}
          className="guess_manage_btn_G6"
          src={clear_btn}
        />
      </div>
    </div>
  );
};

export default WordGuess;
