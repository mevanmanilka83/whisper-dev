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
import ZoneMembership from "@/app/components/ZoneMembership"
import { Suspense } from "react"
import SkeltonCard from "@/app/components/SkeltonCard"
import PaginationComponent from "@/app/components/Pagination"
import { Settings, Plus, MessageSquare, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ZoneInvitations from "@/app/components/ZoneInvitations"
import CopyLink from "@/app/components/CopyLink"

const ITEMS_PER_PAGE = 2

async function getZoneData(id: string) {
  try {
    // First try to find zone by name (for URL-friendly routing)
    let zone = await prisma.zone.findFirst({
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

    if (zone) {
      return zone
    }

    // If no zone found by name, try by ID (for backward compatibility with existing links)
    // Only try this if the id looks like a valid MongoDB ObjectID (24 hex characters)
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      zone = await prisma.zone.findUnique({
        where: {
          id: id,
        },
        select: {
          name: true,
          createdAt: true,
          description: true,
          id: true,
          userId: true,
        },
      })

      if (zone) {
        return zone
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching zone:", error)
    return null
  }
}

async function checkZoneMembership(zoneId: string, userId: string) {
  try {
    // Check if user is the zone owner
    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
      select: { userId: true }
    })

    if (zone?.userId === userId) {
      return true // Zone owners are automatically members
    }

    // Check if user is a member
    const membership = await prisma.zoneMember.findUnique({
      where: {
        userId_zoneId: {
          userId: userId,
          zoneId: zoneId,
        },
      },
    })

    return !!membership
  } catch (error) {
    console.error("Error checking zone membership:", error)
    return false
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
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)

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
        <>
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
          {data.length > 0 && totalPages > 1 && <PaginationComponent totalPages={totalPages} />}
        </>
      )}
    </>
  )
}

export default async function ZonePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page
  const currentPage = Number(page) || 1
  const session = await auth()

  // Pass the user ID to getZoneData if available
  const zoneData = await getZoneData(id)

  if (!zoneData) {
    return redirect("/zone/setup")
  }

  const isOwner = session?.user?.id === zoneData.userId
  const isMember = session?.user?.id ? await checkZoneMembership(zoneData.id, session.user.id) : false

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Zone Membership Component */}
          <ZoneMembership zoneName={zoneData.name} />

          {/* Collaboration Invitations for Zone Owners */}
          {isOwner && <ZoneInvitations zoneName={zoneData.name} isOwner={isOwner} />}

          {/* Show CreateDropCard for zone owners and members */}
          {isMember && session?.user?.id && <CreateDropCard zoneId={zoneData.id} />}

          <Suspense fallback={<SkeltonCard />}>
            <ShowZoneItems zoneId={zoneData.id} page={currentPage} />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="bg-card text-card-foreground flex flex-col gap-1 border py-0 overflow-hidden border-none shadow-lg rounded-xl">
              <div className="relative">
                <Image
                  alt="Zone Banner"
                  width={400}
                  height={144}
                  className="w-full h-36 object-cover"
                  src="/banner.jpg"
                  priority
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between">
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
                    <CopyLink 
                      url={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/zone/${zoneData.name}`}
                      label="Share"
                      variant="outline"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/40 hover:border-white/60 shadow-lg backdrop-blur-sm"
                    />
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
