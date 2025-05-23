"use client";
import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline, MdAdd, MdDragIndicator } from 'react-icons/md';
import JsonView from '@uiw/react-json-view';
import JsonViewEditor from '@uiw/react-json-view/editor';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import { TriangleArrow } from '@uiw/react-json-view/triangle-arrow';
import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow';
import { useSession } from "next-auth/react";
import { useDraggable } from "@dnd-kit/core";
import { nanoid } from "nanoid";
export default function Question({bigData,setBigData}) {
  const idRef=useRef(`question-${Math.floor(Math.random() * 9999)}`);
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: idRef.current,
    
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    willChange: "transform",
  } : undefined;
  
  const { data: session, status } = useSession();
  const [choices, setChoices] = useState([]);
  const [question, setQuestion] = useState("");
  const [count, setCount] = useState(0);
  const [data, setData] = useState({});
  const addChoice = () => {
    const newChoice = {
      id: count + 1,
      text: "",
    };
    setCount(count + 1);
    setChoices([...choices, newChoice]); // Gerisi useEffect'e emanet
  };
  
  useEffect(() => {
    setData({ question: question, choices: choices });
    setBigData(prev => {
      // Önce tüm question tipindeki kayıtları temizle
      const filteredPrev = prev.filter(item => !item.type?.startsWith('question-'));
      // Aynı ID'ye sahip kayıt var mı kontrol et
      const existingIndex = filteredPrev.findIndex(item => item.id === idRef.current);
      
      if (existingIndex !== -1) {
        // Kaydı güncelle
        filteredPrev[existingIndex] = {
          id: idRef.current,
          type: 'question',
          question: question,
          choices: choices
        };
        return filteredPrev;
      } else if (question || choices.length > 0) {
        // Yeni kayıt oluştur
        return [...filteredPrev, {
          id: idRef.current,
          type: 'question',
          question: question,
          choices: choices
        }];
      }
      return filteredPrev;
    });
  }, [question, choices]);
  
  // Başlangıçta boş kayıt oluşturma
  useEffect(() => {
    setBigData(prev => {
      // Tüm boş kayıtları temizle
      const filteredPrev = prev.filter(item => {
        if (item.type?.startsWith('question-')) {
          return item.question !== "" || item.choices.length > 0;
        }
        return true;
      });
      return filteredPrev;
    });
  }, []);
  
  if (status === "loading") return <div>Yükleniyorr....</div>;
  return (
    <div ref={setNodeRef} style={style} className="p-6 mb-2 w-full   bg-white rounded-lg shadow-md">
      <div {...listeners} {...attributes} className="flex justify-end text-2xl cursor-pointer" ><MdDragIndicator/></div>
      <div className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Soru
          </label>
          <input
            id="question"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            type="text"
            placeholder="Sorunuzu yazınız..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-col gap-4">
            {choices.map((choice) => (
              <Choice
                key={choice.id}
                choices={choices}
                question={question}
                data={data}
                setData={setData}
                setChoices={setChoices}
                choice={choice}
              />
            ))}
          </div>
        </div>

        <button
          onClick={addChoice}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <MdAdd className="w-5 h-5" />
          Yeni Seçenek Ekle
        </button>
        <JsonView value={data}/>
      </div>
    </div>
  );
}

function Choice({ choice, choices, setChoices,data,setData,question }) {
  const [text, setText] = useState(choice.text);

  const updateChoice = (e) => {
    setText(e.target.value);
    setData({question:question,choices:[...choices]})
    setChoices(
      choices.map((c) =>
        c.id === choice.id ? { ...c, text: e.target.value } : c
      )
    );
  };

  const deleteChoice = () => {
    setChoices(choices.filter((c) => c.id !== choice.id));
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className="flex items-center justify-center w-5 h-5">
        <input
          type="radio"
          name="choices"
          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
        />
      </div>
      <input
        onChange={updateChoice}
        type="text"
        value={text}
        placeholder="Seçenek giriniz..."
        className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
      <button
        onClick={deleteChoice}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-md hover:bg-red-50"
        title="Seçeneği Sil"
      >
        <MdDeleteOutline className="w-5 h-5" />
      </button>
    </div>
  );
}
