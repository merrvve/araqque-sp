"use client";
import CreateHomeWork from "@/components/trainer/CreateHomework";
import { useAuthStore } from "@/stores/authStore";


import { useEffect } from "react";

export default function TrainerPage() {
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (!user) return;
  }, [user]);
  return <CreateHomeWork user={user} />;
}
