'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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

  const handleBuyOut = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/catgirl.png"
        alt="Background"
        fill
        className="object-cover"
        priority
        quality={100}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-4 font-cursive text-center shadow-lg">
          I got your pic and IP in a single day
        </h1>
        <div className="text-white text-2xl mb-8 font-cursive text-center shadow-md">
          IP: {ipAddress}
        </div>
        
        <div className="relative flex flex-col items-center">
          {isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-96 h-72 object-cover rounded-lg shadow-xl"
            />
          ) : (
            <div className="w-96 h-72 bg-black/50 rounded-lg flex flex-col items-center justify-center shadow-xl backdrop-blur-sm">
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Captured photo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
          )}
          
          {/* Buy Out Button */}
          <button
            onClick={handleBuyOut}
            className="mt-8 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white text-2xl font-cursive rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white/20 backdrop-blur-sm"
          >
            buy out
          </button>
        </div>
      </div>
    </main>
  );
} 