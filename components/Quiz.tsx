"use client";

import { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import { CountdownTimer } from "./CountdownTimer";
import useQuestionStore from "../stores/questionStore";
import { Question } from "@/types/question";

export default function Quiz() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [quizState, setQuizState] = useState(true);
  const [answers, setAnswers] = useState<string[]>(Array(9).fill("")); 
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [answerStatuses, setAnswerStatuses] = useState<boolean[]>([]);
  const { questions, updateQuestionExamin } = useQuestionStore();

  const updateAnswer = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  function handleForward() {
    if (activeQuestion < 9) {
      setActiveQuestion((prev) => prev + 1);
      if (activeQuestion === 8) {
        setQuizState(false);
      }
    }
  }

  function handleTimeOut() {
    setQuizState(false);
  }

  // Check answers once when the quiz ends
  useEffect(() => {
    if (!quizState) {
      const statuses = questions.map((question : Question, index: number) =>
        handleAnswerCheck(question, answers[index])
      );
      setAnswerStatuses(statuses);
      setCorrectCount(statuses.filter((status: any) => status).length);
    }
  }, [quizState]);

  function handleAnswerCheck(question: Question, student_answer: string) {
    const lowerCorrectAnswer = question.correct_answer.toLowerCase();
    const lowerStudentAnswer = student_answer.toLowerCase();

    if (question.question_type === "Çoktan Seçmeli Test Sorusu") {
      const isCorrect = lowerCorrectAnswer[0] === lowerStudentAnswer[0]
      updateQuestionExamin(question.id, isCorrect )
      return isCorrect;
    }
    const isCorrect =  lowerCorrectAnswer === lowerStudentAnswer;
    updateQuestionExamin(question.id, isCorrect )
    return isCorrect;
  }

  return (
    <>
    {activeQuestion < 9 && quizState && (
      <div className="flex justify-end p-5">
        <CountdownTimer initialTime={900} quizState={quizState} onTimeOut={handleTimeOut} />
      </div>
    )}
      
      <div>
        <QuestionList
          activeQuestion={activeQuestion}
          quizState={quizState}
          answers={answers}
          setAnswers={updateAnswer}
        />
      </div>

      <div className="flex justify-end sm:px-52">
        {activeQuestion < 9 && quizState && (
          <button
            className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4"
            onClick={handleForward}
          >
            {activeQuestion == 8 ? "Tamamla" : "Sonraki"}
          </button>
        )}
      </div>
      {!quizState && (
        <>
        <div className="grid grid-cols-5 gap-1">
          <div>
          <strong className="underline">Soru:</strong>
            <ul>
              {answers.map((answer, index) => (
                <li key={index}>
                  {/* <Tooltip content={questions[index].question}>
                    
                  </Tooltip> */}
                  <strong>Soru {index + 1}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="underline">Cevaplarınız:</strong>
            <ul>
              {answers.map((answer, index) => (
                <li key={index}>
                   {answer}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="underline">Doğru Cevaplar:</strong>
            <ul>
              {questions.map((question: Question,index : number) => (
                  <li key={index}>{question.correct_answer}</li>
                
              ))}
            </ul>
          </div>
          <div>
            <strong className="underline">Değerlendirme:</strong>
            
            <ul>
              {answerStatuses.map((status, index) => (
                <li key={index} className="m-1">
                  {status ? <span color="success">Doğru</span> : <span color="failure">Yanlış</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="underline">Cevaplanma Süresi:</strong>
            <ul>
              {questions.map((question : Question, index: number) => (
                <li key={index}>{question.completion_time ? (question.completion_time / 1000).toFixed(2) : 0} sn</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-end items-end p-1 sm:mr-10">
              <h2 className="text-xl font-bold m-1">Toplam: </h2>
                <span color="success" className="m-2 w-20">{correctCount} Doğru</span> 
                <span color="failure" className="m-2 w-20">{9-correctCount} Yanlış</span> 
              
        </div>
        </>
        
      )}
    </>
  );
}
