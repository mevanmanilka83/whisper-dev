import { Skeleton } from "@/components/ui/skeleton"

export default function PointSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-3/4 mb-2" /> {/* Title */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" /> {/* Author */}
            <Skeleton className="h-4 w-32" /> {/* Date */}
            <Skeleton className="h-4 w-20" /> {/* Zone */}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {/* Text Content */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          
          {/* Image Placeholder */}
          <div className="rounded-lg overflow-hidden">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
} 