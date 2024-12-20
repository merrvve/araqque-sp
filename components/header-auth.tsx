"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/authStore"; 
import { createClient } from "@/utils/supabase/client"; 
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { redirect } from "next/navigation";
export default function AuthButton() {
  const { setUser } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null); // Clear the user state in Zustand
    redirect("/sign-in");
  };

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <div>
          <Badge
            variant={"default"}
            className="font-normal pointer-events-none"
          >
            Please update .env.local file with anon key and url
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant={"outline"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-in">Giriş Yap</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={"default"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-up">Kayıt Ol</Link>
          </Button>
        </div>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <Button onClick={handleSignOut} variant={"outline"}>
        Çıkış Yap
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Giriş Yap</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Kayıt Ol</Link>
      </Button>
    </div>
  );
}
