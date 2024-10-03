import React, { useContext, useRef, useState } from "react";
import { GameContext } from "../context/context";
import WordGuess from "../components/WordGuess";
import "./ChallengePlaying.css";
import SubmitnInfo from "../components/SubmitnInfo";
import Modal from "../components/Modal";
import vdo_contn from "../assets/img/Drawing_Board.png";

const ChallengePlaying = (props) => {
  const { imgString, challengeTopic, words, videoURL } =
    useContext(GameContext);
  const [selectedWord, setSelectedWord] = useState("");
  const [isWinner, setIsWinner] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  const wor = "SPACINGS";

  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <div className="challenge_Play_container_P2G6">
      <div className="instr_P2_G6h5">Guess Rahul Mathews drawing!</div>
      {/* <img src={imgString} alt="Challenge" className='image_P2G6' /> */}
      <div className="videoContainer_P2G6">
        <img className="vdo_cont_P2G6" src={vdo_contn} />
        {videoURL && (
          <video
            ref={videoRef}
            src={videoURL}
            className="video_P2G6"
            loop
            controls
          ></video>
        )}
        {/* {!isVideoPlaying && (
          <button onClick={handleVideoPlay} className="playButton_P2G6">
            Play Video
          </button>
        )} */}
      </div>
      <WordGuess word={wor} isWinner={isWinner} setIsWinner={setIsWinner}/>
      {isWinner === null ? (
        <SubmitnInfo
          isGiveUp={true}
          onSubmitClick={() => {
            setShowModal(true);
          }}
        />
      ) : (
        <SubmitnInfo
          onSubmitClick={() => {
            console.log("submit clicked at challengePage2");
          }}
        />
      )}
      <Modal
        showModal={showModal}
        onConfirm={setIsWinner}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default ChallengePlaying;
