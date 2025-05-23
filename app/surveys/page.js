"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiUsers,
  FiCalendar,
  FiPlusCircle,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { HashLoader } from "react-spinners";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      const response = await fetch("/api/survey/surveylist");
      const data = await response.json();
      console.log(data);
      setSurveys(data);
      setIsLoading(false);
    };

    fetchSurveys();
  }, []);

  const filteredSurveys = surveys.filter(
    (survey) =>
      (survey.surveyTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (survey.surveyDescription?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (survey.surveyCategory?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mevcut Anketler</h1>
         
        </div>
     
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Anketlerde ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiFilter className="text-gray-500" />
              <span className="text-gray-700">Filtrele</span>
            </button>
            <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="alphabetical">Alfabetik</option>
              <option value="responses">Yanıt Sayısı</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <HashLoader />
        </div>
      ) : (
        <>
          {filteredSurveys.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiSearch className="text-gray-400 h-12 w-12" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Sonuç Bulunamadı
              </h3>
              <p className="text-gray-600">
                Arama kriterlerinize uygun anket bulunamadı.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSurveys.map((survey) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  key={survey._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <Image
                  width={500}
                  height={500}
                    src={"/logo.png"}
                    alt={survey.surveyTitle}
                    className="w-full h-48 object-cover"
                   
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                        {survey.surveyCategory}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiCalendar className="mr-1" size={14}/>
                        {moment(survey.createdAt).format("DD MMMM YYYY")}
                      </div>
                    </div>
                    <h2 className="text-md font-semibold mb-2 text-gray-800">
                      {survey.surveyTitle}
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm">
                      {survey.surveyDescription.substr(0,100)}...
                    </p>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiBarChart2 className="mr-1" size={14} />
                          <span>{survey.responseCount || 0} yanıt</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiUsers className="mr-1" size={14} />
                          <span>{survey.participants || 0} katılımcı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between">
                      <Link href={`survey?surveyId=${survey._id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                        Katıl
                      </Link>
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                        Detaylar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {filteredSurveys.length > 0 && (
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              Önceki
            </button>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">
              1
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
              3
            </button>
            <span className="px-3 py-1 text-gray-600">...</span>
            <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
              10
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
              Sonraki
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
