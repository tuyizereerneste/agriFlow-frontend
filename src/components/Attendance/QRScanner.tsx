import React, { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import jsQR from "jsqr";

interface QRScannerProps {
  onScan: (qrCodeData: { id: string; names: string }) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [error, setError] = useState<string | null>(null);

  const handleScan = (imageSrc: string | null) => {
    if (!imageSrc) {
      setError("No image source provided");
      return;
    }

    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Error: Unable to get canvas context");
          return;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          const qrCodeData = JSON.parse(code.data);
          onScan(qrCodeData);
          setError(null);
        } else {
          setError("No QR code found");
        }
      } catch (err) {
        setError("Error decoding QR code");
        console.error(err);
      }
    };

    image.onerror = () => {
      setError("Error loading image");
    };
  };

  const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: "environment",
  };

  return (
    <div>
      <h2>QR Scanner</h2>
      <WebcamCapture onScan={handleScan} videoConstraints={videoConstraints} />
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default QRScanner;