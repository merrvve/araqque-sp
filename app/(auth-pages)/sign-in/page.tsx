import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
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
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Giriş Yap
        </SubmitButton>
        <FormMessage message={searchParams} />
        <div className="bg-muted/50 px-5 py-3 border rounded-md flex gap-4">
          <div className="flex flex-col gap-1">
            <small className="text-sm text-secondary-foreground">
              <strong> Note:</strong> Öğrenci Kullanıcı adı: student@araqque.com şifre: 12345678 <br />
              Eğitici kullanıcı adı: trainer@araqque.com şifre: 12345678
            </small>
          </div>
        </div>
      </div>
    </form>
  );
}
