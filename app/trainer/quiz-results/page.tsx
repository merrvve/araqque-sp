"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { QuizResult } from "@/types/QuizResult";
import { ShowQuizResults } from "@/components/trainer/QuizResults";

export default function QuizResultsPage() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return; // Avoid making the request if there is no user
    const fetchData = async () => {
      const supabase = createClient();

      try {
        const { data: quizResults, error } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("trainer_id", user.id);

        if (error) {
          throw error;
        }

        setQuizResults(quizResults);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
        setError("Error loading quiz results.");
      }
    };

    fetchData();
  }, [user]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {quizResults.length > 0 ? (
        <ShowQuizResults quizResults={quizResults} />
      ) : (
        <div>Değerlendirme Sonucu bulunamadı</div>
      )}
    </>
  );
}
