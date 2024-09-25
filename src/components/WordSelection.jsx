import React, { useContext, useEffect, useState } from "react";
import Paint from "../Pages/ChallengeCreation";
import "./WordSelection.css";
import { GameContext } from "../context/context";
import Delulu_logo from "../assets/img/DELUKLU.png";
import picking_contn from "../assets/img/choose_rectangle.png";
import option_contn from "../assets/img/option_rectangle.png";
import new_btn from "../assets/img/Get_New_words.png";
import submit_btn from "../assets/img/Submit.png";

const WordSelection = (props) => {
  const { selectedWord, setSelectedWord, isChallenge, setIsChallenge, words } =
    useContext(GameContext);

  const [isPaintVisible, setIsPaintVisible] = useState(false);
  const [options, setOptions] = useState([]);

  const handleWordSelect = (word) => {
    console.log("here", word);
    setSelectedWord(word);
  };

  const selectRandomWords = () => {
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    return shuffledWords.slice(0, 3);
  };

  useEffect(() => {
    setOptions(selectRandomWords());
  }, []);

  const getNewOptions = () => {
    console.log("hey");
    const optionsSet = new Set(options);
    const newOptions = [];
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    for (const word of shuffledWords) {
      if (!optionsSet.has(word)) {
        newOptions.push(word);
      }
      if (newOptions.length === 3) {
        setOptions(newOptions);
        break;
      }
    }
    return;
  };

  const handleStart = () => {
    if (selectedWord) {
      setIsPaintVisible(true);
    } else {
      alert("Please select a word first!");
    }
  };

  useEffect(() => {
    console.log("running");
    if (isChallenge) {
      props.setAppPage("ChallengeMode");
    }
  }, []);

  if (isPaintVisible) {
    return <Paint selectedWord={selectedWord} />;
  }

  return (
    <div className="wordSelectionPage_G6h5">
      <img
        className="delulu_logo_main"
        src={Delulu_logo}
        alt="delulu_logo"
      ></img>
      <div className="WSP_head_G6h5">
        Let's draw something for Rahul Mathews to guess
      </div>
      <div className="picking_contn_G6h5">
        <img className="box_G6h5" src={picking_contn} alt="container_box"></img>
        <div>
          <span>Choose a word to Draw</span>
          <div style={{ marginTop: "4vh" }}>
            {options.map((word, index) => (
              <div
                key={index}
                className="word-image-wrapper"
                onClick={() => handleWordSelect(word)}
              >
                <img src={option_contn} alt={word} className="word-image" />
                <div className="word-overlay">{word}</div>
              </div>
            ))}
          </div>
          <img
            onClick={getNewOptions}
            className="new_option_btn_G6h5"
            src={new_btn}
          />
        </div>
      </div>
      <img
        onClick={handleStart}
        className="startbtn_G6h5"
        src={submit_btn}
        alt="submit_btn"
      />
    </div>
  );
};

export default WordSelection;
