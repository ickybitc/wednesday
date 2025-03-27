'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [ipAddress, setIpAddress] = useState<string>('');

  useEffect(() => {
    const getIp = async () => {
      try {
        const response = await fetch('/api/get-ip');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error getting IP:', error);
        setIpAddress('Unknown IP');
      }
    };

    getIp();
  }, []);

  useEffect(() => {
    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        
        // Take picture after 1 second delay
        setTimeout(() => {
          takePicture();
        }, 1000);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    requestCamera();
  }, []);

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataURL = canvas.toDataURL('image/png');
        setCapturedImage(imageDataURL);
        
        // Stop the camera and hide it
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraActive(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-black mb-4 font-cursive">I got your pic and IP in a single day</h1>
      <div className="text-black text-2xl mb-8 font-cursive">IP: {ipAddress}</div>
      
      <div className="relative flex flex-col items-center">
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-96 h-72 object-cover rounded-lg"
          />
        ) : (
          <div className="w-96 h-72 bg-pink-100 rounded-lg flex flex-col items-center justify-center">
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured photo" 
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
} 