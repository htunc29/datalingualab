"use client"
import React, { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaTrashAlt } from 'react-icons/fa'
import { MdMenu } from 'react-icons/md'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Page() {
    const [loading, setLoading] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [currentMessage, setCurrentMessage] = useState("")
    const [messages, setMessages] = useState([])
    const chatContainerRef = useRef(null)

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages, currentMessage])

    async function handleSubmit(e) {
        e.preventDefault();
        if (!prompt.trim()) return; // Don't send if empty

        // Add user message
        const userMessage = { role: 'user', content: prompt }
        setMessages(prevMessages => [...prevMessages, userMessage])
        
        // Start loading state
        setLoading(true)
        setCurrentMessage("")
        
        // Create and prepare the AI message container
        const aiMessage = { role: 'assistant', content: '' }
        
        try {
            // Create fetch request with streaming enabled
            const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "model": "gemma-3-12b-it",
                    "messages": [
                        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
                        { role: "user", content: prompt }
                    ],
                    "temperature": 0.7,
                    "max_tokens": -1,
                    "stream": true
                })
            })

            // Create a reader from the response
            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            
            // Read the stream
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                // Decode the chunk
                const chunk = decoder.decode(value)
                
                // Parse the SSE data
                const lines = chunk.split('\n')
                let newContent = ''
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                        const jsonData = line.replace('data: ', '')
                        try {
                            const data = JSON.parse(jsonData)
                            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                newContent += data.choices[0].delta.content
                            }
                        } catch (e) {
                            console.error('Error parsing JSON:', e)
                        }
                    }
                }
                
                // Update the current streaming message
                setCurrentMessage(prev => prev + newContent)
            }
            
            // When stream completes, add the full message to the messages array
            setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: currentMessage }])
        } catch (error) {
            console.error('Error during streaming:', error)
            // Add error message
            setMessages(prevMessages => [...prevMessages, { 
                role: 'system', 
                content: 'Bir hata oluştu. Lütfen tekrar deneyiniz.'
            }])
        } finally {
            setLoading(false)
            setPrompt("")
        }
    }

    function clearChat() {
        setMessages([])
        setCurrentMessage("")
    }
    
    function deleteMessage(index) {
        setMessages(prevMessages => prevMessages.filter((_, i) => i !== index))
    }

    return (
        <div className='h-screen grid grid-cols-12 bg-slate-100'>
            <motion.div className='col-span-2 p-4 md:p-6 rounded-r-xl bg-black text-white'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-2xl font-bold'>Sohbet Geçmişi</h1>
                    <MdMenu className='text-4xl cursor-pointer'/>
                </div>
                <div className='flex flex-col gap-4 mt-4'>
                    <div className='flex items-center justify-between'>
                        <button onClick={clearChat} className='flex items-center gap-2 p-4 rounded-lg hover:bg-slate-700 w-full'>
                            <FaTrashAlt /> Tüm Sohbeti Temizle
                        </button>
                    </div>
                    {messages.length > 0 && messages.filter(msg => msg.role === 'user').map((msg, idx) => (
                        <div key={idx} className='flex items-center justify-between'>
                            <Link href={"/home"} className='flex items-center gap-2 p-4 rounded-lg hover:bg-slate-700 truncate w-4/5'>
                                {msg.content.substring(0, 25)}{msg.content.length > 25 ? '...' : ''}
                            </Link>
                            <button onClick={() => deleteMessage(idx * 2)} className='bg-rose-500 p-2 rounded-sm shadow-inner'>
                                <FaTrashAlt/>
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>  
            <motion.div className='col-span-10 relative flex flex-col h-full'>
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-white"
                >
                    {messages.length > 0 ? (
                        <>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`
                                    flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} 
                                    w-full
                                `}>
                                    <div className={`
                                        max-w-3xl rounded-lg p-4 
                                        ${msg.role === 'user' 
                                            ? 'bg-blue-500 text-white' 
                                            : msg.role === 'system' 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-gray-200 text-black'
                                        }
                                    `}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {currentMessage && (
                                <div className="flex justify-start w-full">
                                    <div className="max-w-3xl rounded-lg p-4 bg-gray-200 text-black">
                                        {currentMessage}
                                        {loading && (
                                            <span className="inline-block animate-pulse">▌</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='h-full text-5xl font-bold flex items-center justify-center text-gray-300'>
                            Hoşgeldin
                        </div>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className='p-4 bg-slate-200 border-t border-gray-300'>
                    <div className='flex gap-4'>
                        <input 
                            type="text" 
                            className='p-4 w-full rounded-lg outline-none border border-gray-300 focus:border-blue-500 transition-colors' 
                            placeholder='Hoşgeldin dostum ne sormak istersin...' 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={loading}
                        />
                        <button 
                            className={`
                                bg-blue-500 flex items-center justify-center hover:bg-blue-600 
                                text-white w-12 rounded-lg transition-colors
                                ${loading ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''}
                            `}
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <FaPaperPlane/>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}