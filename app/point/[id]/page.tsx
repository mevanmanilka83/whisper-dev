import { prisma } from "@/app/utils/db"
import PointSkeleton from "@/app/components/PointSkeleton"
import Render from "@/app/components/Render"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Rocket, Anchor, User, Clock, PlusCircle, MessageSquare } from "lucide-react"
import { handleBoost } from "@/app/actions/actions"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import CopyLink from "@/app/components/CopyLink"

async function getPoint(id: string) {
  const point = await prisma.point.findUnique({
    where: { id },
    select: {
      title: true,
      textContent: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      subName: true,
      zone: {
        select: {
          name: true,
          createdAt: true,
          description: true,
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      Boost: {
        select: {
          type: true,
        },
      },
    },
  })
  return point
}

function PointContent({ id }: { id: string }) {
  return (
    <Suspense fallback={<PointSkeleton />}>
      <PointData id={id} />
    </Suspense>
  )
}

async function PointData({ id }: { id: string }) {
  const point = await getPoint(id)
  
  if (!point) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Point not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl bg-background/80 backdrop-blur-sm">
              <div className="p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 ring-2 ring-border/20">
                      <AvatarImage src="/whisper.jpg" alt="User avatar" />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">
                        Posted by {point.user?.name || 'VR_46'}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {point.createdAt ? formatDistanceToNow(new Date(point.createdAt), { addSuffix: true }) : ""}
                      </div>
                    </div>
                  </div>
                  {point.subName && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 hover:bg-primary/15 text-primary border-primary/20 px-3 py-1 text-xs font-medium"
                    >
                      zone/{point.subName}
                    </Badge>
                  )}
                </div>

                {/* Content Section */}
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold leading-tight text-foreground">
                    {point.title}
                  </h1>

                  {point.image && (
                    <div className="mt-4 rounded-lg overflow-hidden bg-muted/20 shadow-sm">
                      <Image
                        src={point.image}
                        alt={point.title}
                        width={800}
                        height={600}
                        className="w-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="text-content prose prose-sm dark:prose-invert w-full overflow-hidden break-words">
                    {point.textContent && (
                      (() => {
                        try {
                          const content = typeof point.textContent === 'string' 
                            ? JSON.parse(point.textContent) 
                            : point.textContent;
                          return <Render data={content} />;
                        } catch {
                          return <p className="text-lg leading-relaxed">{String(point.textContent)}</p>;
                        }
                      })()
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Boost Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center bg-muted/30 rounded-lg p-1">
                      <form action={handleBoost} className="inline">
                        <input type="hidden" name="boostDirection" value="Boost" />
                        <input type="hidden" name="pointId" value={id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
                          title="Boost this point"
                          type="submit"
                        >
                          <Rocket className="w-4 h-4" />
                        </Button>
                      </form>

                      <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                        {point.Boost?.filter(boost => boost.type === 'Boost').length || 0}
                      </span>

                      <form action={handleBoost} className="inline">
                        <input type="hidden" name="boostDirection" value="Reduce" />
                        <input type="hidden" name="pointId" value={id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110"
                          title="Reduce this point"
                          type="submit"
                        >
                          <Anchor className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    {/* Comments */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 rounded-lg"
                      asChild
                    >
                      <Link href={`/point/${id}#comments`}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span className="text-sm">40 comments</span>
                      </Link>
                    </Button>
                  </div>

                  {/* Copy Link */}
                  <CopyLink id={id} />
                </div>
              </div>
            </Card>
          </div>

          {/* Zone Info Sidebar */}
          {point.zone && (
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Card className="bg-card text-card-foreground flex flex-col gap-1 border py-0 overflow-hidden border-none shadow-lg rounded-xl">
                  {/* About Zone Section */}
                  <div className="px-6 py-3 bg-muted/30">
                    <h3 className="font-semibold text-base mb-1">About Zone</h3>
                  </div>
                  
                  <div className="relative">
                    <Image
                      alt="Zone Banner"
                      width={400}
                      height={144}
                      className="w-full h-36 object-cover"
                      src="/banner.jpg"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          alt={`${point.zone.name} avatar`}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                          src={`https://avatar.vercel.sh/${point.zone.name}/`}
                        />
                        <div>
                          <h1 className="font-semibold text-white text-lg">{point.zone.name}</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Created {point.zone.createdAt ? new Date(point.zone.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : ''}
                      </p>
                    </div>
                    <div className="mb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Welcome to the {point.zone.name} zone feel free to drop thoughts
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Button asChild className="w-full rounded-lg bg-primary hover:bg-primary/90 transition-colors h-11 text-sm font-medium shadow-sm">
                        <Link href={`/zone/${point.zone.name}/drops`}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create New Drop
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <PointContent id={id} />
}
