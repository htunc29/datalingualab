"use client"
import React, { useState, useEffect, useRef } from 'react'
import { FaEraser } from "react-icons/fa6";

export default function InputQuestion({ bigData, setBigData, id }) {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const idRef = useRef(id || `inputquestion-${Math.floor(Math.random() * 9999)}`);

    useEffect(() => {
        setBigData(prev => {
            const filteredPrev = prev.filter(item => !item.type?.startsWith('inputquestion-'));
            const existingIndex = filteredPrev.findIndex(item => item.id === idRef.current);
            
            if (existingIndex !== -1) {
                filteredPrev[existingIndex] = {
                    id: idRef.current,
                    type: 'inputquestion',
                    question: question,
                    answer: answer
                };
                return filteredPrev;
            } else if (question || answer) {
                return [...filteredPrev, {
                    id: idRef.current,
                    type: 'inputquestion',
                    question: question,
                    answer: answer
                }];
            }
            return filteredPrev;
        });
    }, [question, answer]);

    return (
        <div className='w-full bg-white shadow-sm p-4 md:p-6 rounded-sm mx-auto'>
            <input 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                type="text" 
                placeholder='Sorunuzu yazınız...' 
                className="outline-none px-4 py-2 rounded-sm placeholder:text-slate-500 bg-slate-200 w-full shadow-inner" 
            />
            <div className='border-1 border-slate-200 w-full my-2'></div>
            <div className='flex gap-2'>
                <button 
                    onClick={() => setAnswer("")} 
                    className='bg-rose-500 text-white p-2 shadow-sm font-bold rounded-sm hover:bg-rose-600 transition-colors'
                >
                    <FaEraser/>
                </button>
                <input 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    type="text" 
                    placeholder='Cevabınızı yazınız...' 
                    className="outline-none px-4 py-2 rounded-sm placeholder:text-slate-500 bg-slate-200 w-11/12 shadow-inner" 
                />
            </div>
        </div>
    )
}
