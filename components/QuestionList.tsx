"use client";

import { useEffect, useState } from "react";
import { Label } from "./ui/label";

import useQuestionStore from "../stores/questionStore";

type QuestionState = {
  activeQuestion: number;
  quizState: boolean;
  answers: string[]; // Array to hold answers for each question
  setAnswers: (index: number, answer: string) => void; // Function to update answers
};

const QuestionList: React.FC<QuestionState> = ({ activeQuestion, quizState, answers, setAnswers }) => {
  const { questions, updateQuestionTime } = useQuestionStore();
  // Track the start time for each question
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Calculate time spent and save to completion_time of previous question
    if (startTime !== null && activeQuestion > 0) {
      const endTime = Date.now();
      const timeSpent = endTime - startTime;

      // Update completion_time for the previous question
      updateQuestionTime(activeQuestion - 1, timeSpent);
    }

    // Set new start time for the current question
    setStartTime(Date.now());

  }, [activeQuestion]); // Re-run this effect when activeQuestion changes


  return (
    <div className="flex flex-col mx-auto p-10 w-screen sm:w-[500px]">
      {questions[activeQuestion] && activeQuestion < 9 && quizState && (
        <>
          
          <ul>
            <li key={questions[activeQuestion].id} className="mb-5">
              <h5 className="text-xl font-bold underline mb-5">
                Soru No: {activeQuestion + 1}
              </h5>

              <p className="mb-2 text-xl">
                {questions[activeQuestion].question}
              </p>

              {questions[activeQuestion].question_type !== "Boşluk Doldurma Sorusu" ? (
                <>
                  {questions[activeQuestion].choices.map((choice: any, index: number) => (
                    <div className="flex gap-3" key={choice}>
                      
                        <input type="radio"
                          className="m-1"
                          name={`question_${questions[activeQuestion].id}`} // Grouping for radio buttons
                          value={choice }
                          checked={questions[activeQuestion].question_type === "Çoktan Seçmeli Test Sorusu" ? (answers[activeQuestion].slice(0,1) === choice.slice(0,1)) : answers[activeQuestion] === choice}
                          onChange={(e: any) => setAnswers(activeQuestion, e.target.value)} // Update answers on change
                        />
                        <Label className="text-lg">
                        {choice}
                      </Label>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <strong className="m-2">Cevap:</strong>
                  <input
                    type="text"
                    className="border border-gray-300 p-2 rounded"
                    value={answers[activeQuestion] || ''} // Use the answer if it exists
                    onChange={(e) => setAnswers(activeQuestion, e.target.value)} // Update answer on change
                  />
                </>
              )}

              
            </li>
          </ul>
        </>
      )}
      {(activeQuestion === 9 || !quizState) && (
        <>
          <h1 className="text-2xl font-bold leading-loose">Testi Tamamladınız!</h1>
        </>
      )}
    </div>
  );
};

export default QuestionList;
