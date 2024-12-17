"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {jwtDecode} from 'jwt-decode';
import { Button } from "@/components/ui/button";


interface CustomJwtPayload {
  user_role?: string; // Define your custom claim
}

export default function Login() {
  const supabase = createClient(); // Use the client-side Supabase instance
  const { setUser } = useAuthStore(); // Zustand store to manage user state
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Sign in using Supabase client
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
        // Update Zustand store with the user data
        setUser(data.user);
        
        const session = data.session;
        
          if (session) {
            const token = session.access_token;
        
            if (token) {
              const decoded = jwtDecode<CustomJwtPayload>(token);
              const userRole = decoded.user_role;
              
               if (userRole) {
              
                router.push(`/${userRole}`);
               }
               else {
              router.push('/')
               }
            }
          }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
 
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Giriş Yap</h1>
      <p className="text-sm text-foreground">
        Kayıt olmak için{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          tıklayınız.
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Şifre</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Şifremi unuttum
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <Button type="submit">
          Giriş Yap
        </Button>
       
        <div className="bg-muted/50 px-5 py-3 border rounded-md flex gap-4">
          <div className="flex flex-col gap-1">
            <small className="text-sm text-secondary-foreground">
              <strong> Note:</strong> Öğrenci Kullanıcı adı: student@araqque.com şifre: 12345678 <br />
              Eğitici kullanıcı adı: trainer@araqque.com şifre: 12345678
            </small>
            <p>
              <small> {error && <p className="text-red-500 mt-2">{error}</p>}</small>
            </p>
          </div>
        </div>
      </div>
    </form>
    </>
    
  );
}
