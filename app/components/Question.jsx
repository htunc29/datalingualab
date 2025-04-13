"use client";
import { useState } from "react";
import {MdDeleteOutline} from 'react-icons/md'
export default function Question() {
  const [choices, setChoices] = useState([]);
  const [question, setQuestion] = useState("");
  const [count, setCount] = useState(0);
  const addChoice = () => {
    const newChoice = {
      id: count + 1,
      text: "",
    };
    setCount(count + 1);
    setChoices([...choices, newChoice]);
  };
  return (
    <div className=" p-4 md:p-6 w-full mx-auto bg-white shadow-sm rounded-sm">
      <div>
        <input
          className="outline-none px-4 py-2 rounded-sm placeholder:text-slate-500 bg-slate-200 w-full shadow-inner"
          type="text"
          placeholder="Sorunuzu yazınız..."
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="border-1 border-slate-200 w-full my-2"></div>
      <div className="flex flex-col gap-3">
        {choices.map((choice) => (
          <Choice
            key={choice.id}
            choices={choices}
            setChoices={setChoices}
            choice={choice}
          />
        ))}
      </div>

      <div className="border-1 border-slate-200 w-full my-2"></div>
      <button
        onClick={addChoice}
        className="bg-blue-500  p-2 text-white font-bold shadow-sm rounded-sm hover:cursor-pointer hover:scale-90 transition duration-500 hover:bg-blue-700"
      >
        Seçenek Ekle
      </button>
      <div></div>
    </div>
  );
}
function Choice({ data, setData, choice, choices, setChoices }) {
  const [texts, SetTexts] = useState(choice.text);
  const updateChoice = (e) => {
    SetTexts(e.target.value);
    setChoices(
      choices.map((c) =>
        c.id == choice.id ? { ...c, text: e.target.value } : c
      )
    );
  };
  const deleteChoice = () => {
    setChoices(choices.filter((c) => c.id != choice.id));
  };
  return (
    <div className="flex gap-2">
      <input type="radio" name="c" />
      <input
        onChange={updateChoice}
        type="text"
        value={texts}
        placeholder="Seçenek giriniz ..."
        className="w-full rounded-sm outline-none bg-slate-200 px-2 py-2 placeholder:text-slate-500 shadow-inner"
      />
      <button
        onClick={deleteChoice}
        className="bg-rose-500 text-white px-2 rounded-sm shadow-sm"
      >
       <MdDeleteOutline/>
      </button>
    </div>
  );
}
