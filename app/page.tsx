import { Card } from "@/components/ui/card";
import Image from "next/image";
import Banner from "@/public/banner.jpg";
import whisper from "@/public/whisper.jpg";
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
    <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row gap-5 p-4">
      <div className="w-full md:w-[65%] flex flex-col gap-5">
        <CreateDropCard />
        {data.map((point) => (
          <DropCard
            key={point.id}
            id={point.id}
            title={point.title}
            jsonContent={point.textContent}
            image={point.image}
            subName={point.subName}
            createdAt={point.createdAt}
          />
        ))}
      </div>

      <div className="w-full md:w-[35%] sticky top-4 h-fit">
        <Card className="overflow-hidden border-none shadow-md rounded-2xl">
          <div className="relative">
            <Image
              src={Banner || "/placeholder.svg?height=128&width=400"}
              alt="Banner"
              className="w-full h-32 object-cover"
              width={400}
              height={128}
            />

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="flex items-center">
                <Image
                  src={whisper || "/placeholder.svg?height=40&width=40"}
                  alt="Whisper logo"
                  className="w-10 h-10 rounded-full border-2 border-white"
                  width={40}
                  height={40}
                />
                <h1 className="font-medium pl-3 text-white">Home</h1>
              </div>
              <p className="text-sm text-white/90 mt-1">Your Own Drop Point</p>
            </div>
          </div>

          <div className="p-5">
            <Separator className="mb-5" />
            <p className="text-center text-sm text-muted-foreground mb-6">
              Whisper is a secure platform that allows users to create zones
              where users can share thoughts, media, and engage in discussions.
            </p>

            <div className="flex flex-col gap-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <Link href="/communities/create">Setup Zone</Link>
              </Button>

              <Button
                asChild
                className="w-full rounded-full bg-primary hover:bg-primary/90 transition-colors"
              >
                <Link href="/communities/VR_46/post">Drop Point</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
