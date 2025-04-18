"use client";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { toast } from "sonner";
export default function CopyLink({ id }: { id: string }) {
  async function copyToClipboard() {
    await navigator.clipboard.writeText(`${window.location.origin}/drop/${id}`);
    toast.success("Link copied to clipboard!", {
      description: "You can now share this link with others.",
    });
  }
  return (
    <div>
      <Button
        onClick={copyToClipboard}
        variant="ghost"
        size="sm"
        className="h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors px-2 ml-auto"
      >
        <Share className="w-3.5 h-3.5" />
        <span className="text-xs"> Share</span>
      </Button>
    </div>
  );
}
