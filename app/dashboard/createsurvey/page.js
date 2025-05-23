"use client";
import { useState } from "react";
import React from "react";
import Question from "@/app/components/Question";
import InputQuestion from "@/app/components/InputQuestion";
import AudioRecorder from "@/app/components/AudioRecorder";
import QuestionCheckBox from "@/app/components/QuestionCheckBox";
import FileUpload from "@/app/components/FileUpload";
import PIS from "@/app/components/PIS";
import CameraRecorder from "@/app/components/CameraRecorder";
import CameraCapture from "@/app/components/CameraCapture";
import Droppable from "@/app/components/Droppable";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { nanoid } from "nanoid";
import JsonView from "@uiw/react-json-view";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { HashLoader } from "react-spinners";
import { FaPlus } from "react-icons/fa";
import Select from "react-select";
import Draggable from "@/app/components/Draggable";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Dashboard() {
  const router = useRouter();
  const [droppedItems, setDroppedItems] = useState([]);
  const [bigData, setBigData] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [surveyCategory, setSurveyCategory] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { data: session, status } = useSession();
  const handleCreateSurvey = async () => {
    try {
      const response = await fetch("/api/survey/createsurvey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData: session.user.id,
          surveyTitle: surveyTitle,
          surveyDescription: surveyDescription,
          surveyCategory: surveyCategory,
          bigData: bigData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error('Anket oluşturulamadı');
      }
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  };
  if (status === "loading") {
    return (
      <div className="h-screen flex justify-center items-center">
        <HashLoader />
      </div>
    );
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8"
      >
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed top-4 right-4 z-50"
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Anket başarıyla yayınlandı!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Header Section */}
        <motion.div
          variants={fadeIn}
          className="mb-8 flex items-center justify-between"
        >
          <motion.h1
            className="text-2xl font-bold text-gray-800"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            {session.user.name} hemen anketini oluştur
          </motion.h1>

          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-7 rounded-lg bg-gray-200 shadow-inner flex items-center justify-center cursor-pointer">
              <motion.div
                className={`w-6 h-6 rounded-full ${
                  isPreview ? "bg-green-500" : "bg-blue-500"
                }`}
                animate={{ x: isPreview ? 16 : -16 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={() => setIsPreview(!isPreview)}
              />
            </div>
            <span className="text-gray-700 font-medium">Önizleme</span>
          </motion.div>
        </motion.div>
        <motion.div className="mb-6 flex flex-col gap-2">
          <input
            className="px-4 py-2 outline-none rounded-md border bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            type="text"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            placeholder="Anket Başlığını yazın..."
          />
            <input
            className="px-4 py-2 outline-none rounded-md border bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            type="text"
            value={surveyCategory}
            onChange={(e) => setSurveyCategory(e.target.value)}
            placeholder="Anket Kategorisini yazın..."
          />
          <textarea
           className="px-4 py-2 outline-none rounded-md border bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
           type="text"
           rows={6}
           value={surveyDescription}
           onChange={(e) => setSurveyDescription(e.target.value)}
           placeholder="Anket Açıklamasını yazın..."
          >

          </textarea>
          {/* <Select
           className="appearance-none  px-4 py-2 outline-none rounded-md border bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            closeMenuOnSelect={false}
            isMulti
            options={["İnsan Kaynakları","Çocuk","Psikoloji"].map((item) => ({
              value: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            }))}
          /> */}
          <motion.button
            onClick={handleCreateSurvey}
            className="bg-blue-500 text-white float-end px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            whileHover={{ scale: 1.01 }}
          >
            Anketi Yayınla
          </motion.button>
        </motion.div>
        {/* Main Content Grid */}
        <motion.section
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column - Components */}
          <motion.div
            variants={containerVariants}
            className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Veri Önizleme
              </h2>
              <div className="bg-white rounded-lg p-4">
                <JsonView value={bigData} theme="dark" />
              </div>
            </motion.div>

            <AnimatePresence>
              {[
                <Draggable key="question" id="question-">
                  <Question
                    bigData={bigData}
                    setBigData={setBigData}
                  />
                </Draggable>,
                <Draggable key="checkbox" id="questioncheck-">
                  <QuestionCheckBox
                    bigData={bigData}
                    setBigData={setBigData}
                  />
                </Draggable>,
                <Draggable key="file" id="file-">
                  <FileUpload
                    bigData={bigData}
                    setBigData={setBigData}
                  />
                </Draggable>,
                <Draggable key="audio" id="audio-">
                  <AudioRecorder
                    bigData={bigData}
                    setBigData={setBigData}
                  />
                </Draggable>,
                <Draggable key="camera" id="camera-">
                  <CameraRecorder
                    bigData={bigData}
                    setBigData={setBigData}
                  />
                </Draggable>,
                <Draggable key="capture" id="cameracapture-">
                  <CameraCapture
                    bigData={bigData}
                    setBigData={setBigData}
                  />
                </Draggable>,
                <Draggable key="pis" id="pis-">
                  <PIS 
                    bigData={bigData} 
                    setBigData={setBigData} 
                  />
                </Draggable>,
              ].map((component, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {component}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Right Column - Droppable Area */}
          <motion.div
            variants={containerVariants}
            className="bg-white p-6 rounded-xl shadow-lg min-h-[600px]"
          >
            <motion.h2
              variants={itemVariants}
              className="text-lg font-semibold text-gray-700 mb-6"
            >
              Anket Alanı
            </motion.h2>

            <Droppable>
              <AnimatePresence>
                {droppedItems.map((item, index) => {
                  const Component = getComponentByType(item.type);
                  return Component ? (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="mb-4"
                    >
                      <Component bigData={bigData} setBigData={setBigData} />
                    </motion.div>
                  ) : null;
                })}
              </AnimatePresence>
            </Droppable>
          </motion.div>
        </motion.section>
      </motion.main>
    </DndContext>
  );

  function getComponentByType(type) {
    const componentMap = {
      "question-": Question,
      "questioncheck-": QuestionCheckBox,
      "audio-": AudioRecorder,
      "camera-": CameraRecorder,
      "file-": FileUpload,
      "cameracapture-": CameraCapture,
      "pis-": PIS
    };

    return Object.entries(componentMap).find(([prefix]) =>
      type.startsWith(prefix)
    )?.[1];
  }

  function handleDragEnd(event) {
    if (event.over && event.over.id === "droppable") {
      const itemType = event.active.id;
      const newItem = {
        id: nanoid(),
        type: itemType,
        data: null,
      };
      setDroppedItems((prev) => [...prev, newItem]);
    }
  }
}
