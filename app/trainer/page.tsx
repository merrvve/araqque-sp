"use client";
import CreateHomeWork from "@/components/trainer/CreateHomework";
import { useAuthStore } from "@/stores/authStore";

import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const { user } = useAuthStore();
  if (!user) {
    return redirect("/sign-in");
  }

  return <CreateHomeWork user={user} />;
}
