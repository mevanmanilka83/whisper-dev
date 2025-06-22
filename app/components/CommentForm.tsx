"use client"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { createComment } from "@/app/actions/actions"
import SubmitButton from "./SubmitButton"

interface CommentFormProps {
  pointId: string
  onCommentAdded?: () => void
}

export default function CommentForm({ pointId, onCommentAdded }: CommentFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const result = await createComment(formData)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    if (result.success) {
      setContent("")
      toast.success(result.message || "Comment added successfully!")
      onCommentAdded?.()
      // Dispatch custom event to refresh comments
      window.dispatchEvent(new CustomEvent('commentAdded'))
    }
  }

  if (!session?.user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Please sign in to add a comment</p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="pointId" value={pointId} />
      
      <div className="flex items-start space-x-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={session.user.image || undefined} alt="User avatar" />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            <User className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[60px] max-h-[120px] resize-none text-sm"
            required
          />
          
          <div className="flex justify-end">
            <SubmitButton
              text="Post"
              loadingText="Posting..."
              size="sm"
              width="w-auto"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
