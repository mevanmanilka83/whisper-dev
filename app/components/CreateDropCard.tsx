"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateDropCardProps {
  zoneId?: string;
}

export default function CreateDropCard({ zoneId }: CreateDropCardProps) {
  return (
    <Card className="p-3 border-none shadow-sm rounded-lg">
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 flex-shrink-0">
          <Image
            src="/whisper.jpg"
            alt="User avatar"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="flex-1">
          <Link
            href={zoneId ? `/zone/${zoneId}/drops` : "/communities/VR_46/post"}
            className="w-full block"
          >
            <Input
              placeholder="Drop your thoughts..."
              className="w-full bg-muted/20 hover:bg-muted/30 transition-colors rounded-md border-none focus-visible:ring-0 h-9 text-sm"
            />
          </Link>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md hover:bg-muted/20 h-8 w-8 text-muted-foreground"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md bg-primary/10 text-primary hover:bg-primary/20 h-8 w-8"
          >
            <Link2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
