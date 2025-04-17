import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/app/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ZoneDescriptionpage } from "@/app/components/ZoneDescription";

async function getData(id: string, userId?: string) {
  try {
    // First try to find the zone with exact user match if userId is provided
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

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const session = await auth();

  // Pass the user ID to getData if available
  const data = await getData(id, session?.user?.id);

  if (!data) {
    // Try again without user ID constraint to show public zones
    const publicData = await getData(id);

    if (!publicData) {
      return redirect("/zone/setup");
    }

    return (
      <div className="container mx-auto px-4 py-6 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
          <div className="space-y-6">
            <Card className="w-full overflow-hidden shadow-sm bg-background/10">
              <CardHeader className="flex flex-row items-center justify-between pb-4 pt-0">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Zone Drops
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <div className="text-muted-foreground text-center py-8 bg-background/50 rounded-md border border-dashed">
                  No drops available for this zone yet.
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="w-full overflow-hidden shadow-sm bg-background/10">
              <div className="py-2 px-4 rounded-t-lg">
                <h2 className="text-lg font-semibold text-foreground">
                  Buffer Zone
                </h2>
              </div>
              <CardContent className="px-4 pt-4 pb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={`https://avatar.vercel.sh/${publicData.name}/`}
                    alt={`${publicData.name} zone avatar`}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-muted-foreground/20 shadow-sm"
                  />
                  <Link
                    href={`/zone/${publicData.name}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {publicData.name}
                  </Link>
                </div>

                <div className="mb-4">
                  {session?.user?.id === publicData.userId ? (
                    <ZoneDescriptionpage
                      zoneId={publicData.id}
                      description={publicData.description || ""}
                      updateDescription={updateDescription}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {publicData.description || "No description available."}
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="text-sm text-muted-foreground mb-4">
                  <p>
                    Created on{" "}
                    {publicData.createdAt
                      ? new Date(publicData.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "Unknown date"}
                  </p>
                </div>
              </CardContent>
              <div className="px-4 py-4">
                <Button
                  asChild
                  className="w-full rounded-full bg-primary hover:bg-primary/90 transition-colors font-medium shadow-sm"
                  size="lg"
                >
                  <Link
                    href={
                      session?.user?.id
                        ? `/zone/${publicData.name}/drops`
                        : "/api/auth/signin"
                    }
                    prefetch={false} // Disable prefetch to ensure fresh data
                  >
                    Enter Zone
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1200px]">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
        <div className="space-y-6">
          <Card className="w-full overflow-hidden shadow-sm bg-background/10">
            <CardHeader className="flex flex-row items-center justify-between  pb-4 pt-0">
              <CardTitle className="text-2xl font-bold text-foreground">
                Zone Drops
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="text-muted-foreground text-center py-8 bg-background/50 rounded-md border border-dashed">
                No drops available for this zone yet.
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="w-full overflow-hidden shadow-sm bg-background/10">
            <div className="py-2 px-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-foreground">
                Buffer Zone
              </h2>
            </div>
            <CardContent className="px-4 pt-4 pb-0">
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={`https://avatar.vercel.sh/${data.name}/`}
                  alt={`${data.name} zone avatar`}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-muted-foreground/20 shadow-sm"
                />
                <Link
                  href={`/zone/${data.name}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {data.name}
                </Link>
              </div>

              <div className="mb-4">
                {session?.user?.id === data.userId ? (
                  <ZoneDescriptionpage
                    zoneId={data.id}
                    description={data.description || ""}
                    updateDescription={updateDescription}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.description || "No description available."}
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="text-sm text-muted-foreground mb-4">
                <p>
                  Created on{" "}
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </p>
              </div>
            </CardContent>
            <div className="px-4 py-4">
              <Button
                asChild
                className="w-full rounded-full bg-primary hover:bg-primary/90 transition-colors font-medium shadow-sm"
                size="lg"
              >
                <Link
                  href={
                    session?.user?.id
                      ? `/zone/${data.name}/drops`
                      : "/api/auth/signin"
                  }
                  prefetch={false} // Disable prefetch to ensure fresh data
                >
                  Enter Zone
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
