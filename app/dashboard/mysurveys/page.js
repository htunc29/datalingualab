"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { HashLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaEye, FaChartBar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

export default function MySurveys() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchSurveys();
        }
    }, [session]);

    const fetchSurveys = async () => {
        try {
            const response = await fetch(`/api/survey/getmysurveys?userId=${session.user.id}`);
            if (!response.ok) {
                throw new Error('Anketler getirilemedi');
            }
            const data = await response.json();
            setSurveys(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (surveyId) => {
        if (window.confirm('Bu anketi silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`/api/survey/deletesurvey?surveyId=${surveyId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setSurveys(surveys.filter(survey => survey._id !== surveyId));
                }
            } catch (error) {
                console.error('Anket silinirken hata:', error);
            }
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <HashLoader color="#4F46E5" />
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

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8"
        >
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Anketlerim
                </h1>
                <p className="text-gray-600 mt-2">
                    Oluşturduğunuz tüm anketleri buradan yönetebilirsiniz.
                </p>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveys.map((survey) => (
                    <motion.div
                        key={survey._id}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {survey.surveyTitle}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {survey.surveyDescription}
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                    {survey.surveyCategory}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    {new Date(survey.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/survey?surveyId=${survey._id}`)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Görüntüle"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/dashboard/editsurvey?surveyId=${survey._id}`)}
                                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                        title="Düzenle"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/dashboard/results?surveyId=${survey._id}`)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Sonuçlar"
                                    >
                                        <FaChartBar />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(survey._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Sil"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {surveys.length === 0 && (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-12"
                >
                    <p className="text-gray-500 text-lg">
                        Henüz hiç anket oluşturmadınız.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/createsurvey')}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Yeni Anket Oluştur
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}
