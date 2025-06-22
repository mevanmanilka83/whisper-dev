"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ImageIcon, Link2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"

interface CreateDropCardProps {
  zoneId?: string
}

export default function CreateDropCard({ zoneId }: CreateDropCardProps) {
  const { data: session, status } = useSession()

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <Card className="p-4 shadow-sm rounded-lg border-border/50">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 h-10 bg-muted rounded-full animate-pulse" />
          <div className="flex space-x-1">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </Card>
    )
  }

  // If not authenticated, show a sign-in prompt
  if (!session?.user) {
    return (
      <Card className="p-4 shadow-sm rounded-lg border-border/50 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Link href="/api/auth/signin">
              <Input
                placeholder="Sign in to create a drop..."
                className="w-full bg-muted/50 hover:bg-muted/70 transition-colors border-0 focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm rounded-full px-4 cursor-pointer"
                readOnly
              />
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-muted/70 text-muted-foreground hover:text-foreground rounded-full"
              asChild
            >
              <Link href="/api/auth/signin">
                <ImageIcon className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-primary/10 text-primary hover:text-primary rounded-full"
              asChild
            >
              <Link href="/api/auth/signin">
                <Link2 className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Authenticated user - show normal create drop interface
  return (
    <Card className="p-4 shadow-sm rounded-lg border-border/50 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        {/* User Avatar */}
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={session.user.image || undefined} alt="User avatar" />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Input */}
        <div className="flex-1">
          <Link href={zoneId ? `/zone/${zoneId}/drops` : "/zone/setup"}>
            <Input
              placeholder="What's happening?"
              className="w-full bg-muted/50 hover:bg-muted/70 transition-colors border-0 focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm rounded-full px-4 cursor-pointer"
              readOnly
            />
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-muted/70 text-muted-foreground hover:text-foreground rounded-full"
            asChild
          >
            <Link href={zoneId ? `/zone/${zoneId}/drops` : "/zone/setup"}>
              <ImageIcon className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-primary/10 text-primary hover:text-primary rounded-full"
            asChild
          >
            <Link href={zoneId ? `/zone/${zoneId}/drops` : "/zone/setup"}>
              <Link2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
