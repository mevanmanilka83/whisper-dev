"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateDropCard from "./components/CreateDropCard";
import DropCard from "./components/DropCard";
import { useEffect, useState } from "react";
import SkeltonCard from "./components/SkeltonCard";
import Pagination from "./components/Pagination";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  textContent: string;
  image: string | null;
  subName: string;
  createdAt: string;
  boostCount: number;
}

// We'll create a new client-side ShowItems component
const ClientShowItems = ({ page }: { page: number }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Post[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/zones/posts?page=${page}`);
        const result = await response.json();

        setData(result.data || []);
        setCount(result.count || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  if (loading) {
    return <SkeltonCard />;
  }

  const ITEMS_PER_PAGE = 5;

  return (
    <>
      {data.length === 0 ? (
        <Card className="p-6 text-center border-none bg-muted/20">
          <p className="text-muted-foreground">
            No drops yet. Be the first to create one!
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
                boostCount={point.boostCount}
              />
            );
          })}
        </div>
      )}
      <Pagination totalPages={Math.ceil(count / ITEMS_PER_PAGE)} />
    </>
  );
};

// Skeleton component for the sidebar
const SidebarSkeleton = () => {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 border py-6 overflow-hidden border-none shadow-sm rounded-lg">
      <div className="relative">
        <Skeleton className="w-full h-28 object-cover" />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center">
            <Skeleton className="w-8 h-8 rounded-full border border-white" />
            <Skeleton className="h-4 w-16 ml-2 bg-white/20" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <Separator className="my-3" />
        <Skeleton className="w-3/4 h-4 mx-auto mb-4" />
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-9 rounded-md" />
          <Skeleton className="w-full h-9 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = Number(pageParam) || 1;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="w-full h-[200px] rounded-lg" /> {/* CreateDropCard skeleton */}
            <SkeltonCard />
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <CreateDropCard />
          <ClientShowItems page={currentPage} />
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
