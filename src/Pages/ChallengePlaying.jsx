import React, { useContext, useRef, useState } from "react";
import { GameContext } from "../context/context";

const ChallengePlaying = () => {
  const { imgString, challengeTopic, words, videoURL } = useContext(GameContext);
  const [selectedWord, setSelectedWord] = useState("");
  const [isWinner, setIsWinner] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); 
  const videoRef = useRef(null);

  // Check if the selected word is correct
  const handleWordSelection = (word) => {
    setSelectedWord(word);
    if (word === challengeTopic) {
      setIsWinner(true);
    } else {
      setIsWinner(false);
    }
  };

  // Function to handle user interaction and start video
  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true); 
    }
  };

  return (
    <div style={styles.container}>
      {/* Image from S3 link */}
      <img src={imgString} alt="Challenge" style={styles.image} />

      {/* Video Section */}
      <div style={styles.videoContainer}>
        {videoURL && (
          <video
            ref={videoRef}
            src={videoURL}
            style={styles.video}
            loop
            controls
          ></video>
        )}
        {!isVideoPlaying && (
          <button onClick={handleVideoPlay} style={styles.playButton}>
            Play Video
          </button>
        )}
      </div>

      {/* Words List */}
      <div style={styles.wordsContainer}>
        <h3>Select the correct word:</h3>
        <div style={styles.wordsList}>
          {words.map((word, index) => (
            <button
              key={index}
              style={styles.wordButton}
              onClick={() => handleWordSelection(word)}
              className={selectedWord === word ? "selected" : ""}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Win Message */}
        {isWinner && <h3 style={styles.winMessage}>You Win!</h3>}
      </div>
    </div>
  );
};

// Styling for the component
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  image: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #ccc",
  },
  videoContainer: {
    position: "relative",
    width: "600px",
    height: "400px",
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  wordsContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  wordsList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  wordButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    transition: "background-color 0.3s",
  },
  winMessage: {
    marginTop: "20px",
    fontSize: "24px",
    color: "green",
  },
};

export default ChallengePlaying;
