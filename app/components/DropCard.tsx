import { Card } from "@/components/ui/card";
import { AtSign, Webhook, WebhookOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

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
  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl">
      <div className="flex">
        {/* Vote buttons column */}
        <div className="flex flex-col items-center justify-start gap-2 bg-gradient-to-b from-muted/50 to-background p-4 min-w-[70px] rounded-l-2xl">
          <form className="w-full flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors h-10 w-10 p-0"
            >
              <Webhook className="w-5 h-5" />
            </Button>
          </form>
          <span className="font-medium text-sm py-1">0</span>
          <form className="w-full flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors h-10 w-10 p-0"
            >
              <WebhookOff className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Content column */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link
              href={`/zone/${subName}`}
              className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              zone/{subName}
            </Link>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="inline-flex items-center">
                <span className="relative h-5 w-5 mr-1.5">
                  <Image
                    src="/whisper.jpg"
                    alt="User avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </span>
                <span className="hover:text-primary cursor-pointer font-medium transition-colors">
                  VR_46
                </span>
              </span>
              <span className="mx-1.5">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          <Link href={`/post/${id}`} className="block group">
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-3 leading-tight">
              {title}
            </h2>

            {jsonContent && (
              <div className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {typeof jsonContent === "string"
                  ? jsonContent
                  : JSON.stringify(jsonContent)}
              </div>
            )}

            {image && (
              <div className="mt-3 mb-3 rounded-xl overflow-hidden max-h-[400px] bg-muted/50">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={title}
                  width={600}
                  height={400}
                  className="w-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            )}
          </Link>

          <div className="flex items-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <AtSign className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">40 comments</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ml-2"
            >
              <span className="text-xs font-medium">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
