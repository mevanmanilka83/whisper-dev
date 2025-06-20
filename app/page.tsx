import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CreateDropCard from "./components/CreateDropCard"
import { Suspense } from "react"
import SkeltonCard from "./components/SkeltonCard"
import { PlusCircle, MessageSquare, Clock } from "lucide-react"
import ClientShowItems from "./components/ClientShowItems"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Always show CreateDropCard, even if not signed in */}
          <CreateDropCard />

          <Suspense fallback={<SkeltonCard />}>
            <ClientShowItems page={currentPage} />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            {/* Platform Info */}
            <Card className="bg-card text-card-foreground flex flex-col gap-1 border py-0 overflow-hidden border-none shadow-lg rounded-xl">
              <div className="relative">
                <Image
                  alt="Banner"
                  width={400}
                  height={144}
                  className="w-full h-36 object-cover"
                  src="/banner.jpg"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      alt="Whisper logo"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      src="/whisper.jpg"
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
                    <Link href="/zone/setup">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Setup Zone
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="w-full rounded-lg bg-primary hover:bg-primary/90 transition-colors h-11 text-sm font-medium shadow-sm"
                  >
                    <Link href="/zone/setup">
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
