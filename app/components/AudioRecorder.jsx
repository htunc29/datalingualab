"use client";
import { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop, FaPlay, FaPause } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import { MdQuestionAnswer, MdDragIndicator } from "react-icons/md";
import { useDraggable } from "@dnd-kit/core";
import JsonView from '@uiw/react-json-view';
import { motion, AnimatePresence } from "framer-motion";

export default function AudioRecorder({ bigData, setBigData }) {
  const [question, setQuestion] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [recordingTime, setRecordingTime] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const countdownTimerRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const idRef = useRef(`audio-${Math.floor(Math.random() * 9999)}`);

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
         id: idRef.current,
       });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const newData = {
      id: idRef.current,
      type: 'audio',
      question: question,
      audioUrl: audioUrl,
      recordingTime: recordingTime,
      countdown: countdown
    };
    setData(newData);

    setBigData(prev => {
      const existingIndex = prev.findIndex(item => item.id === idRef.current);
      
      if (existingIndex !== -1) {
        const updatedData = [...prev];
        updatedData[existingIndex] = newData;
        return updatedData;
      } else if (question || audioUrl) {
        return [...prev, newData];
      }
      return prev;
    });
  }, [question, audioUrl, recordingTime, countdown]);

  const startCountdown = () => {
    setIsCountdown(true);
    let currentCountdown = countdown;

    countdownTimerRef.current = setInterval(() => {
      currentCountdown--;
      setCountdown(currentCountdown);

      if (currentCountdown <= 0) {
        clearInterval(countdownTimerRef.current);
        setIsCountdown(false);
        startRecording();
      }
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      let currentRecordingTime = recordingTime;
      recordingTimerRef.current = setInterval(() => {
        currentRecordingTime--;
        setRecordingTime(currentRecordingTime);

        if (currentRecordingTime <= 0) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      setError("Mikrofon izni reddedildi. Lütfen mikrofon iznini kontrol edin.");
      console.error("Mikrofon hatası:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      setRecordingTime(10);
    }
  };

  const handleStart = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startCountdown();
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div {...listeners} {...attributes} className="flex justify-end text-2xl cursor-pointer mb-4">
        <MdDragIndicator />
      </div>

      <div className="space-y-6" >
        {/* Soru Input */}
        <motion.div 
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          whileHover={{ scale: 1.01 }}
        >
          <MdQuestionAnswer className="text-xl text-gray-500" />
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            placeholder="Sorunuzu yazınız..."
            className="flex-1 bg-transparent border-none outline-none"
          />
        </motion.div>

        {/* Süre Ayarları */}
        <div className="grid grid-cols-2 gap-4">
          {/* Geri Sayım Süresi */}
          <motion.div 
            className="p-4 bg-blue-50 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Geri Sayım Süresi
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="3"
                max="30"
                value={countdown}
                onChange={(e) => setCountdown(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-center">{countdown}s</span>
            </div>
          </motion.div>

          {/* Kayıt Süresi */}
          <motion.div 
            className="p-4 bg-blue-50 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Kayıt Süresi
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="300"
                value={recordingTime}
                onChange={(e) => setRecordingTime(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-center">{recordingTime}s</span>
            </div>
          </motion.div>
        </div>

        {/* Hata Mesajı */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="text-red-500 text-sm bg-red-50 p-3 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kayıt Kontrolleri */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleStart}
            className={`
              px-6 py-3 rounded-full flex items-center gap-2 text-white font-medium
              ${isRecording ? "bg-red-500" : "bg-blue-500"}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRecording ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaStop />
                </motion.div>
                <span>Kaydı Durdur</span>
              </>
            ) : isCountdown ? (
              <>
                <FaPause />
                <motion.span
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {countdown}s
                </motion.span>
              </>
            ) : (
              <>
                <FaMicrophone />
                <span>Kaydı Başlat</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Kayıt Süresi Göstergesi */}
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div 
                className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                Kayıt süresi: {recordingTime}s
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ses Oynatıcı */}
        <AnimatePresence>
          {audioUrl && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <audio
                src={audioUrl}
                controls
                className="w-full rounded-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Component Verisi */}
        <motion.div 
          className="mt-4 pt-4 border-t"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <JsonView value={data} theme="light" />
        </motion.div>
      </div>
    </div>
  );
}