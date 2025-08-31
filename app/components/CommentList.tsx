"use client"

import { useEffect, useState, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name?: string | null
    image?: string | null
  }
}

interface CommentListProps {
  pointId: string
  refreshTrigger?: number
}

export default function CommentList({ pointId, refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?pointId=${pointId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch {

    } finally {
      setLoading(false)
    }
  }, [pointId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments, refreshTrigger])

  // Listen for custom event to refresh comments
  useEffect(() => {
    const handleCommentAdded = () => {
      fetchComments()
    }

    window.addEventListener('commentAdded', handleCommentAdded)
    return () => window.removeEventListener('commentAdded', handleCommentAdded)
  }, [fetchComments])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-start space-x-2 animate-pulse">
            <div className="h-6 w-6 bg-muted rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-muted rounded w-1/4" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p className="text-xs">No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-2">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={comment.user.image || undefined} alt="User avatar" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium">
                {comment.user.name || "Anonymous"}
              </span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-2 w-2 mr-1" />
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </div>
            </div>
            
            <p className="text-xs text-foreground leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 