"use client";
import { FileUpload } from "@/components/FileUpload";

import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function StudentPage() {
  // const supabase = createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/sign-in");
  // }
 const { user } = useAuthStore();
  
  useEffect(() => {
    if (!user) return;
  }, [user]);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <FileUpload />
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          student
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
