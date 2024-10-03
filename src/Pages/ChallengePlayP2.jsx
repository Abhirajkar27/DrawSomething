import React, { useContext, useRef } from 'react'
import vdo_contn from '../assets/img/Drawing_Board.png';
import { GameContext } from '../context/context';
import './ChallengePlayP2.css';
import SubmitnInfo from '../components/SubmitnInfo';

const ChallengePlayP2 = () => {
  const { imgString, challengeTopic, words, videoURL } =
    useContext(GameContext);

  const videoRef = useRef(null);

  return (
    <div className='challenge_PlayPage2_container_P2G6'>
       <div className="instr_P2_G6h5">Guess Rahul Mathews drawing!</div>
      {/* <img src={imgString} alt="Challenge" className='image_P2G6' /> */}
      <div className="videoContainer_P2G6">
        <img className='vdo_cont_P2G6' src={vdo_contn}/>
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
      <SubmitnInfo onSubmitClick={()=>{
        console.log("submit clicked at challengePage2");
      }} />
    </div>
  )
}

export default ChallengePlayP2
