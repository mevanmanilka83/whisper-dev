"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { createComment } from "@/app/actions/actions"

interface CommentFormProps {
  pointId: string
  onCommentAdded?: () => void
}

export default function CommentForm({ pointId, onCommentAdded }: CommentFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("CommentForm: handleSubmit called")
    console.log("Session:", session)
    
    if (!session?.user) {
      toast.error("Please sign in to comment")
      return
    }

    if (!content.trim()) {
      toast.error("Please enter a comment")
      return
    }

    console.log("CommentForm: Creating comment with content:", content.trim(), "pointId:", pointId)
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("content", content.trim())
      formData.append("pointId", pointId)

      console.log("CommentForm: Calling createComment action")
      const result = await createComment(formData)
      console.log("CommentForm: createComment result:", result)

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
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start space-x-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={session.user.image || undefined} alt="User avatar" />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            <User className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[60px] max-h-[120px] resize-none text-sm"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !content.trim()}
              className="px-3 h-8 text-xs"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
