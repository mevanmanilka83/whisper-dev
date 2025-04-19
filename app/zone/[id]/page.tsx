import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/app/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ZoneDescriptionpage } from "@/app/components/ZoneDescription";
import CreateDropCard from "@/app/components/CreateDropCard";
import DropCard from "@/app/components/DropCard";
import { Suspense } from "react";
import SkeltonCard from "@/app/components/SkeltonCard";
import Pagination from "@/app/components/Pagination";

const ITEMS_PER_PAGE = 2;

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
      });

      if (userZone) {
        return userZone;
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
    });

    return publicZone;
  } catch (error) {
    console.error("Error fetching zone:", error);
    return null;
  }
}

async function getZoneDrops(zoneId: string, page: number = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

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
  ]);

  return { count, data };
}

async function updateDescription(formData: FormData) {
  "use server";

  const description = formData.get("description") as string;
  const zoneId = formData.get("zoneId") as string;

  if (!description || !zoneId) {
    return { error: "Missing required fields" };
  }

  try {
    await prisma.zone.update({
      where: { id: zoneId },
      data: { description },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update description:", error);
    return { error: "Failed to update description" };
  }
}

async function ShowZoneItems({
  zoneId,
  page,
}: {
  zoneId: string;
  page: number;
}) {
  const { count, data } = await getZoneDrops(zoneId, page);

  return (
    <>
      {data.length === 0 ? (
        <Card className="p-6 text-center border-none bg-muted/20">
          <p className="text-muted-foreground">
            No drops in this zone yet. Be the first to create one!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((point) => {
            let parsedContent = null;
            if (point.textContent) {
              try {
                parsedContent =
                  typeof point.textContent === "string"
                    ? JSON.parse(point.textContent)
                    : point.textContent;
              } catch (e) {
                console.error(
                  `Error parsing content for point ${point.id}:`,
                  e
                );
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
                    return boost.type === "Boost" ? acc + 1 : acc - 1;
                  }, 0)
                )}
              />
            );
          })}
        </div>
      )}
      <Pagination totalPages={Math.ceil(count / ITEMS_PER_PAGE)} />
    </>
  );
}

export default async function ZonePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const { id } = await params;
  const page = await searchParams.page;
  const currentPage = Number(page) || 1;
  const session = await auth();

  // Pass the user ID to getZoneData if available
  const zoneData = await getZoneData(id, session?.user?.id);

  if (!zoneData) {
    return redirect("/zone/setup");
  }

  const isOwner = session?.user?.id === zoneData.userId;

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          {session?.user?.id && <CreateDropCard zoneId={zoneData.id} />}

          <Suspense fallback={<SkeltonCard />}>
            <ShowZoneItems zoneId={zoneData.id} page={currentPage} />
          </Suspense>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-6">
            <Card className="overflow-hidden border-none shadow-sm rounded-lg">
              <div className="relative">
                <Image
                  src="/banner.jpg"
                  alt="Zone Banner"
                  className="w-full h-28 object-cover"
                  width={400}
                  height={112}
                  priority
                />

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="flex items-center">
                    <Image
                      src={`https://avatar.vercel.sh/${zoneData.name}/`}
                      alt={`${zoneData.name} avatar`}
                      className="w-8 h-8 rounded-full border border-white"
                      width={32}
                      height={32}
                    />
                    <h1 className="font-medium pl-2 text-white text-sm">
                      {zoneData.name}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
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

                <Separator className="my-3" />

                <p className="text-xs text-muted-foreground mb-4">
                  Created on{" "}
                  {zoneData.createdAt
                    ? new Date(zoneData.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </p>

                <div className="flex flex-col gap-y-2">
                  {isOwner && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-md border-muted hover:bg-muted/10 transition-colors h-9 text-sm"
                    >
                      <Link href={`/zone/${zoneData.name}/settings`}>
                        Manage Zone
                      </Link>
                    </Button>
                  )}

                  <Button
                    asChild
                    className="w-full rounded-md bg-primary hover:bg-primary/90 transition-colors h-9 text-sm"
                  >
                    <Link
                      href={
                        session?.user?.id
                          ? `/zone/${zoneData.name}/drops`
                          : "/api/auth/signin"
                      }
                      prefetch={false}
                    >
                      Generate New Drops
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
