'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        
        // Automatically take picture after a short delay to ensure camera is ready
        setTimeout(() => {
          alert('Picture taken!');
        }, 1000);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    requestCamera();
  }, []);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-pink-500 mb-8">Hi cutie</h1>
      
      {!hasPermission ? (
        <div className="text-pink-500 text-xl">
          Please allow camera access to take a picture
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-96 h-72 object-cover rounded-lg"
          />
        </div>
      )}
    </main>
  );
} 