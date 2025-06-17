"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Anchor, MessageSquare, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import CopyLink from "./CopyLink"
import { handleBoost } from "../actions/actions"
import Render from "./Render"
import SkeltonCard from "./SkeltonCard"

interface DropCardProps {
  title: string
  jsonContent: unknown
  createdAt: string | Date
  id: string
  image: string | null
  subName: string | null
  boostCount: number
}

export default function DropCard({ id, title, jsonContent, createdAt, image, subName, boostCount }: DropCardProps) {
  // Show skeleton if required data is missing
  if (!title || !jsonContent) {
    return <SkeltonCard />
  }

  const formattedDate = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ""

  // Ensure jsonContent is properly parsed if it's a string
  const parsedContent = typeof jsonContent === "string" && jsonContent ? JSON.parse(jsonContent) : jsonContent

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl bg-background/80 backdrop-blur-sm group">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-border/20">
              <AvatarImage src="/whisper.jpg" alt="User avatar" />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">VR_46</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formattedDate}
              </div>
            </div>
          </div>
          {subName && (
            <Badge
              variant="secondary"
              className="bg-primary/10 hover:bg-primary/15 text-primary border-primary/20 px-3 py-1 text-xs font-medium"
            >
              zone/{subName}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <Link href={`/drop/${id}`} className="block group/content">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold leading-tight group-hover/content:text-primary transition-colors duration-200">
              {title}
            </h2>

            <div className="text-content prose prose-sm dark:prose-invert w-full overflow-hidden break-words">
              <Render data={parsedContent} />
            </div>

            {image && (
              <div className="mt-4 rounded-lg overflow-hidden bg-muted/20 shadow-sm">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={title}
                  width={600}
                  height={400}
                  className="w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </Link>

        <Separator className="my-4" />

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Boost Actions */}
            <div className="flex items-center bg-muted/30 rounded-lg p-1">
              <form action={handleBoost} className="inline">
                <input type="hidden" name="boostDirection" value="Boost" />
                <input type="hidden" name="pointId" value={id} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
                  title="Boost this drop"
                  type="submit"
                >
                  <Rocket className="w-4 h-4" />
                </Button>
              </form>

              <span className="px-2 text-sm font-medium min-w-[2rem] text-center">{boostCount}</span>

              <form action={handleBoost} className="inline">
                <input type="hidden" name="boostDirection" value="Reduce" />
                <input type="hidden" name="pointId" value={id} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110"
                  title="Reduce this drop"
                  type="submit"
                >
                  <Anchor className="w-4 h-4" />
                </Button>
              </form>
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 rounded-lg"
              asChild
            >
              <Link href={`/drop/${id}#comments`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="text-sm">40 comments</span>
              </Link>
            </Button>
          </div>

          {/* Copy Link */}
          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  )
}
