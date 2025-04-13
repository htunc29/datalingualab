'use client';
import { useState, useEffect } from 'react';
import { FiBarChart2, FiUsers, FiCalendar, FiPlusCircle, FiSearch, FiFilter } from 'react-icons/fi';

export default function SurveysPage() {
    const [surveys, setSurveys] = useState([
        {
            id: '1',
            title: 'Customer Satisfaction',
            description: 'Annual survey to measure customer satisfaction and loyalty',
            responseCount: 254,
            participants: 350,
            createdAt: '2025-03-15',
            category: 'Customer Experience',
            image: '/api/placeholder/400/240'
        },
        {
            id: '2',
            title: 'Employee Engagement',
            description: 'Quarterly assessment of employee satisfaction and engagement levels',
            responseCount: 87,
            participants: 120,
            createdAt: '2025-04-01',
            category: 'Human Resources',
            image: '/api/placeholder/400/240'
        },
        {
            id: '3',
            title: 'Product Feedback',
            description: 'Collecting user feedback on our new product features',
            responseCount: 432,
            participants: 500,
            createdAt: '2025-03-28',
            category: 'Product Development',
            image: '/api/placeholder/400/240'
        },
        {
            id: '4',
            title: 'Market Research',
            description: 'Understanding market trends and consumer preferences',
            responseCount: 156,
            participants: 200,
            createdAt: '2025-03-10',
            category: 'Marketing',
            image: '/api/placeholder/400/240'
        }
    ]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSurveys = async () => {
            setIsLoading(true);
            try {
                // Simulate API call with timeout
                await new Promise(resolve => setTimeout(resolve, 1000));
                // In a real app, you'd fetch from an API
                // const response = await fetch('/api/surveys');
                // const data = await response.json();
                // setSurveys(data);
                
                // We're using our dummy data instead
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching surveys:', error);
                setIsLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    const filteredSurveys = surveys.filter(survey => 
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Mevcut Anketler</h1>
                    <p className="text-gray-600 mt-2">Tüm anketlerinizi görüntüleyin ve yönetin</p>
                </div>
                <button className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-300">
                    <FiPlusCircle className="mr-2" />
                    Yeni Anket Oluştur
                </button>
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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <>
                    {filteredSurveys.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <FiSearch className="text-gray-400 h-12 w-12" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Sonuç Bulunamadı</h3>
                            <p className="text-gray-600">Arama kriterlerinize uygun anket bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSurveys.map((survey) => (
                                <div key={survey.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                    <img 
                                        src={survey.image} 
                                        alt={survey.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                                                {survey.category}
                                            </span>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <FiCalendar className="mr-1" size={14} />
                                                {survey.createdAt}
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2 text-gray-800">{survey.title}</h2>
                                        <p className="text-gray-600 mb-4 text-sm">
                                            {survey.description}
                                        </p>
                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <FiBarChart2 className="mr-1" size={14} />
                                                    <span>{survey.responseCount} yanıt</span>
                                                </div>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <FiUsers className="mr-1" size={14} />
                                                    <span>{survey.participants} katılımcı</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                                        <div className="flex justify-between">
                                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                                                Sonuçları Görüntüle
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                                                Düzenle
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                        <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">1</button>
                        <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">3</button>
                        <span className="px-3 py-1 text-gray-600">...</span>
                        <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">10</button>
                        <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
                            Sonraki
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}