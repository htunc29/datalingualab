"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HashLoader } from 'react-spinners';
import InputQuestion from '@/app/components/InputQuestion';
import AudioRecorder from '../components/AudioRecorder';

export default function Survey() {
    const searchParams = useSearchParams();
    const surveyId = searchParams.get('surveyId');

    const [surveyData, setSurveyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChoices, setSelectedChoices] = useState({});
    const [files, setFiles] = useState({});
    const [audioBlobs, setAudioBlobs] = useState({});
    const [videoBlobs, setVideoBlobs] = useState({});
    const [photos, setPhotos] = useState({});
    const [inputAnswers, setInputAnswers] = useState({});

    async function fetchSurveyData() {
        try {
            const response = await fetch(`/api/survey/getsurvey?surveyId=${surveyId}`);
            if (!response.ok) {
                throw new Error("Anket bulunamadı");
            }
            const data = await response.json();
            setSurveyData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (surveyId) {
            fetchSurveyData();
        }
    }, [surveyId]);

    const handleChoiceChange = (questionId, choiceText) => {
        setSelectedChoices((prev) => ({
            ...prev,
            [questionId]: choiceText
        }));
    };

    const handleCheckboxChange = (questionId, choiceText, checked) => {
        setSelectedChoices((prev) => {
            const currentChoices = prev[questionId] || [];
            if (checked) {
                return {
                    ...prev,
                    [questionId]: [...currentChoices, choiceText]
                };
            } else {
                return {
                    ...prev,
                    [questionId]: currentChoices.filter(choice => choice !== choiceText)
                };
            }
        });
    };

    const handleFileChange = (questionId, file) => {
        setFiles(prev => ({
            ...prev,
            [questionId]: file
        }));
    };

    const handleAudioRecord = (questionId, blob) => {
        setAudioBlobs(prev => ({
            ...prev,
            [questionId]: blob
        }));
    };

    const handleVideoRecord = (questionId, blob) => {
        setVideoBlobs(prev => ({
            ...prev,
            [questionId]: blob
        }));
    };

    const handlePhotoCapture = (questionId, photoUrl) => {
        setPhotos(prev => ({
            ...prev,
            [questionId]: photoUrl
        }));
    };

    const handleInputAnswer = (questionId, answer) => {
        setInputAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            selectedChoices,
            files,
            audioBlobs,
            videoBlobs,
            photos,
            inputAnswers
        };
        console.log("Form verileri:", formData);
    };

    if (loading) {
        return (
            <div className="h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
               
                    <HashLoader color="#4F46E5" size={50} />
                    <p className="mt-4 text-gray-600">Anket yükleniyor...</p>
             
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-500 text-lg font-medium">{error}</p>
                </div>
            </div>
        );
    }

    const questions = surveyData?.bigData || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white mb-2">{surveyData?.surveyTitle}</h1>
                        <p className="text-blue-100 text-sm">
                            {surveyData?.surveyCategory} • {new Date(surveyData?.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {questions.map((item, index) => {
                                if (item.type === 'inputquestion') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <InputQuestion
                                                        bigData={surveyData?.bigData}
                                                        setBigData={setSurveyData}
                                                        id={item.id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (item.type === 'question') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                                        {item.question}
                                                    </label>
                                                    <div className="space-y-3">
                                                        {item.choices.map((choice) => (
                                                            <div key={choice.id} className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    id={`q-${item.id}-c-${choice.id}`}
                                                                    name={item.id}
                                                                    value={choice.text}
                                                                    checked={selectedChoices[item.id] === choice.text}
                                                                    onChange={() => handleChoiceChange(item.id, choice.text)}
                                                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                                />
                                                                <label 
                                                                    htmlFor={`q-${item.id}-c-${choice.id}`} 
                                                                    className="ml-3 text-gray-700 hover:text-gray-900 cursor-pointer"
                                                                >
                                                                    {choice.text}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (item.type === 'questioncheckbox') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                                        {item.question}
                                                    </label>
                                                    <div className="space-y-3">
                                                        {item.choices.map((choice) => (
                                                            <div key={choice.id} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`q-${item.id}-c-${choice.id}`}
                                                                    checked={(selectedChoices[item.id] || []).includes(choice.text)}
                                                                    onChange={(e) => handleCheckboxChange(item.id, choice.text, e.target.checked)}
                                                                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                                />
                                                                <label 
                                                                    htmlFor={`q-${item.id}-c-${choice.id}`} 
                                                                    className="ml-3 text-gray-700 hover:text-gray-900 cursor-pointer"
                                                                >
                                                                    {choice.text}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (item.type === 'file') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                                        {item.question}
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleFileChange(item.id, e.target.files[0])}
                                                            className="block w-full text-sm text-gray-500
                                                                file:mr-4 file:py-2 file:px-4
                                                                file:rounded-full file:border-0
                                                                file:text-sm file:font-semibold
                                                                file:bg-purple-50 file:text-purple-700
                                                                hover:file:bg-purple-100"
                                                        />
                                                        {files[item.id] && (
                                                            <p className="mt-2 text-sm text-gray-500">
                                                                Seçilen dosya: {files[item.id].name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (item.type === 'audio') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                                        {item.question}
                                                    </label>
                                                    <div className="mt-2">
                                                       
                                                        {audioBlobs[item.id] && (
                                                            <div className="mt-2">
                                                                <audio controls src={URL.createObjectURL(audioBlobs[item.id])} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (item.type === 'camerarecorder') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                                        {item.question}
                                                    </label>
                                                    <div className="mt-2">
                                                        {/* CameraRecorder bileşeni buraya gelecek */}
                                                        {videoBlobs[item.id] && (
                                                            <div className="mt-2">
                                                                <video controls src={URL.createObjectURL(videoBlobs[item.id])} className="w-full rounded-lg" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (item.type === 'cameracapture') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                                                        {item.question}
                                                    </label>
                                                    <div className="mt-2">
                                                        {/* CameraCapture bileşeni buraya gelecek */}
                                                        {photos[item.id] && (
                                                            <div className="mt-2">
                                                                <img src={photos[item.id]} alt="Çekilen fotoğraf" className="w-full rounded-lg" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (item.type === 'pis') {
                                    return (
                                        <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                            <div 
                                                className="prose prose-blue max-w-none"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            })}

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Anketi Gönder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
