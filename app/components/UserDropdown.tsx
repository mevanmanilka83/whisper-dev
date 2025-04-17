import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { signOut } from "../utils/auth";
import { redirect } from "next/navigation";

interface UserDropdownProps {
  userImage: string;
  userName: string;
  userEmail: string;
}

export default function UserDropdown({
  userImage,
  userName,
  userEmail,
}: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-2 hover:bg-transparent flex items-center gap-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex min-w-0 flex-col px-4 py-3">
          <span className="truncate text-sm font-medium text-foreground">
            {userName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {userEmail}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="py-2 px-4 focus:bg-accent">
          <Link href="/zone/setup" className="w-full flex items-center">
            Setup Zone
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="py-2 px-4 focus:bg-accent">
          <Link href="/zone/point" className="w-full flex items-center">
            Drop Point
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="py-2 px-4 focus:bg-accent">
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signOut();
              redirect("/");
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <LogOut
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Sign Out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
