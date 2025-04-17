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
    <div className="max-w-[1000px] mx-auto flex flex-row gap-x-10 mt-4">
      <div className="w-[65%] flex flex-col gap-y-5">
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

      <div className="w-[35%]">
        <Card className="pt-1">
          <div className="relative">
            <Image
              src={Banner || "/placeholder.svg"}
              alt="Banner"
              className="w-full h-32 object-cover"
              width={400}
              height={128}
            />

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/40 to-transparent p-3">
              <div className="flex items-center">
                <Image
                  src={whisper || "/placeholder.svg"}
                  alt="Whisper logo"
                  className="w-10 h-10 rounded-full border-2 border-white"
                  width={40}
                  height={40}
                />
                <h1 className="font-medium pl-3 text-white">Home</h1>
              </div>
              <p className="text-sm text-white/80 mt-1">Your Own Drop Point</p>
            </div>
          </div>

          <div className="p-4">
            <Separator className="mb-4" />
            <p className="text-center text-sm text-muted-foreground mb-6">
              Whisper is a secure platform that allows users to zones where
              users can share thoughts, media, and engage in discussions.
            </p>

            <div className="flex flex-col gap-y-2">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/communities/create">Setup Zone</Link>
              </Button>

              <Button asChild className="w-full ">
                <Link href="/communities/VR_46/post">Drop Point</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
