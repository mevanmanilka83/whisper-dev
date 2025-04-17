"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { JSONContent } from "@tiptap/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "next/image";
import { User } from "lucide-react";

interface PointViewerProps {
  point: {
    id: string;
    title: string;
    textContent: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
    zone: {
      id: string;
      name: string;
    } | null;
    subName: string | null;
  };
}

export default function PointViewer({ point }: PointViewerProps) {
  // Parse the JSON content if it exists
  let jsonContent: JSONContent | null = null;
  try {
    if (point.textContent) {
      jsonContent = JSON.parse(point.textContent);
    }
  } catch (e) {
    console.error("Error parsing point content:", e);
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: jsonContent,
    editable: false,
  });

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={point.user?.image || undefined}
                alt={point.user?.name || "User"}
              />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {point.user?.name || "Anonymous"}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(point.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
          {point.zone && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {point.zone.name}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-3 text-xl">{point.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        {point.image && (
          <div className="mb-4 overflow-hidden rounded-md">
            <Image
              src={point.image || "/placeholder.svg"}
              alt={point.title}
              width={800}
              height={400}
              className="w-full object-cover"
            />
          </div>
        )}

        {editor ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <EditorContent editor={editor} />
          </div>
        ) : (
          <div className="text-muted-foreground italic">
            No content available
          </div>
        )}

        {point.subName && (
          <div className="mt-4 flex items-center">
            <Badge variant="secondary" className="text-xs">
              {point.subName}
            </Badge>
          </div>
        )}
      </CardContent>
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin: 0.75rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin: 0.75rem 0;
        }
        .ProseMirror li {
          margin-bottom: 0.375rem;
        }
        .ProseMirror p {
          margin: 0.75rem 0;
          line-height: 1.6;
        }
      `}</style>
    </Card>
  );
}
