"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Anchor, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

import CopyLink from "./CopyLink";
import { handleBoost } from "../actions/actions";

interface DropCardProps {
  title: string;
  jsonContent: any;
  createdAt: any;
  id: string;
  image: string | null;
  subName: string | null;
  boostCount: number;
}

export default function DropCard({
  id,
  title,
  jsonContent,
  createdAt,
  image,
  subName,
  boostCount,
}: DropCardProps) {
  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-lg">
      <div className="p-4">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          {subName && (
            <Badge
              variant="outline"
              className="mr-2 bg-primary/5 hover:bg-primary/5 text-primary border-primary/20 px-2 py-0 h-5"
            >
              zone/{subName}
            </Badge>
          )}
          <span className="inline-flex items-center">
            <span className="relative h-4 w-4 mr-1">
              <Image
                src="/whisper.jpg"
                alt="User avatar"
                fill
                className="rounded-full object-cover"
              />
            </span>
            <span className="hover:text-foreground cursor-pointer">VR_46</span>
          </span>
          <span className="mx-1.5">•</span>
          <span>{formattedDate}</span>
        </div>

        <Link href={`/post/${id}`} className="block group">
          <h2 className="text-base font-medium group-hover:text-primary transition-colors mb-2">
            {title}
          </h2>

          {jsonContent && (
            <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {typeof jsonContent === "string"
                ? jsonContent
                : JSON.stringify(jsonContent)}
            </div>
          )}

          {image && (
            <div className="mt-2 mb-2 rounded-md overflow-hidden max-h-[300px] bg-muted/20">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}
        </Link>

        <div className="flex items-center mt-3 gap-2">
          <div className="flex items-center">
            <form action={handleBoost}>
              <input type="hidden" name="boostDirection" value="Boost" />
              <input type="hidden" name="pointId" value={id} />
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md hover:bg-primary/5 hover:text-primary transition-colors h-7 w-7 p-0"
                title="Boost"
                type="submit"
              >
                <Rocket className="w-4 h-4" />
              </Button>
            </form>
            <span>{boostCount}</span>
            <form action={handleBoost}>
              <input type="hidden" name="boostDirection" value="Reduce" />
              <input type="hidden" name="pointId" value={id} />
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md hover:bg-destructive/5 hover:text-destructive transition-colors h-7 w-7 p-0"
                title="Reduce"
                type="submit"
              >
                <Anchor className="w-4 h-4" />{" "}
              </Button>
            </form>
          </div>
          <div className="h-4 w-px bg-muted/50 mx-1"></div>
          <div className="flex items-center gap-x-5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors px-2 ml-auto"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">40 comments</span>
            </Button>
          </div>
          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  );
}
