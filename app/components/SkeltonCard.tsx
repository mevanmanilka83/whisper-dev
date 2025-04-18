import { Skeleton } from "@/components/ui/skeleton";

export default function SkeltonCard() {
  return (
    <div>
      <Skeleton className="w-full h-[400px]" />
      <Skeleton className="w-full h-[400px]" />
      <Skeleton className="w-full h-[400px]" />
      <Skeleton className="w-full h-[400px]" />
      <Skeleton className="w-full h-[400px]" />
    </div>
  );
}
