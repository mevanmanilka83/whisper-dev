import { prisma } from "@/app/utils/db"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/app/utils/auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ZoneDescriptionpage } from "@/app/components/ZoneDescription"
import CreateDropCard from "@/app/components/CreateDropCard"
import DropCard from "@/app/components/DropCard"
import { Suspense } from "react"
import SkeltonCard from "@/app/components/SkeltonCard"
import Pagination from "@/app/components/Pagination"
import { Settings, Plus, MessageSquare, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ITEMS_PER_PAGE = 2

async function getZoneData(id: string, userId?: string) {
  try {
    if (userId) {
      const userZone = await prisma.zone.findFirst({
        where: {
          name: id,
          userId: userId,
        },
        select: {
          name: true,
          createdAt: true,
          description: true,
          id: true,
          userId: true,
        },
      })

      if (userZone) {
        return userZone
      }
    }

    // If no user-specific zone found, look for any zone with this name
    const publicZone = await prisma.zone.findFirst({
      where: {
        name: id,
      },
      select: {
        name: true,
        createdAt: true,
        description: true,
        id: true,
        userId: true,
      },
    })

    return publicZone
  } catch (error) {
    console.error("Error fetching zone:", error)
    return null
  }
}

async function getZoneDrops(zoneId: string, page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE

  const [count, data] = await prisma.$transaction([
    prisma.point.count({
      where: {
        zoneId: zoneId,
      },
    }),
    prisma.point.findMany({
      where: {
        zoneId: zoneId,
      },
      take: ITEMS_PER_PAGE,
      skip: skip,
      select: {
        title: true,
        createdAt: true,
        id: true,
        textContent: true,
        image: true,
        Boost: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        subName: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

  return { count, data }
}

async function updateDescription(formData: FormData) {
  "use server"

  const description = formData.get("description") as string
  const zoneId = formData.get("zoneId") as string

  if (!description || !zoneId) {
    return { error: "Missing required fields" }
  }

  try {
    await prisma.zone.update({
      where: { id: zoneId },
      data: { description },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to update description:", error)
    return { error: "Failed to update description" }
  }
}

async function ShowZoneItems({ zoneId, page }: { zoneId: string; page: number }) {
  const { count, data } = await getZoneDrops(zoneId, page)

  return (
    <>
      {data.length === 0 ? (
        <Card className="p-8 text-center border-none bg-muted/20 rounded-xl shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
            <div className="space-y-2">
              <p className="text-muted-foreground font-medium">No drops in this zone yet</p>
              <p className="text-sm text-muted-foreground">Be the first to create one!</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
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
                boostCount={Math.max(
                  0,
                  point.Boost.reduce((acc, boost) => {
                    return boost.type === "Boost" ? acc + 1 : acc - 1
                  }, 0),
                )}
              />
            )
          })}
        </div>
      )}
      <Pagination totalPages={Math.ceil(count / ITEMS_PER_PAGE)} />
    </>
  )
}

export default async function ZonePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { page?: string }
}) {
  const { id } = await params
  const page = await searchParams.page
  const currentPage = Number(page) || 1
  const session = await auth()

  // Pass the user ID to getZoneData if available
  const zoneData = await getZoneData(id, session?.user?.id)

  if (!zoneData) {
    return redirect("/zone/setup")
  }

  const isOwner = session?.user?.id === zoneData.userId

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {session?.user?.id && <CreateDropCard zoneId={zoneData.id} />}

          <Suspense fallback={<SkeltonCard />}>
            <ShowZoneItems zoneId={zoneData.id} page={currentPage} />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="overflow-hidden border-none shadow-lg rounded-xl">
              <div className="relative">
                <Image
                  src="/banner.jpg"
                  alt="Zone Banner"
                  className="w-full h-36 object-cover"
                  width={400}
                  height={144}
                  priority
                />

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={`https://avatar.vercel.sh/${zoneData.name}/`}
                      alt={`${zoneData.name} avatar`}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      width={40}
                      height={40}
                    />
                    <div>
                      <h1 className="font-semibold text-white text-lg">{zoneData.name}</h1>
                      {isOwner && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Owner
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-5">
                  {isOwner ? (
                    <ZoneDescriptionpage
                      zoneId={zoneData.id}
                      description={zoneData.description || ""}
                      updateDescription={updateDescription}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {zoneData.description || "No description available."}
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center space-x-2 mb-5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Created{" "}
                    {zoneData.createdAt
                      ? new Date(zoneData.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Unknown date"}
                  </p>
                </div>

                <div className="flex flex-col gap-y-3">
                  {isOwner && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-lg border-2 hover:bg-muted/10 transition-colors h-11 text-sm font-medium"
                    >
                      <Link href={`/zone/${zoneData.name}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Zone
                      </Link>
                    </Button>
                  )}

                  <Button
                    asChild
                    className="w-full rounded-lg bg-primary hover:bg-primary/90 transition-colors h-11 text-sm font-medium shadow-sm"
                  >
                    <Link
                      href={session?.user?.id ? `/zone/${zoneData.name}/drops` : "/api/auth/signin"}
                      prefetch={false}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Drop
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
