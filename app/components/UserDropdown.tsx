"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import { signOut } from "next-auth/react"

interface UserDropdownProps {
  userImage: string
  userName: string
  userEmail: string
}

export default function UserDropdown({ userImage, userName, userEmail }: UserDropdownProps) {
  return (
    <div className="w-10 h-10 flex-shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-accent/50 transition-all duration-200 hover:scale-105 ring-2 ring-transparent hover:ring-primary/20 focus-visible:ring-primary/20 flex-shrink-0"
          >
            <Avatar className="h-9 w-9 shadow-md ring-1 ring-border/20">
              <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 shadow-xl border border-border/50 bg-background/95 backdrop-blur-sm rounded-lg"
          align="end"
          sideOffset={8}
          avoidCollisions={true}
          collisionPadding={8}
          side="bottom"
          alignOffset={0}
        >
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 shadow-sm">
                  <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{userName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate max-w-[150px]">
                    {userEmail || "No email"}
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mx-2" />
          <div className="p-1">
            <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors rounded-md p-3">
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors rounded-md p-3">
              <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator className="mx-2" />
          <div className="p-1">
            <DropdownMenuItem
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md p-3"
              onClick={() => signOut()}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
