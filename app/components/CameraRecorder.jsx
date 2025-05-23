"use client";
import { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function CameraRecorder({ bigData, setBigData }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [question, setQuestion] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(30);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const idRef = useRef(`camera-${Math.floor(Math.random() * 9999)}`);
  const containerRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: idRef.current,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraReady(true);
    } catch (err) {
      console.error("Kamera erişimi hatası:", err);
      alert("Kamera erişimi sağlanamadı!");
    }
  };

  const startRecording = async () => {
    if (!cameraReady) {
      await startCamera();
    }
    
    try {
      const recorder = new MediaRecorder(streamRef.current);
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        setRecordedChunks(chunks);
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        videoRef.current.src = url;
      };

      recorder.start();
      setIsRecording(true);
      setRecordedTime(0);

      timerRef.current = setInterval(() => {
        setRecordedTime((prev) => {
          if (prev >= recordingDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Kayıt başlatma hatası:", err);
      alert("Kayıt başlatılamadı!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraReady(false);
      setIsRecording(false);
      clearInterval(timerRef.current);
      
      setBigData((prev) => {
        const filteredPrev = prev.filter(
          (item) => !item.type?.startsWith("camera-")
        );
        const existingIndex = filteredPrev.findIndex(
          (item) => item.id === idRef.current
        );

        if (existingIndex !== -1) {
          filteredPrev[existingIndex] = {
            id: idRef.current,
            type: "camera",
            question: question,
            recordedTime: recordedTime,
            recordingDuration: recordingDuration,
          };
          return filteredPrev;
        } else {
          return [
            ...filteredPrev,
            {
              id: idRef.current,
              type: "camera",
              question: question,
              recordedTime: recordedTime,
              recordingDuration: recordingDuration,
            },
          ];
        }
      });
    }
  };

  const resetRecording = () => {
    setRecordedChunks([]);
    setRecordedTime(0);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const progressPercentage = (recordedTime / recordingDuration) * 100;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        containerRef.current = node;
      }}
      style={style}
      className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Video Kaydedici</h2>
        <div className="flex items-center gap-2">
          <div
            {...listeners}
            {...attributes}
            className="p-2 hover:bg-blue-700 rounded-lg cursor-move transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-blue-700 rounded-lg transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isFullscreen ? (
                <path
                  fillRule="evenodd"
                  d="M5 9V7a2 2 0 012-2h2a1 1 0 010 2H7v2a1 1 0 01-2 0zm10 0V7h-2a1 1 0 010-2h2a2 2 0 012 2v2a1 1 0 11-2 0zM5 11a1 1 0 102 0v-2h2a1 1 0 100-2H7a2 2 0 00-2 2v2zm10 0a1 1 0 102 0v-2a2 2 0 00-2-2h-2a1 1 0 100 2h2v2z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Video container */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center">
            <div className="mt-4 px-4 py-2 bg-black bg-opacity-70 rounded-full flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">{formatTime(recordedTime)} / {formatTime(recordingDuration)}</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-800 mt-2">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!cameraReady && recordedChunks.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-center px-4">
              Kayda başlamak için kamera erişimi verin
            </p>
            <button
              onClick={startCamera}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Kamerayı Aç
            </button>
          </div>
        )}
      </div>

      {/* Controls section */}
      <div className="p-6">
        <div className="mb-4">
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
            type="text"
            placeholder="Sorunuzu yazınız..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Kayıt Süresi:</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="300"
                value={recordingDuration}
                onChange={(e) =>
                  setRecordingDuration(
                    Math.min(300, Math.max(1, parseInt(e.target.value) || 1))
                  )
                }
                className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
              />
              <span className="absolute right-3 top-2 text-gray-500">sn</span>
            </div>
          </div>

          <div className="w-full md:w-auto ml-auto flex gap-3">
            {!isRecording && (
              <button
                onClick={startRecording}
                disabled={isRecording}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Kayda Başla
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
                Kaydı Durdur
              </button>
            )}

            {!isRecording && recordedChunks.length > 0 && (
              <button
                onClick={resetRecording}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Yeniden Kaydet
              </button>
            )}
          </div>
        </div>

        {recordedChunks.length > 0 && !isRecording && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Kayıt Tamamlandı</span>
            </div>
            <p className="text-gray-600">
              Toplam kayıt süresi: {formatTime(recordedTime)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}