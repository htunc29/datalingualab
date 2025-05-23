"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function CameraCapture({ bigData, setBigData }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filter, setFilter] = useState('normal');
  const [flashActive, setFlashActive] = useState(false);

  const filters = [
    { id: 'normal', name: 'Normal', class: '' },
    { id: 'grayscale', name: 'Siyah-Beyaz', class: 'grayscale' },
    { id: 'sepia', name: 'Sepya', class: 'sepia' },
    { id: 'vintage', name: 'Vintage', class: 'brightness-95 contrast-125 saturate-90 sepia-25' },
    { id: 'cool', name: 'Soğuk', class: 'brightness-110 contrast-110 hue-rotate-15' },
    { id: 'warm', name: 'Sıcak', class: 'brightness-105 contrast-105 hue-rotate-330 saturate-125' }
  ];

  const idRef = useRef(`cameracapture-${Math.floor(Math.random() * 9999)}`);
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: idRef.current,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const startCamera = async () => {
    try {
      setCameraLoading(true);
      setCameraError(false);
      const constraints = { video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Kamera erişimi hatası:", err);
      setCameraError(true);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(
        document.fullscreenElement || document.webkitFullscreenElement ? true : false
      );
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    };
  }, []);

  const capturePhoto = (useCountdown = false) => {
    if (useCountdown) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(timer);
            takePicture();
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } else {
      takePicture();
    }
  };

  const takePicture = () => {
    if (videoRef.current) {
      // Activate flash effect
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 200);

      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Apply filter effect on canvas if not normal
      if (filter !== 'normal') {
        const currentFilter = filters.find(f => f.id === filter);
        if (currentFilter) {
          // Apply CSS-like filters to canvas
          if (filter === 'grayscale') {
            applyGrayscale(ctx, canvas);
          } else if (filter === 'sepia') {
            applySepia(ctx, canvas);
          } else if (filter === 'vintage') {
            applyVintage(ctx, canvas);
          } else if (filter === 'cool') {
            applyCool(ctx, canvas);
          } else if (filter === 'warm') {
            applyWarm(ctx, canvas);
          }
        }
      }
      
      const photoUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhoto(photoUrl);
      
      setBigData(prev => {
        const filteredPrev = prev.filter(item => !item.type?.startsWith('cameracapture-'));
        const existingIndex = filteredPrev.findIndex(item => item.id === idRef.current);
        
        if (existingIndex !== -1) {
          filteredPrev[existingIndex] = {
            id: idRef.current,
            type: 'cameracapture',
            photoUrl: photoUrl,
            capturedAt: new Date().toISOString(),
            filter: filter
          };
          return filteredPrev;
        } else {
          return [...filteredPrev, {
            id: idRef.current,
            type: 'cameracapture',
            photoUrl: photoUrl,
            capturedAt: new Date().toISOString(),
            filter: filter
          }];
        }
      });
    }
  };

  // Filter functions
  const applyGrayscale = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const applySepia = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const applyVintage = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * 1.25;     // increase red
      data[i + 2] = data[i + 2] * 0.9; // decrease blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const applyCool = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i + 2] = Math.min(255, data[i + 2] * 1.2); // increase blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const applyWarm = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.2);     // increase red
      data[i + 1] = Math.min(255, data[i + 1] * 1.1); // slightly increase green
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const resetPhoto = () => {
    setPhoto(null);
  };

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Kamera
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-indigo-600 rounded-lg transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {isFullscreen ? (
                <path fillRule="evenodd" d="M5 9V7a2 2 0 012-2h2a1 1 0 010 2H7v2a1 1 0 01-2 0zm10 0V7h-2a1 1 0 010-2h2a2 2 0 012 2v2a1 1 0 11-2 0zM5 11a1 1 0 102 0v-2h2a1 1 0 100-2H7a2 2 0 00-2 2v2zm10 0a1 1 0 102 0v-2a2 2 0 00-2-2h-2a1 1 0 100 2h2v2z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative">
        {/* Video or placeholder */}
        <div className="aspect-[4/3] bg-black relative">
          {cameraLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 z-10 p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white text-lg font-medium mb-2">Kamera erişimi sağlanamadı</p>
              <p className="text-gray-300 mb-4">Lütfen kamera izinlerinizi kontrol edin ve tekrar deneyin.</p>
              <button 
                onClick={startCamera}
                className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          )}
          
          {!stream && !cameraLoading && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-black text-white p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Fotoğraf çekmeye hazır mısınız?</h3>
              <p className="text-gray-300 mb-6">Başlamak için kameranızı etkinleştirin</p>
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Kamerayı Başlat
              </button>
            </div>
          )}
          
          {stream && !photo && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${filters.find(f => f.id === filter)?.class || ''}`}
              />
              
              {/* Flash effect */}
              {flashActive && (
                <div className="absolute inset-0 bg-white z-10 animate-flash"></div>
              )}
              
              {/* Countdown overlay */}
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                  <div className="text-6xl font-bold text-white animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}
            </>
          )}
          
          {photo && (
            <img 
              src={photo} 
              alt="Çekilen fotoğraf" 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        
        {/* Filter selection bar - only show when camera is active and no photo taken */}
        {stream && !photo && (
          <div className="absolute bottom-4 left-4 right-4 overflow-x-auto pb-2">
            <div className="flex gap-2 p-1 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    filter === filterOption.id 
                      ? 'bg-white text-black font-medium'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  {filterOption.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls section */}
      <div className="p-4">
        {stream && !photo ? (
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => capturePhoto(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              3s Zamanlayıcı
            </button>
            <button
              onClick={() => capturePhoto(false)}
              className="flex-1 min-w-48 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Fotoğraf Çek
            </button>
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Kamerayı Kapat
            </button>
          </div>
        ) : photo ? (
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={resetPhoto}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Yeniden Çek
            </button>
            
            <button
              onClick={() => {
                // Fotoğrafı indir
                const link = document.createElement('a');
                link.href = photo;
                link.download = `photo-${Date.now()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex-1 min-w-48 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Fotoğrafı İndir
            </button>
            
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Kapat
            </button>
          </div>
        ) : null}
      </div>

      {/* Photo info */}
      {photo && (
        <div className="p-4 mt-2 bg-white rounded-lg shadow-inner">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fotoğraf başarıyla kaydedildi
              </h3>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Filtre: <span className="font-medium">{filters.find(f => f.id === filter)?.name || 'Normal'}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS for flash animation */}
      <style jsx>{`
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.2s forwards;
        }
      `}</style>
    </div>
  );
}