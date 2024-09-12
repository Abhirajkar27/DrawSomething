import React, { useRef, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush, faEraser } from "@fortawesome/free-solid-svg-icons";
import "./ChallengeCreation.css";
import { GameContext } from "../context/context";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const Paint = (props) => {
  const {
    videoURL,
    setVideoURL,
    imgString,
    setImgString,
    isDrawn,
    setIsDrawn,
    playTime,
    setPlayTime,
  } = useContext(GameContext);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [recording, setRecording] = useState(false);
  const [isDrawingDone, setIsDrawingDone] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const drawStartTimeRef = useRef(0); // To track when drawing starts
  const totalDrawTimeRef = useRef(0); // To accumulate total drawing time

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
    setIsDrawn(true);
    const nativeEvent = event.nativeEvent;
    const { offsetX, offsetY } =
      nativeEvent.type === "touchstart"
        ? getTouchPos(nativeEvent)
        : nativeEvent;

    if (!recording) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    drawStartTimeRef.current = Date.now();

    // Resume recording if it was paused
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsRecordingPaused(false);
    }
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const nativeEvent = event.nativeEvent;

    const { offsetX, offsetY } =
      nativeEvent.type === "touchmove" ? getTouchPos(nativeEvent) : nativeEvent;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);

    if (drawStartTimeRef.current) {
      const drawTime = Date.now() - drawStartTimeRef.current;
      totalDrawTimeRef.current += drawTime;
      setPlayTime(totalDrawTimeRef.current / 1000); // Set playTime in seconds
    }

    // Pause the recording when drawing stops
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsRecordingPaused(true);
    }
  };

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
    contextRef.current.fillStyle = "white";
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    if (isDrawn === true) {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png");
      const base64Drawing = image.split(",")[1];
      setImgString(base64Drawing);
      //below code is to download Img
      // const link = document.createElement("a");
      // link.href = image;
      // link.download = "drawing.png";
      // link.click();
      return base64Drawing;
    } else {
      console.log("You Haven't Drawn Anything!!!");
    }
  };

  const startRecording = () => {
    setRecording(true);
    const stream = canvasRef.current.captureStream(30);
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = async () => {
    const imgUrlToSent = downloadImage();
    console.log("imageBase64", imgUrlToSent);
    setRecording(false);
    setIsDrawingDone(true);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    // Disable drawing
    setIsDrawing(false);

    if (isDrawn === true) {
      mediaRecorderRef.current.onstop = async () => {
        const videoBlob = new Blob(chunksRef.current, {
          type: "video/webm; codecs=vp9",
        });

        const fastForwardedVideoBase64 = await createFastForwardedVideo(
          videoBlob
        );
        chunksRef.current = [];
        console.log("Fast Forwarded vdo base64",fastForwardedVideoBase64);
        setVideoURL(fastForwardedVideoBase64);

        // Generate a unique file identity for video and image
        const videoFileIdentity = uuidv4() + ".webm";
        const imageFileIdentity = uuidv4() + ".png";

        // Upload video and image separately in chunks
        const videoS3Link = await uploadFileInChunks(
          fastForwardedVideoBase64,
          "video/webm",
          videoFileIdentity
        );
        const imageS3Link = await uploadFileInChunks(
          imgUrlToSent,
          "image/png",
          imageFileIdentity
        );

        console.log("isReturning", videoS3Link, imageS3Link);

        await sendDataToLocalAPI(videoS3Link, imageS3Link);
      };
    }
  };

  const uploadFileInChunks = async (fileBase64, mimeType, fileIdentity) => {
    const chunkSize = 5 * 1024 * 1024; // 5MB chunk size
    const totalChunks = Math.ceil(fileBase64.length / chunkSize);
    let currentChunk = 0;

    const uploadIdRef = { current: null };

    const reader = new FileReader();

    const uploadChunk = async (chunkData, chunkNumber, totalChunkNumber) => {
      const payload = {
        fileIdentity,
        chunkNumber: chunkNumber + 1,
        totalChunkNumber,
        chunk: chunkData,
        mimeType,
      };


      if (chunkNumber + 1 !== 1) {
        payload["uploadId"] = uploadIdRef.current;
      }

      const result = await axios.post(
        "https://vyld-cb-dev-api.vyld.io/api/v1/media/upload/chunk",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_KEY,
            "x-client-id": process.env.REACT_APP_CLIENTID,
          },
        }
      );

      console.log("file Uploaded Success", result);

      if (result.data?.data.status === "UPLOADED") {
        console.log("s3 link is", result.data.data.url);
        return result.data.data.url; // Return S3 link when fully uploaded
      }

      if (result.data?.data.status !== "UPLOADED") {
        uploadIdRef.current = result.data?.data?.uploadId;
      }
    };

    const sendChunk = async (start, end) => {
      const chunk = fileBase64.slice(start, end);
      console.log("chunked data is", chunk);

      // Wrap FileReader in a Promise
      const readFileAsDataURL = (fileChunk) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result.split(",")[1]); 
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(new Blob([fileChunk])); // Convert chunk to base64 for upload
        });
      };

      try {
        const chunkData = await readFileAsDataURL(chunk); // Wait for the FileReader to complete
        // console.log("after File Reader", chunkData);
        const s3Link = await uploadChunk(chunk
          , currentChunk, totalChunks);
        currentChunk++;

        if (currentChunk < totalChunks) {
          const nextStart = currentChunk * chunkSize;
          const nextEnd = Math.min(nextStart + chunkSize, fileBase64.length);
          return sendChunk(nextStart, nextEnd); // Upload next chunk
        }
        return s3Link; // All chunks uploaded, return the final S3 link
      } catch (error) {
        console.error("Error reading file chunk:", error);
      }
    };

    // Start uploading the first chunk
    return await sendChunk(0, chunkSize);
  };

  // Function to send S3 links and other data to local API
  const sendDataToLocalAPI = async (videoS3Link, imgS3Link) => {
    const Data = {
      type: "drawSomething",
      DrData: {
        img: imgS3Link,
        vdo: videoS3Link,
        topic: props.selectedWord,
      },
    };

    await fetch("http://localhost:5000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data sent successfully to local API:", data);
      })
      .catch((error) => {
        console.error("Error sending data to local API:", error);
      });
  };

  // Utility function to convert a Blob to Base64
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

        fastForwardedRecorder.onstop = async () => {
          const fastForwardedBlob = new Blob(fastForwardedChunks, {
            type: "video/webm; codecs=vp9",
          });
          const fastForwardedBase64 = await convertBlobToBase64(
            fastForwardedBlob
          );
          resolve(fastForwardedBase64);
        };

        let playbackRate = 1.0;
        console.log("finding duration", playTime);
        if (playTime > 30) {
          playbackRate = 5.0;
        } else if (playTime > 20) {
          playbackRate = 3.0;
        } else if (playTime > 10) {
          playbackRate = 2.0;
        }

        // Start fast-forward recording
        fastForwardedRecorder.start();

        // Set playback speed to 5x and capture frames
        videoElement.playbackRate = playbackRate;
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

  // Utility function to convert a Blob to Base64
  // const convertBlobToBase64 = (blob) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // };

  const sendDataToReceiver = (videoBase64, imgUrlToSent) => {
    const Data = {
      type: "drawSomething",
      DrData: {
        img: imgUrlToSent,
        vdo: videoBase64,
        topic: props.selectedWord,
      },
    };

    // Perform POST request
    fetch("http://localhost:5000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Sending JSON data
      },
      body: JSON.stringify(Data), // Convert Data object to JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data Sent Successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
    console.log("Data Sent Is: ", Data);
  };

  const downloadFastForwardedVideo = (fastForwardedVideoURL) => {
    console.log("url", fastForwardedVideoURL);
    const link = document.createElement("a");
    link.href = fastForwardedVideoURL;
    link.download = "YourDrawing.webm";
    link.click();
  };

  const handleSeeSequence = () => {
    stopRecording();
  };

  if (isDrawingDone) {
    if (!isDrawn) {
      return (
        <div>
          <h2>You Haven't Drawn Anything!!</h2>
        </div>
      );
    }

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
          <p>Generating video...</p>
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
      <div>Draw and send for Challenge</div>
    </div>
  );
};

export default Paint;
