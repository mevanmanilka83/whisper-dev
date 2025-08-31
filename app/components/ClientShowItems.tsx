"use client"

import { Card } from "@/components/ui/card"
import DropCard from "./DropCard"
import { useEffect, useState } from "react"
import SkeltonCard from "./SkeltonCard"
import Pagination from "./Pagination"
import { MessageSquare } from "lucide-react"

interface Post {
  id: string
  title: string
  textContent: string
  image: string | null
  subName: string
  createdAt: string
  boostCount: number
  commentCount?: number
  user?: {
    name?: string
    image?: string
  }
}

export default function ClientShowItems({ page }: { page: number }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Post[]>([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/zones/posts?page=${page}`)
        const result = await response.json()

        const posts = result.data || []
        
        // Fetch comment counts for all posts
        if (posts.length > 0) {
          const pointIds = posts.map((post: Post) => post.id)
          const commentCountsResponse = await fetch('/api/comments/counts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pointIds }),
          })
          
          if (commentCountsResponse.ok) {
            const commentCounts = await commentCountsResponse.json()
            posts.forEach((post: Post) => {
              post.commentCount = commentCounts[post.id] || 0
            })
          }
        }

        setData(posts)
        setCount(result.count || 0)
      } catch (error) {

      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page])

  if (loading) {
    return <SkeltonCard />
  }

  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)

  return (
    <>
      {data.length === 0 ? (
        <Card className="p-8 text-center border-none bg-muted/20 rounded-xl shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-3">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">No drops yet. Be the first to create one!</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-5">
            {data.map((post) => {
              let parsedContent = null
              if (post.textContent) {
                try {
                  parsedContent =
                    typeof post.textContent === "string" ? JSON.parse(post.textContent) : post.textContent
                } catch (e) {

                }
              }

              return (
                <DropCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  jsonContent={parsedContent}
                  image={post.image}
                  subName={post.subName}
                  createdAt={post.createdAt}
                  boostCount={post.boostCount}
                  commentCount={post.commentCount || 0}
                  userName={post.user?.name}
                  userImage={post.user?.image}
                />
              )
            })}
          </div>
          {data.length > 0 && totalPages > 1 && <Pagination totalPages={totalPages} />}
        </>
      )}
    </>
  )
} 