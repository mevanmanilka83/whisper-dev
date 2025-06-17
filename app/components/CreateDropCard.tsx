"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ImageIcon, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Suspense } from "react"
import SkeltonCard from "@/app/components/SkeltonCard"

interface CreateDropCardProps {
  zoneId?: string
}

export default function CreateDropCard({ zoneId }: CreateDropCardProps) {
  return (
    <Card className="p-4 shadow-sm rounded-lg border-border/50 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src="/whisper.jpg" alt="User avatar" />
          <AvatarFallback className="bg-muted text-muted-foreground text-sm">W</AvatarFallback>
        </Avatar>

        {/* Input */}
        <div className="flex-1">
          <Link href={zoneId ? `/zone/${zoneId}/drops` : "/communities/VR_46/post"}>
            <Input
              placeholder="What's happening?"
              className="w-full bg-muted/50 hover:bg-muted/70 transition-colors border-0 focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm rounded-full px-4"
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
            <Link href={zoneId ? `/zone/${zoneId}/drops` : "/communities/VR_46/post"}>
              <ImageIcon className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-primary/10 text-primary hover:text-primary rounded-full"
            asChild
          >
            <Link href={zoneId ? `/zone/${zoneId}/drops` : "/communities/VR_46/post"}>
              <Link2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
