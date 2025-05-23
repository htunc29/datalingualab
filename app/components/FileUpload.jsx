"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useDraggable } from "@dnd-kit/core";
import { MdDragIndicator } from 'react-icons/md';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';

export default function FileUpload({bigData, setBigData}) {
    const [question, setQuestion] = useState("")
    const [extension, setExtension] = useState("")
    const [filename, setFileName] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const idRef = useRef(`file-${Math.floor(Math.random() * 9999)}`);
    const fileInputRef = useRef(null);
    
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: idRef.current,
    });
      
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Bileşenin kendi verisini oluştur
    const componentData = {
        id: idRef.current,
        type: 'file',
        question: question,
        extension: extension,
        selectedFile: filename
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return;
        
        setSelectedFile(file)
        const fileExtension = file.name.split('.').pop().toLowerCase();
        setExtension(fileExtension)
        const newFileName = nanoid()+"."+fileExtension;
        setFileName(newFileName)
        updateBigData(question, fileExtension, newFileName);
    }

    const updateBigData = (question, extension, selectedFile) => {
        setBigData(prev => {
            const existingIndex = prev.findIndex(item => item.id === idRef.current);
            
            if (existingIndex !== -1) {
                prev[existingIndex] = {
                    id: idRef.current,
                    type: 'file',
                    question: question,
                    extension: extension,
                    selectedFile: selectedFile
                };
                return [...prev];
            } else if (question || extension) {
                return [...prev, {
                    id: idRef.current,
                    type: 'file',
                    question: question,
                    extension: extension,
                    selectedFile: selectedFile
                }];
            }
            return prev;
        });
    }

    const handleQuestionChange = (e) => {
        const newQuestion = e.target.value;
        setQuestion(newQuestion);
        updateBigData(newQuestion, extension, filename);
    }

    const handleExtensionChange = (e) => {
        const newExtension = e.target.value;
        setExtension(newExtension);
        updateBigData(question, newExtension, filename);
    }

    const removeFile = () => {
        setSelectedFile(null);
        setFileName("");
        updateBigData(question, extension, "");
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            const fileExtension = file.name.split('.').pop().toLowerCase();
            setExtension(fileExtension);
            const newFileName = nanoid()+"."+fileExtension;
            setFileName(newFileName);
            updateBigData(question, fileExtension, newFileName);
        }
    }

    return (
        <div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={style} 
            ref={setNodeRef} 
            className="p-6 w-full mx-auto  rounded-xl shadow-lg border border-gray-200"
        >
            <div 
                {...listeners} 
                {...attributes} 
                className="flex justify-between items-center mb-4 cursor-grab" 
            >
                <h3 className="text-lg font-semibold text-gray-800">Dosya Yükleme</h3>
                <MdDragIndicator className="text-2xl text-gray-500 hover:text-blue-600 transition-colors" />
            </div>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                        Sorunuz
                    </label>
                    <input
                        id="question"
                        value={question}
                        onChange={handleQuestionChange}
                        type="text"
                        placeholder="Sorunuzu yazınız..."
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="extension" className="block text-sm font-medium text-gray-700 mb-2">
                        Dosya Türü
                    </label>
                    <select
                        id="extension"
                        value={extension}
                        onChange={handleExtensionChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none bg-white"
                    >
                        <option value="">Dosya türü seçiniz</option>
                        <option value="image">Resim</option>
                        <option value="text">Metin</option>
                        <option value="pdf">PDF</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosya Yükle
                    </label>
                    {!selectedFile ? (
                        <div 
                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <FiUpload className="w-10 h-10 mb-3 text-blue-500" />
                                <p className="mb-2 text-sm text-gray-700">
                                    <span className="font-medium text-blue-600 hover:underline">Dosya seçmek için tıklayın</span> veya sürükleyip bırakın
                                </p>
                                <p className="text-xs text-gray-500">
                                    PDF, TXT veya Resim dosyaları
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={`${extension === "pdf" ? "application/" + extension : extension + "/*"}`}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                            <div className="h-12 w-12 flex-shrink-0 mr-4 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiFile className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                            <button 
                                onClick={removeFile} 
                                className="ml-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </motion.div>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${selectedFile ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={!selectedFile}
                >
                    Dosyayı Onayla
                </motion.button>
            </div>
        </div>
    )
}
