import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function ZoneSettingsSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-9 w-16 rounded-md" /> {/* Back button */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-32 rounded-md" /> {/* Zone name */}
            <Skeleton className="h-4 w-16" /> {/* Settings text */}
          </div>
        </div>
      </div>

      {/* Danger Zone Card Skeleton */}
      <Card className="border border-destructive/20 shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <Skeleton className="h-6 w-24" /> {/* Danger Zone title */}
          </div>
          <Skeleton className="h-4 w-48 mt-2" /> {/* Description */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Skeleton className="h-5 w-24 mb-2" /> {/* Delete Zone title */}
              <Skeleton className="h-4 w-80" /> {/* Description text */}
            </div>
            <Skeleton className="h-9 w-32 rounded-md" /> {/* Delete button */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 