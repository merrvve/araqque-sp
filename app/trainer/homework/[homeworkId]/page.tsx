"use client";

import { useEffect, useState } from "react";

import { QuizResult } from "@/types/QuizResult";
import { createClient } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
export default function QuizResultsPage() {
  const { homeworkId } = useParams();
    const router = useRouter();
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  // Fetch quiz results from Supabase
  useEffect(() => {
    if (!homeworkId) return;

    const fetchQuizResults = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("homework_id", homeworkId);

      setLoading(false);

      if (error) {
        console.error("Error fetching quiz results:", error.message);
        return;
      }

      setQuizResults(data || []);
    };

    fetchQuizResults();
  }, [homeworkId]);

  if (loading) return <p>Sonuçlar yükleniyor...</p>;

  const handleRowClick = (quizResultId: string | undefined) => {
    if(quizResultId) {
        router.push(`/trainer/homework/quiz-result/${quizResultId}`); 
    }

  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        {homeworkId} Kodlu Ödev için Değerlendirme Sonuçları
      </h1>
      {quizResults.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th></th>
              <th className="border border-gray-300 px-4 py-2">Öğrenci Id</th>
              <th className="border border-gray-300 px-4 py-2">Tarih</th>
              <th className="border border-gray-300 px-4 py-2">Sonuç</th>
              <th className="border border-gray-300 px-4 py-2">Detay</th>
            </tr>
          </thead>
          <tbody>
            {quizResults.map((result, index) => {
              // Calculate the count of correct answers for each result
              const correctCount = result.questions.filter(
                (question) => question.isCorrect
              ).length;

              return (
                <tr key={result.id}
                 className="cursor-pointer hover:bg-slate-100"
                onClick={() => handleRowClick(result.id)}>
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {result.student_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {result.created_at}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {/* Render the correct answer count */}
                    <span className="text-green-800">
                      {correctCount} Doğru,{" "}
                    </span>
                    <span className="text-red-800">
                      {9 - correctCount} Yanlış
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Detay</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Sonuç bulunamadı.</p>
      )}
    </div>
  );
}
