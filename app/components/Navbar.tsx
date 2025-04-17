import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.jpg";
import { ThemeToggle } from "./theme-toggle";
import UserDropdown from "./UserDropdown";
import { auth } from "@/app/utils/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="h-[10vh] w-full flex items-center border-b px-5 lg:px-14">
      <div className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-x-3 text-primary uppercase text-xl md:text-2xl lg:text-2xl font-bold"
        >
          <Image
            src={logo || "/placeholder.svg"}
            alt="Whisper Logo"
            width={40}
            height={40}
            className="h-8 w-8 md:h-10 md:w-10"
          />
          Whisper
        </Link>

        <div className="flex items-center gap-x-4">
          <ThemeToggle />
          {session ? (
            <UserDropdown
              userImage={session.user?.image ?? "/placeholder.svg"}
              userName={session.user?.name ?? "User"}
              userEmail={session.user?.email ?? ""}
            />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
