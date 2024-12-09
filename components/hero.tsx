import Link from "next/link"
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
     Logo
      </div>
      <h1 className="sr-only"> Araqque</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
      Araqque'ye Hoşgeldiniz
      </p>
      <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Giriş Yap</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Kayıt Ol</Link>
      </Button>
    </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
     
    </div>
  );
}
