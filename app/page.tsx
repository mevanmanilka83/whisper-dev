"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CreateDropCard from "./components/CreateDropCard"
import DropCard from "./components/DropCard"
import { useEffect, useState } from "react"
import SkeltonCard from "./components/SkeltonCard"
import Pagination from "./components/Pagination"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle, MessageSquare, Clock } from "lucide-react"

interface Post {
  id: string
  title: string
  textContent: string
  image: string | null
  subName: string
  createdAt: string
  boostCount: number
}

// We'll create a new client-side ShowItems component
const ClientShowItems = ({ page }: { page: number }) => {
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
              <Link href="/communities/VR_46/post">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Drop
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((point) => {
            let parsedContent = null
            if (point.textContent) {
              try {
                parsedContent =
                  typeof point.textContent === "string" ? JSON.parse(point.textContent) : point.textContent
              } catch (e) {
                console.error(`Error parsing content for point ${point.id}:`, e)
              }
            }

            return (
              <DropCard
                key={point.id}
                id={point.id}
                title={point.title}
                jsonContent={parsedContent}
                image={point.image}
                subName={point.subName}
                createdAt={point.createdAt}
                boostCount={point.boostCount}
              />
            )
          })}
        </div>
      )}
      <Pagination totalPages={Math.ceil(count / ITEMS_PER_PAGE)} />
    </>
  )
}

// Skeleton component for the sidebar
const SidebarSkeleton = () => {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 border py-6 overflow-hidden border-none shadow-sm rounded-xl">
      <div className="relative">
        <Skeleton className="w-full h-32 object-cover" />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center">
            <Skeleton className="w-10 h-10 rounded-full border-2 border-white" />
            <Skeleton className="h-5 w-20 ml-3 bg-white/20" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <Separator className="my-4" />
        <Skeleton className="w-3/4 h-5 mx-auto mb-5" />
        <div className="flex flex-col gap-y-3">
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const currentPage = Number(pageParam) || 1
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="w-full h-[200px] rounded-xl" /> {/* CreateDropCard skeleton */}
            <SkeltonCard />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <CreateDropCard />
          <ClientShowItems page={currentPage} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <Card className="bg-card text-card-foreground flex flex-col gap-1 border py-0 overflow-hidden border-none shadow-lg rounded-xl">
              <div className="relative">
                <Image
                  src="/banner.jpg"
                  alt="Banner"
                  className="w-full h-36 object-cover"
                  width={400}
                  height={144}
                  priority
                />

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/whisper.jpg"
                      alt="Whisper logo"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      width={40}
                      height={40}
                    />
                    <div>
                      <h1 className="font-semibold text-white text-lg">Home</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Whisper Platform
                  </p>
                </div>
                <div className="mb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Whisper is a secure platform for sharing thoughts and engaging in discussions.
                  </p>
                </div>
                <div className="flex flex-col gap-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-lg border-muted hover:bg-muted/10 transition-colors h-11 text-sm font-medium"
                  >
                    <Link href="/communities/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Setup Zone
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="w-full rounded-lg bg-primary hover:bg-primary/90 transition-colors h-11 text-sm font-medium shadow-sm"
                  >
                    <Link href="/communities/VR_46/post">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Drop Point
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
