"use client"
import {useState} from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'

export default function MatrixSurveyBuilder() {
  // State for language entry
  const [language, setLanguage] = useState('')
  const [languages, setLanguages] = useState([])
  
  // State for shared questions
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState([])
  
  // State for rating options
  const [ratingOption, setRatingOption] = useState('')
  const [ratingOptions, setRatingOptions] = useState([])
  
  // Handle adding a new language
  const handleAddLanguage = () => {
    if (language.trim() !== '' && !languages.includes(language)) {
      setLanguages([...languages, language])
      setLanguage('')
    }
  }
  
  // Handle adding a question (shared across all languages)
  const handleAddQuestion = () => {
    if (question.trim() !== '' && !questions.includes(question)) {
      setQuestions([...questions, question])
      setQuestion('')
    }
  }
  
  // Handle adding a rating option
  const handleAddRatingOption = () => {
    if (ratingOption.trim() !== '' && !ratingOptions.includes(ratingOption)) {
      setRatingOptions([...ratingOptions, ratingOption])
      setRatingOption('')
    }
  }
  
  // Handle removing a language
  const handleRemoveLanguage = (lang) => {
    setLanguages(languages.filter(l => l !== lang))
  }
  
  // Handle removing a question
  const handleRemoveQuestion = (q) => {
    setQuestions(questions.filter(question => question !== q))
  }
  
  // Handle removing a rating option
  const handleRemoveRatingOption = (option) => {
    setRatingOptions(ratingOptions.filter(o => o !== option))
  }
  
  return (
    <div className="bg-white shadow-md rounded-md p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Anket Oluşturucu</h1>
      
      {/* Language Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Adım 1: Dilleri Ekle</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Dil Giriniz (ör: İngilizce, Almanca)" 
            className="p-2 rounded-md outline-none ring-slate-200 flex-grow ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAddLanguage}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <FaPlus /> Dil Ekle
          </button>
        </div>
        
        {/* Display added languages */}
        {languages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Eklenen Diller:</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-100 border"
                >
                  <span>{lang}</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveLanguage(lang)}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Questions Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Adım 2: Soruları Ekle</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Soru Giriniz (tüm diller için ortak)" 
            className="p-2 rounded-md outline-none ring-slate-200 flex-grow ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAddQuestion}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <FaPlus /> Soru Ekle
          </button>
        </div>
        
        {/* Display added questions */}
        {questions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Eklenen Sorular:</h3>
            <ul className="list-disc pl-5">
              {questions.map((q, index) => (
                <li key={index} className="mb-1 flex items-center justify-between">
                  <span>{q}</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveQuestion(q)}
                  >
                    <FaTrash size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Rating Options Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Adım 3: Değerlendirme Seçenekleri</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            value={ratingOption}
            onChange={(e) => setRatingOption(e.target.value)}
            placeholder="Değerlendirme Seçeneği (ör: Çok İyi, İyi, Orta)" 
            className="p-2 rounded-md outline-none ring-slate-200 flex-grow ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAddRatingOption}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <FaPlus /> Seçenek Ekle
          </button>
        </div>
        
        {/* Display added rating options */}
        {ratingOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Eklenen Değerlendirme Seçenekleri:</h3>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-100 border"
                >
                  <span>{option}</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveRatingOption(option)}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Preview Section */}
      {languages.length > 0 && questions.length > 0 && ratingOptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Anket Önizleme</h2>
          
          {languages.map((lang, langIndex) => (
            <div key={langIndex} className="mb-8">
              <h3 className="text-lg font-medium mb-3 text-gray-700">{lang}</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-collapse border-slate-200 rounded-md">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-slate-200 p-2 text-left">Sorular</th>
                      {ratingOptions.map((option, optIndex) => (
                        <th key={optIndex} className="border border-slate-200 p-2 text-center">
                          {option}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, qIndex) => (
                      <tr key={qIndex} className={qIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="border border-slate-200 p-2">{q}</td>
                        {ratingOptions.map((option, optIndex) => (
                          <td key={optIndex} className="border border-slate-200 p-2 text-center">
                            <input type="radio" name={`${lang}-question-${qIndex}`} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}