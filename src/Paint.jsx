import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush, faEraser } from "@fortawesome/free-solid-svg-icons";
import "./Paint.css";

const Paint = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(40);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isDrawingDone, setIsDrawingDone] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [videoURL, setVideoURL] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.5;

    const context = canvas.getContext("2d");

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    contextRef.current = context;
  }, []);

  useEffect(() => {
    startRecording();
  }, []);

  const startDrawing = (event) => {
    const nativeEvent = event.nativeEvent;
    const { offsetX, offsetY } =
      nativeEvent.type === "touchstart"
        ? getTouchPos(nativeEvent)
        : nativeEvent;

    if (!recording) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const nativeEvent = event.nativeEvent;

    // For touch events, we need to calculate the touch positions
    const { offsetX, offsetY } =
      nativeEvent.type === "touchmove" ? getTouchPos(nativeEvent) : nativeEvent;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Utility function to get touch position relative to the canvas
  const getTouchPos = (touchEvent) => {
    const touch = touchEvent.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  const handleColorChange = (color) => {
    setColor(color);
    contextRef.current.strokeStyle = color;
  };

  const handleLineWidthChange = (width) => {
    setLineWidth(width);
    contextRef.current.lineWidth = width;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the white background
    contextRef.current.fillStyle = "white";
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png";
    link.click();
  };

  const startRecording = () => {
    setRecording(true);
    const stream = canvasRef.current.captureStream(30); // Capture at 30fps
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.start();

    // Start 40-second countdown
    setIsTimerActive(true);
    const newTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(newTimer);
          stopRecording(); // Stop recording and restrict drawing
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  // const stopRecording = async () => {
  //   setRecording(false);
  //   setIsTimerActive(false);
  //   setIsDrawingDone(true);
  //   setCountdown(40); // Reset the countdown

  //   // Stop media recorder
  //   if (mediaRecorderRef.current) {
  //     mediaRecorderRef.current.stop();
  //   }

  //   // Disable drawing
  //   setIsDrawing(false);

  //   mediaRecorderRef.current.onstop = async () => {
  //     const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
  //     const fastForwardedVideoURL = await createFastForwardedVideo(videoBlob);
  //     downloadFastForwardedVideo(fastForwardedVideoURL);

  //     chunksRef.current = []; // Clear recorded chunks
  //   };

  //   // Clear timer
  //   if (timer) {
  //     clearInterval(timer);
  //     setTimer(null);
  //   }
  // };

  // // Create fast-forwarded video by manipulating playbackRate
  // const createFastForwardedVideo = (videoBlob) => {
  //   return new Promise((resolve) => {
  //     const videoElement = document.createElement("video");
  //     videoElement.src = URL.createObjectURL(videoBlob);

  //     videoElement.onloadedmetadata = () => {
  //       const offscreenCanvas = document.createElement("canvas");
  //       const offscreenContext = offscreenCanvas.getContext("2d");
  //       offscreenCanvas.width = videoElement.videoWidth;
  //       offscreenCanvas.height = videoElement.videoHeight;

  //       const stream = offscreenCanvas.captureStream(30); // Capture at 30fps
  //       const fastForwardedRecorder = new MediaRecorder(stream);
  //       const fastForwardedChunks = [];

  //       fastForwardedRecorder.ondataavailable = (e) => {
  //         fastForwardedChunks.push(e.data);
  //       };

  //       fastForwardedRecorder.onstop = () => {
  //         const fastForwardedBlob = new Blob(fastForwardedChunks, {
  //           type: "video/webm",
  //         });
  //         const fastForwardedVideoURL = URL.createObjectURL(fastForwardedBlob);
  //         resolve(fastForwardedVideoURL);
  //       };

  //       // Start fast-forward recording
  //       fastForwardedRecorder.start();

  //       // Set playback speed to 5x and capture frames
  //       videoElement.playbackRate = 5.0;
  //       videoElement.play();
  //       videoElement.onplay = () => {
  //         const drawFrame = () => {
  //           offscreenContext.drawImage(videoElement, 0, 0);
  //           if (!videoElement.paused && !videoElement.ended) {
  //             requestAnimationFrame(drawFrame);
  //           } else {
  //             fastForwardedRecorder.stop();
  //           }
  //         };
  //         drawFrame();
  //       };
  //     };
  //   });
  // };

  const stopRecording = async () => {
    setRecording(false);
    setIsTimerActive(false);
    setIsDrawingDone(true);
    setCountdown(40); // Reset the countdown

    // Stop media recorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    // Disable drawing
    setIsDrawing(false);

    mediaRecorderRef.current.onstop = async () => {
      const videoBlob = new Blob(chunksRef.current, {
        type: "video/webm; codecs=vp9",
      });
      console.log(videoBlob);
      const fastForwardedVideoURL = await createFastForwardedVideo(videoBlob);

      // Set the fast-forwarded video URL for displaying
      setVideoURL(fastForwardedVideoURL);

      // Trigger download of the fast-forwarded video
      downloadFastForwardedVideo(fastForwardedVideoURL);

      // Clear recorded chunks
      chunksRef.current = [];
    };

    // Clear timer
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const createFastForwardedVideo = (videoBlob) => {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(videoBlob);

      videoElement.onloadedmetadata = () => {
        const offscreenCanvas = document.createElement("canvas");
        const offscreenContext = offscreenCanvas.getContext("2d");
        offscreenCanvas.width = videoElement.videoWidth;
        offscreenCanvas.height = videoElement.videoHeight;

        const stream = offscreenCanvas.captureStream(30); // Capture at 30fps
        const fastForwardedRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp9",
        });
        const fastForwardedChunks = [];

        fastForwardedRecorder.ondataavailable = (e) => {
          fastForwardedChunks.push(e.data);
        };

        fastForwardedRecorder.onstop = () => {
          const fastForwardedBlob = new Blob(fastForwardedChunks, {
            type: "video/webm; codecs=vp9",
          });
          const fastForwardedVideoURL = URL.createObjectURL(fastForwardedBlob);
          resolve(fastForwardedVideoURL);
        };

        // Start fast-forward recording
        fastForwardedRecorder.start();

        // Set playback speed to 5x and capture frames
        videoElement.playbackRate = 5.0;
        videoElement.play();
        videoElement.onplay = () => {
          const drawFrame = () => {
            offscreenContext.drawImage(videoElement, 0, 0);
            if (!videoElement.paused && !videoElement.ended) {
              requestAnimationFrame(drawFrame);
            } else {
              fastForwardedRecorder.stop();
            }
          };
          drawFrame();
        };
      };
    });
  };

  // Trigger download of the fast-forwarded video
  const downloadFastForwardedVideo = (fastForwardedVideoURL) => {
    const link = document.createElement("a");
    link.href = fastForwardedVideoURL;
    link.download = "fast_forwarded_drawing.webm";
    link.click();
  };

  const handleSeeSequence = () => {
    stopRecording();
  };

  if (isDrawingDone) {
    return (
      <div>
        <h2>{props.selectedWord} drawn successfully!</h2>
        {videoURL ? (
          <div>
            <h3>Watch the drawing sequence:</h3>
            <video
              src={videoURL}
              controls
              autoPlay
              loop
              style={{ width: "100%", maxWidth: "600px" }}
            />
          </div>
        ) : (
          <>
            <p>Loading video...</p>
            <p>Please Wait</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="CreationLanding_G6h5">
      <div>Draw {props.selectedWord}</div>
      <div>
        <button onClick={() => handleColorChange("black")}>
          <FontAwesomeIcon icon={faPaintBrush} color="black" />{" "}
        </button>
        <button onClick={() => handleColorChange("blue")}>
          <FontAwesomeIcon icon={faPaintBrush} color="blue" />{" "}
        </button>
        <button onClick={() => handleColorChange("green")}>
          <FontAwesomeIcon icon={faPaintBrush} color="green" />{" "}
        </button>
        <button onClick={() => handleColorChange("white")}>
          <FontAwesomeIcon icon={faEraser} />
        </button>
        <button onClick={() => handleLineWidthChange(3)}>Thin</button>
        <button onClick={() => handleLineWidthChange(7)}>Medium</button>
        <button onClick={() => handleLineWidthChange(12)}>Thick</button>
        <button onClick={clearCanvas}>Clear</button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
        onTouchCancel={finishDrawing}
        style={{
          border: "1px solid black",
          marginTop: "10px",
        }}
      />
      <div>
        <button className="btn_drawPage_G5h6" onClick={downloadImage}>
          Download Image
        </button>
        <button className="btn_drawPage_G5h6" onClick={handleSeeSequence}>
          Submit
        </button>
      </div>
      {isTimerActive && <div>Time remaining: {countdown} seconds</div>}
    </div>
  );
};

export default Paint;
