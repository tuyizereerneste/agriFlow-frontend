import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture: React.FC<{ onScan: (imageSrc: string | null) => void; videoConstraints: MediaTrackConstraints }> = ({ onScan, videoConstraints }) => {
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        onScan(imageSrc);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onScan]);

  return (
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    />
  );
};

export default WebcamCapture;