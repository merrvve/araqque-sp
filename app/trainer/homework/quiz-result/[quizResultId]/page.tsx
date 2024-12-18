"use client";

import { useEffect, useState } from "react";
import { QuizResult } from "@/types/QuizResult";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";

export default function QuizResultsPage() {
  const { quizResultId } = useParams();

  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Fetch quiz results from Supabase
  useEffect(() => {
    if (!quizResultId) return;

    const fetchQuizResults = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("id", quizResultId)
        .single();
      setLoading(false);

      if (error) {
        console.error("Error fetching quiz result:", error.message);
        return;
      }

      setQuizResult(data);
      console.log(data)
    };

    fetchQuizResults();
  }, [quizResultId, supabase]);

  if (loading) return <p>Sonuçlar yükleniyor...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        {quizResult?.student_id} No'lu Öğrenci {quizResultId} Nolu Değerlendirme Ayrıntıları
      </h1>
      {quizResult ? (
        <div>
          {quizResult.questions.map((question: any, index: number) => (
            <div key={index} className="mb-4">
              <h2 className="font-medium">Soru {index + 1}: {question.question}</h2>
              <div className={question.isCorrect ? 'text-green-800' : 'text-red-800'}>
              <p>Doğru Cevap: {question.correct_answer}</p>
              <p>Öğrenci Cevap: {question.student_answer}</p>
              <p>Cevaplama Süresi {(question.completion_time / 1000).toFixed(2)} sn</p>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <p>Sonuç bulunamadı.</p>
      )}
    </div>
  );
}
