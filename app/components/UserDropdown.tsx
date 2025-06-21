"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { User, LogOut, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { getNotificationStatus } from "@/app/actions/profile"
import { Badge } from "@/components/ui/badge"


interface UserDropdownProps {
  user: {
    name?: string | null
    image?: string | null
    email?: string | null
  }
}

export default function UserDropdown({ user }: UserDropdownProps) {
    const [invitationCount, setInvitationCount] = useState(0)

    useEffect(() => {
      const checkNotifications = async () => {
        try {
          const { count } = await getNotificationStatus()
          setInvitationCount(count)
        } catch (error) {
            // Silently fail, don't bother the user with notification errors
            console.error("Failed to check notification status:", error)
        }
      }
  
      checkNotifications()
      const interval = setInterval(checkNotifications, 30000) // Poll every 30 seconds

      // Listen for manual refresh event
      const refreshListener = () => checkNotifications()
      window.addEventListener("refresh-notifications", refreshListener)

      return () => {
        clearInterval(interval)
        window.removeEventListener("refresh-notifications", refreshListener)
      }
    }, [])

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <button className="relative flex items-center justify-center rounded-full w-10 h-10 ring-2 ring-offset-2 ring-offset-background ring-primary/20 focus:outline-none focus:ring-primary">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || "/whisper.jpg"} alt={user.name || "User Avatar"} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          {invitationCount > 0 && (
            <span className="absolute -top-1 -right-1 block min-w-[1.5em] h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white">
              {invitationCount}
            </span>
          )}
        </button>
        </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer flex justify-between items-center">
                <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Invitations</span>
          </div>
                {invitationCount > 0 && <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-xs">{invitationCount}</Badge>}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
