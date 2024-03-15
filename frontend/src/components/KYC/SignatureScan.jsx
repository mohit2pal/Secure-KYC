import React, { useRef, useState, useEffect, useContext } from "react";
import Webcam from "react-webcam";
import { DataContext } from "../../shared/containers/provider";
import ReactAudioPlayer from 'react-audio-player';
import axios from "axios";
import { HOST } from "../../shared/const/const";

const SignatureScanner = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setready] = useState(false)
  //   const [isDocumentDetected, setIsDocumentDetected] = useState(false);
  const [imageData, setImageData] = useState(null);
  let { startContent, speechContent, setspeechContent, setstep } = useContext(DataContext);

  // useEffect(() => {
  //   // Captures after 5 seconds
  //   setTimeout(() => {
  //     captureScreenshot();
  //   }, 10000);
  // }, []);

  const captureScreenshot = () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.5); // Convert captured image data to base64 encoded format
      setImageData(imageData);
      console.log(imageData);
    }
  };

  const handleReady = () => {
    setready(true)
    setTimeout(() => {
      handleStartEnded();
    }, 1000);
  };

  const handleStartEnded = () => {
    setTimeout(() => {
      captureScreenshot();
    }, 10000);
  };

  const handlePageEnded = () => {
    console.log(imageData)
    axios.post(`${HOST}/get_signature`, { "image": imageData })
      .then(response => {
        console.log(response.data);
        setTimeout(() => {
          setstep(9);
        }, 3000);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  const handleRetake = () => {
    setTimeout(() => {
      setImageData(null);
      setstep(8);
    }, 1500);
  };

  return (
    <article className="rounded-xl border border-blue-700 bg-gray-100 p-4 m-4 mt-11">
      <div className="rounded-lg border border-blue-700 p-4 flex items-center justify-between">
        {
          ready &&
          <div>
            <Webcam ref={webcamRef} className={imageData ? "hidden" : ""} />
            <img
              src={`${imageData}`}
              className={!imageData ? "hidden" : ""}
              alt="Captured Profile"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        }
      </div>
      {
        !ready &&
        <>
          <button onClick={() => handleReady()} className="bg-green-500 p-3 m-2 border-black rounded-md text-white">
            Ready
          </button>
          <ReactAudioPlayer
            id="audio"
            src={Object.values(speechContent)[12]}
            autoPlay={true}
          />
        </>
      }
      {
        imageData &&
        <div>
          <button onClick={() => handlePageEnded()} className="bg-green-500 p-3 m-2 border-black rounded-md text-white">
            Next
          </button>
          <ReactAudioPlayer
            id="audio"
            src={Object.values(speechContent)[13]}
            autoPlay={true}
          />
          <button onClick={() => handleRetake()} className="bg-red-500 p-3 m-2 border-black rounded-md text-white">
            Retake
          </button>
        </div>
      }
    </article>
  );
};

export default SignatureScanner;
