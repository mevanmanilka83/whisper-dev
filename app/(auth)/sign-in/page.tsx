import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { SignIn } from "@/app/components/SignIn";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="self-start mb-2">
            <Link
              href="/"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={48}
              height={48}
              className="size-12 rounded-full shadow-sm"
              priority
            />
            <h1 className="text-3xl font-bold">
              <span className="text-primary uppercase">Whisper</span>
            </h1>
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
}
