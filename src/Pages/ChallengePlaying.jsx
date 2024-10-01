import React, { useContext, useRef, useState } from "react";
import { GameContext } from "../context/context";
import WordGuess from "../components/WordGuess";
import './ChallengePlaying.css';

const ChallengePlaying = () => {
  const { imgString, challengeTopic, words, videoURL } = useContext(GameContext);
  const [selectedWord, setSelectedWord] = useState("");
  const [isWinner, setIsWinner] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const wor = "APPLE";

  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <div className="challenge_Play_container_P2G6">
      {/* <img src={imgString} alt="Challenge" className='image_P2G6' /> */}
      <div className="videoContainer_P2G6">
        {videoURL && (
          <video
            ref={videoRef}
            src={videoURL}
            className="video_P2G6"
            loop
            controls
          ></video>
        )}
        {!isVideoPlaying && (
          <button onClick={handleVideoPlay} className="playButton_P2G6">
            Play Video
          </button>
        )}
      </div>
      <WordGuess word={wor} />
    </div>
  );
};

export default ChallengePlaying;
