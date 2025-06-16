import { Skeleton } from "@/components/ui/skeleton";

export default function SkeltonCard() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="bg-card text-card-foreground flex flex-col gap-6 border py-6 overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-lg">
          <div className="p-4">
            {/* Header section with badge and user info */}
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Skeleton className="h-5 w-16 mr-2" /> {/* Badge */}
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 rounded-full mr-1" /> {/* Avatar */}
                <Skeleton className="h-4 w-16" /> {/* Username */}
              </div>
              <Skeleton className="h-4 w-24 ml-1.5" /> {/* Timestamp */}
            </div>

            {/* Title and content */}
            <div className="block group">
              <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
              <div className="text-content">
                <Skeleton className="h-20 w-full" /> {/* Content */}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center mt-3 gap-2">
              <div className="flex items-center">
                <Skeleton className="h-7 w-7 rounded-md" /> {/* Boost button */}
                <Skeleton className="h-4 w-4 mx-1" /> {/* Count */}
                <Skeleton className="h-7 w-7 rounded-md" /> {/* Reduce button */}
              </div>
              <div className="h-4 w-px bg-muted/50 mx-1" />
              <div className="flex items-center gap-x-5 ml-auto">
                <Skeleton className="h-7 w-24 rounded-md" /> {/* Comments button */}
                <Skeleton className="h-7 w-16 rounded-md" /> {/* Share button */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
