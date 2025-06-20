"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DropCard from "./DropCard"
import { useEffect, useState } from "react"
import SkeltonCard from "./SkeltonCard"
import Pagination from "./Pagination"
import { PlusCircle, MessageSquare } from "lucide-react"

interface Post {
  id: string
  title: string
  textContent: string
  image: string | null
  subName: string
  createdAt: string
  boostCount: number
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

        setData(result.data || [])
        setCount(result.count || 0)
      } catch (error) {
        console.error("Error fetching data:", error)
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

  return (
    <>
      {data.length === 0 ? (
        <Card className="p-8 text-center border-none bg-muted/20 rounded-xl shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-3">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">No drops yet. Be the first to create one!</p>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/zone/setup">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Drop
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {data.map((post) => {
            let parsedContent = null
            if (post.textContent) {
              try {
                parsedContent =
                  typeof post.textContent === "string" ? JSON.parse(post.textContent) : post.textContent
              } catch (e) {
                console.error(`Error parsing content for post ${post.id}:`, e)
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
                userName={post.user?.name}
                userImage={post.user?.image}
              />
            )
          })}
        </div>
      )}
      <Pagination totalPages={Math.ceil(count / ITEMS_PER_PAGE)} />
    </>
  )
} 