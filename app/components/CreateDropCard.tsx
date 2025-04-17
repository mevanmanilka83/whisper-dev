import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateDropCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 flex-shrink-0">
          <Image
            src="/whisper.jpg"
            alt="User avatar"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="w-full">
          <Link href="/communities/VR_46/post" className="w-full">
            <Input
              placeholder="Drop your thoughts..."
              className="w-full bg-background"
            />
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-zinc-900 text-white"
          >
            <Link2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
