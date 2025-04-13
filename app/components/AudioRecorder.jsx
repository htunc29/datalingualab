"use client";
import { useState, useRef } from "react";
import { FaUserClock,FaClock,FaMicrophone } from "react-icons/fa";


export default function AudioRecorder() {
  const [question, setQuestion] = useState("");
  const [counter,setCounter]=useState(10)
  const [recordStart,setRecordStart]=useState(false)
  const [recordTime,setRecordTime]=useState(10)
  const [isRecording, setIsRecording] = useState(false);
  const [url,setUrl]=useState("")
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const toggleRecording = async () => {
    setRecordStart(true)
    // If already recording, stop it
    if (isRecording) {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setRecordStart(false)
        return;
    }

    // Start countdown
    const originalCounter = counter;
    let countdownValue = counter;

    const countdownTimer = setInterval(() => {
        countdownValue--;
        setCounter(countdownValue);
        
        if (countdownValue <= 0) {
            clearInterval(countdownTimer);
            
            // Start recording
            startRecording();
        }
    }, 1000);

    async function startRecording() {
        
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
                setUrl(url);
                console.log("Kayıt tamamlandı:", url);
                // Reset counter
                setCounter(originalCounter);
                // Stop all tracks from the stream to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Automatically stop recording after recordTime seconds
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                    setRecordStart(false)
                }
            }, recordTime * 1000);
        } catch (err) {
            console.error("Mikrofon izni reddedildi:", err);
            alert("Mikrofon izni gerekiyor! Lütfen izin ver.");
            // Reset counter in case of error
            setCounter(originalCounter);
        }
    }
  };

  return (
    <div className="p-4 md:p-6 shadow-sm rounded-sm w-full mx-auto">
      <div className="flex flex-col gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          type="text"
          placeholder="Sorunuzu yazınız..."
          className="outline-none px-4 py-2 rounded-sm placeholder:text-slate-500 bg-slate-200 w-full shadow-inner"
        />
        <div className="flex items-center gap-2">
            <FaUserClock/>
            <input value={counter} onChange={(e)=>setCounter(e.target.value)} type="number" placeholder="Geri Sayım Süresi" className="outline-none px-4 py-2 rounded-sm placeholder:text-slate-500 bg-slate-200 w-full shadow-inner" />
        </div>
        <div className="flex items-center gap-2">
            <FaClock/>
            <input value={counter} onChange={(e)=>setCounter(e.target.value)} type="number" placeholder="Geri Sayım Süresi" className="outline-none px-4 py-2 rounded-sm placeholder:text-slate-500 bg-slate-200 w-full shadow-inner" />
        </div>
      </div>
      <div className="w-full border-1 border-slate-200 my-2"></div>
      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          className={`${
            isRecording ? "bg-gray-500" : "bg-rose-500"
          } text-white px-4 py-2 shadow-sm rounded-full flex items-center gap-2 transition-all`}
        >
          <FaMicrophone />
          {isRecording ? "Kaydı Durdur" : "Kaydı Başlat"}
        </button>
       
      </div>
      <div className="my-2 flex justify-center items-center">
      {url && <audio src={url} controls  />}
      </div> 
      <div className="flex justify-center items-center text-3xl">
        {recordStart ? <>Son {counter}</>:""}
        {isRecording ? <>Kayıt Süresi {recordTime}</>:""}
      </div>
    </div>
  );
}