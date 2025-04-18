import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateDropCard from "./components/CreateDropCard";
import { prisma } from "./utils/db";
import DropCard from "./components/DropCard";

async function getData() {
  const data = await prisma.point.findMany({
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
  });
  return data;
}

export default async function Home() {
  const data = await getData();
  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <CreateDropCard />

          {data.length === 0 ? (
            <Card className="p-6 text-center border-none bg-muted/20">
              <p className="text-muted-foreground">
                No drops yet. Be the first to create one!
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {data.map((point) => (
                <DropCard
                  key={point.id}
                  id={point.id}
                  title={point.title}
                  jsonContent={point.textContent}
                  image={point.image}
                  subName={point.subName}
                  createdAt={point.createdAt}
                  boostCount={Math.max(
                    0,
                    point.Boost.reduce((acc, boost) => {
                      if (boost.type === "Boost") {
                        return acc + 1;
                      } else if (boost.type === "Reduce") {
                        return acc - 1;
                      }
                      return acc;
                    }, 0)
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-6">
            <Card className="overflow-hidden border-none shadow-sm rounded-lg">
              <div className="relative">
                <Image
                  src="/banner.jpg"
                  alt="Banner"
                  className="w-full h-28 object-cover"
                  width={400}
                  height={112}
                  priority
                />

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="flex items-center">
                    <Image
                      src="/whisper.jpg"
                      alt="Whisper logo"
                      className="w-8 h-8 rounded-full border border-white"
                      width={32}
                      height={32}
                    />
                    <h1 className="font-medium pl-2 text-white text-sm">
                      Home
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground mb-4 text-center">
                  Whisper is a secure platform for sharing thoughts and engaging
                  in discussions.
                </p>

                <div className="flex flex-col gap-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-md border-muted hover:bg-muted/10 transition-colors h-9 text-sm"
                  >
                    <Link href="/communities/create">Setup Zone</Link>
                  </Button>

                  <Button
                    asChild
                    className="w-full rounded-md bg-primary hover:bg-primary/90 transition-colors h-9 text-sm"
                  >
                    <Link href="/communities/VR_46/post">Drop Point</Link>
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
