'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        
        // Automatically take picture after a short delay
        setTimeout(() => {
          takePicture();
        }, 1000);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    requestCamera();
  }, []);

  const takePicture = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataURL = canvas.toDataURL('image/png');
        setCapturedImage(imageDataURL);
        
        // Stop the camera after taking the picture
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        // Automatically download the image
        const link = document.createElement('a');
        link.href = imageDataURL;
        link.download = `picture-${new Date().toISOString()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Send the image to the server
        try {
          await fetch('/api/save-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageDataURL }),
          });
        } catch (error) {
          console.error('Failed to save image:', error);
        }
      }
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-pink-500 mb-8">Hi cutie</h1>
      
      <div className="relative flex flex-col items-center">
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-96 h-72 object-cover rounded-lg"
          />
        ) : (
          <img 
            src={capturedImage} 
            alt="Captured photo" 
            className="w-96 h-72 object-cover rounded-lg"
          />
        )}
      </div>
    </main>
  );
} 