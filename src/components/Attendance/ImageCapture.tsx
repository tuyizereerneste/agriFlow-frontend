import { useRef } from "react";
import Webcam from "react-webcam";

interface ImageCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const ImageCaptureModal = ({ isOpen, onClose, onCapture }: ImageCaptureModalProps) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null;
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
          onCapture(file);
          onClose();
        });
    }
  };

  const videoConstraints = {
    width: { ideal: window.innerWidth },
    height: { ideal: window.innerHeight },
    facingMode: "environment",
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{ width: '100%' }}
        />
        <button type="button" onClick={capture} style={{ marginTop: '10px' }}>Capture Image</button>
        <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
      </div>
    </div>
  );
};

export default ImageCaptureModal;