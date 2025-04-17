import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateDropCard() {
  return (
    <Card className="p-4 border-none shadow-md rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0">
          <Image
            src="/whisper.jpg"
            alt="User avatar"
            fill
            className="object-cover rounded-full border-2 border-primary/20"
          />
        </div>
        <div className="flex-1">
          <Link href="/communities/VR_46/post" className="w-full block">
            <Input
              placeholder="Drop your thoughts..."
              className="w-full bg-muted/30 hover:bg-muted/50 transition-colors rounded-full border-none focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </Link>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted/80 h-10 w-10"
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-primary text-white hover:bg-primary/90 h-10 w-10"
          >
            <Link2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
