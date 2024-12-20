"use client";

import { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import { CountdownTimer } from "./CountdownTimer";
import useQuestionStore from "../stores/questionStore";
import { Question } from "@/types/question";
import { QuizResult } from "@/types/QuizResult";
import { useAuthStore } from "@/stores/authStore";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
export default function Quiz() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [quizState, setQuizState] = useState(true);
  const [answers, setAnswers] = useState<string[]>(Array(9).fill(""));
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [answerStatuses, setAnswerStatuses] = useState<boolean[]>([]);
  const { questions, updateQuestionExamin, homeworkId } = useQuestionStore();
  const { user } = useAuthStore();

  if (!user) {
    redirect("/sign-in");
  }

  const supabase = createClient();

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

  const saveQuizResult = async (quizResult: QuizResult) => {
    try {
      const { data, error } = await supabase
        .from("quiz_results") // Replace with your table name
        .insert([quizResult])
        .select()
        .single();

      if (error) {
        console.error("Error saving quiz result:", error);
        return;
      }

      console.log("Quiz result saved successfully:", data);
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }
  };

  const fetchTrainerId = async (
    homeworkId: string,
  ): Promise<string | undefined> => {
    try {
      const { data, error } = await supabase
        .from("homework") // Replace with your table name
        .select("trainer_id")
        .eq("id", homeworkId)
        .single();

      if (error) {
        console.error("Error fetching trainer_id:", error);
        return undefined;
      }

      return data?.trainer_id;
    } catch (error) {
      console.error("Error fetching trainer_id:", error);
      return undefined;
    }
  };

  // Check answers once when the quiz ends
  useEffect(() => {
    const saveQuiz = async () => {
      if (!quizState) {
        const statuses = questions.map((question: Question, index: number) =>
          handleAnswerCheck(question, answers[index]),
        );
        setAnswerStatuses(statuses);
        setCorrectCount(statuses.filter((status: any) => status).length);

        // Fetch trainer_id and construct the quizResult object
        const trainerId = await fetchTrainerId(
          "d31a8ae1-b0b3-4957-abcc-916b8ae54a38",
        );

        const quizResult: QuizResult = {
          student_id: user.id,
          homework_id: "d31a8ae1-b0b3-4957-abcc-916b8ae54a38",
          trainer_id: trainerId,
          questions: questions,
        };

        console.log(quizResult);
        await saveQuizResult(quizResult);
      }
    };

    saveQuiz();
  }, [quizState]);

  function handleAnswerCheck(question: Question, student_answer: string) {
    const lowerCorrectAnswer = question.correct_answer.toLowerCase();
    const lowerStudentAnswer = student_answer.toLowerCase();

    if (question.question_type === "Çoktan Seçmeli Test Sorusu") {
      const isCorrect = lowerCorrectAnswer[0] === lowerStudentAnswer[0];

      return isCorrect;
    }
    const isCorrect = lowerCorrectAnswer === lowerStudentAnswer;

    return isCorrect;
  }

  return (
    <>
      {activeQuestion < 9 && quizState && (
        <div className="flex justify-end p-5">
          <CountdownTimer
            initialTime={900}
            quizState={quizState}
            onTimeOut={handleTimeOut}
          />
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
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="underline">Doğru Cevaplar:</strong>
              <ul>
                {questions.map((question: Question, index: number) => (
                  <li key={index}>{question.correct_answer}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="underline">Değerlendirme:</strong>

              <ul>
                {answerStatuses.map((status, index) => (
                  <li key={index} className="m-1">
                    {status ? (
                      <span color="success">Doğru</span>
                    ) : (
                      <span color="failure">Yanlış</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="underline">Cevaplanma Süresi:</strong>
              <ul>
                {questions.map((question: Question, index: number) => (
                  <li key={index}>
                    {question.completion_time
                      ? (question.completion_time / 1000).toFixed(2)
                      : 0}{" "}
                    sn
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-end items-end p-1 sm:mr-10">
            <h2 className="text-xl font-bold m-1">Toplam: </h2>
            <span color="success" className="m-2 w-20">
              {correctCount} Doğru
            </span>
            <span color="failure" className="m-2 w-20">
              {9 - correctCount} Yanlış
            </span>
          </div>
        </>
      )}
    </>
  );
}
