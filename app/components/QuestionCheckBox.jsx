"use client";
import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline, MdAdd, MdCheckBoxOutlineBlank, MdCheckBox, MdDragIndicator } from "react-icons/md";
import { useDraggable } from "@dnd-kit/core";
import JsonView from "@uiw/react-json-view";
export default function QuestionCheckBox({bigData, setBigData}) {
  const [choices, setChoices] = useState([]);
  const [question, setQuestion] = useState("");
  const [data, setData] = useState({});
  const [count, setCount] = useState(0);
  const [showOtherBox, setShowOtherBox] = useState(false);
  const idRef = useRef(`questioncheck-${Math.floor(Math.random() * 9999)}`);
  const [otherText, setOtherText] = useState("Diğer Cevap");
const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `questioncheck-${idRef.current}`,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  const addChoice = () => {
    const newChoice = {
      id: count + 1,
      text: "",
    };
    setCount(count + 1);
    setChoices([...choices, newChoice]);
  };

  const addOther = (othertext) => {
    const newChoice = {
      id: count + 1,
      text: othertext,
    };
    setCount(count + 1);
    setChoices([...choices, newChoice]);
  };
 useEffect(() => {
    setData({ question: question, choices: choices });
    setBigData(prev => {
      // Önce tüm questioncheck tipindeki kayıtları temizle
      const filteredPrev = prev.filter(item => !item.type?.startsWith('questioncheck-'));
      // Aynı ID'ye sahip kayıt var mı kontrol et
      const existingIndex = filteredPrev.findIndex(item => item.id === idRef.current);
      
      if (existingIndex !== -1) {
        // Kaydı güncelle
        filteredPrev[existingIndex] = {
          id: idRef.current,
          type: 'questioncheck',
          question: question,
          choices: choices
        };
        return filteredPrev;
      } else if (question || choices.length > 0) {
        // Yeni kayıt oluştur
        return [...filteredPrev, {
          id: idRef.current,
          type: 'questioncheck',
          question: question,
          choices: choices
        }];
      }
      return filteredPrev;
    });
  }, [question, choices]);
  return (
    <div ref={setNodeRef} style={style} className="p-6 mb-2 w-full mx-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      
      <div className="flex justify-end text-2xl cursor-pointer" {...listeners} {...attributes} ><MdDragIndicator/></div>
      <div className="mb-4">
        <input
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
          type="text"
          placeholder="Sorunuzu yazınız..."
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      
      <div className="space-y-3 mb-4">
        {choices.map((choice) => (
          <Choice
            key={choice.id}
            choices={choices}
            setChoices={setChoices}
            choice={choice}
          />
        ))}
      </div>

      <div className="flex items-center gap-x-3 mb-4">
        <label className="flex items-center gap-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
            onChange={() => setShowOtherBox(!showOtherBox)}
          />
          <span className="text-gray-700 font-medium">Diğer</span>
        </label>
      </div>

      {showOtherBox && (
        <div className="flex gap-3 mb-4">
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
            type="text"
            value={otherText}
            placeholder="Diğer cevabınızı yazınız..."
            onChange={(e) => setOtherText(e.target.value)}
          />
          <button 
            onClick={() => addOther(otherText)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          >
            <MdAdd className="text-xl" />
            Ekle
          </button>
        </div>
      )}

      <button
        onClick={addChoice}
        className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <MdAdd className="text-xl" />
        Seçenek Ekle
      </button>
      <JsonView value={data}/>
    </div>
  );
}

function Choice({ choice, choices, setChoices }) {
  const [texts, SetTexts] = useState(choice.text);
  const [isChecked, setIsChecked] = useState(false);

  const updateChoice = (e) => {
    SetTexts(e.target.value);
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
      <button
        onClick={() => setIsChecked(!isChecked)}
        className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
      >
        {isChecked ? <MdCheckBox className="text-xl" /> : <MdCheckBoxOutlineBlank className="text-xl" />}
      </button>
      <input
        onChange={updateChoice}
        type="text"
        value={texts}
        placeholder="Seçenek giriniz ..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
      />
      <button
        onClick={deleteChoice}
        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-300 opacity-0 group-hover:opacity-100"
      >
        <MdDeleteOutline className="text-xl" />
      </button>
    </div>
  );
}
