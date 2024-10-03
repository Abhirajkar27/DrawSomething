import React from "react";
import submit_btn from "../assets/img/Submit.png";
import GiveUp_btn from "../assets/img/Give_up.png";
import "./SubmitnInfo.css";

const SubmitnInfo = (props) => {
  return (
    <div className="submitInfo_wrapper" style={props.isGiveUp ?{marginTop:"-1.8vh"}:{}}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {props.isGiveUp ? (
          <img
            onClick={props.onSubmitClick}
            className="startbtn_G6h5"
            src={GiveUp_btn}
            alt="GiveUp_btn"
          />
        ) : (
          <img
            onClick={props.onSubmitClick}
            className="startbtn_G6h5"
            src={submit_btn}
            alt="submit_btn"
          />
        )}
      </div>
      <div style={{ marginLeft: "auto", marginRight: "5.5vw" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <g clip-path="url(#clip0_2427_16748)">
            <rect
              width="32"
              height="32"
              rx="16"
              fill="black"
              fill-opacity="0.19"
            />
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              rx="15.5"
              stroke="white"
              stroke-opacity="0.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.4316 23.1095C14.0076 23.0935 14.4156 23.0215 14.6556 22.8935C14.9116 22.7495 15.0716 22.5495 15.1356 22.2935C15.1996 22.0375 15.2316 21.6215 15.2316 21.0455V15.8855C15.2316 15.3735 15.1996 15.0055 15.1356 14.7815C15.0716 14.5415 14.9116 14.3575 14.6556 14.2295C14.4156 14.1015 14.0076 14.0295 13.4316 14.0135V13.1495L17.2716 12.4055L17.8236 12.6215V21.0455C17.8236 21.6215 17.8556 22.0375 17.9196 22.2935C17.9836 22.5495 18.1356 22.7495 18.3756 22.8935C18.6316 23.0215 19.0476 23.0935 19.6236 23.1095V24.0695L19.0716 24.0455C18.0956 23.9815 17.2476 23.9495 16.5276 23.9495C16.3196 23.9495 15.4476 23.9815 13.9116 24.0455L13.4316 24.0695V23.1095ZM16.2636 7.4375C16.8076 7.4375 17.2076 7.5815 17.4636 7.8695C17.7356 8.1575 17.8716 8.5575 17.8716 9.0695C17.8716 9.5815 17.7436 9.9575 17.4876 10.1975C17.2316 10.4215 16.8236 10.5335 16.2636 10.5335C15.7356 10.5335 15.3436 10.4215 15.0876 10.1975C14.8316 9.9575 14.7036 9.5815 14.7036 9.0695C14.7036 8.5575 14.8316 8.1575 15.0876 7.8695C15.3596 7.5815 15.7516 7.4375 16.2636 7.4375Z"
              fill="#BCC9DA"
            />
          </g>
          <defs>
            <clipPath id="clip0_2427_16748">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default SubmitnInfo;
