import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AtSign, Webhook, WebhookOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DropCardProps {
  title: string;
  jsonContent: any;
  createdAt: any;
  id: string;
  image: string | null;
  subName: string | null;
}

export default function DropCard({
  id,
  title,
  jsonContent,
  createdAt,
  image,
  subName,
}: DropCardProps) {
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2">
        <form action="">
          <Button>
            <Webhook className="w-5 h-5 mr-2" />
          </Button>
        </form>
        0
        <form action="">
          <Button>
            <WebhookOff className="w-5 h-5 mr-2" />
          </Button>
        </form>
        <div className="flex flex-col gap-x-2 p-4">
          <Link href={`/zone/${subName}`} className="font-semibold text-xs">
            zone/{subName}
          </Link>
          <p className="text-sm text-muted-foreground">
            Drop by: <span className="hover:text-primary">VR_46</span>
          </p>
        </div>
        <div className="px-2">
          <Link href="/">
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>
        <div className="max-h-[300px] overflow-hidden">
          {image && (
            <Image
              src={image}
              alt="point image"
              width={600}
              height={300}
              className="w-full h-full "
            />
          )}
        </div>
        <div className="m-3">
          <div className="flex items-center gap-x-1">
            <AtSign className="w-5 h-5 mr-2" />
            <p className="text-muted-foreground font-medium text-xs">
              40 comments
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
