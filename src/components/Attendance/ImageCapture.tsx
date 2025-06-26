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
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
        maxWidth: '500px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{
            width: '100%',
            borderRadius: '5px',
            marginBottom: '15px'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={capture}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px'
            }}
          >
            <span style={{ marginRight: '8px' }}>📷</span> Capture Image
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default ImageCaptureModal;