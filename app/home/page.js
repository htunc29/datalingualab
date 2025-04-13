import Link from 'next/link';




export default function Home() {
    return (
        <main className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Welcome to DataLingua Lab</h1>
                
                <div className="grid gap-6">
                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">About Us</h2>
                        <p className="text-gray-600">
                            We specialize in language processing and data analysis solutions.
                        </p>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
                        <ul className="list-disc list-inside text-gray-600">
                            <li>Natural Language Processing</li>
                            <li>Data Analysis</li>
                            <li>Machine Learning Solutions</li>
                            <li>Custom Language Models</li>
                        </ul>
                    </section>

                    <Link 
                        href="/contact" 
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </main>
    );
}