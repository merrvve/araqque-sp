"use client";

import { useEffect, useState } from "react";
import Homeworks from "@/components/trainer/Homeworks";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { Homework } from "@/types/Homework";

export default function HomeworksPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return; // Avoid making the request if there is no user

    const fetchData = async () => {
      const supabase = createClient();

      try {
        const { data: homeworks, error } = await supabase
          .from("homework")
          .select("*")
          .eq("trainer_id", user.id);

        if (error) {
          throw error;
        }
        setHomeworks(homeworks);
      } catch (err) {
        console.error("Error fetching homeworks:", err);
        setError("Error loading homeworks.");
      }
    };

    fetchData();
  }, [user]); // Dependency array ensures this runs only when `user` changes

  if (error) {
    return <div>{error}</div>;
  }

  return <Homeworks user={user} homeworks={homeworks} />;
}
