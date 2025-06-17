import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function ZoneSetupSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg mb-4">
            <Plus className="h-6 w-6 text-primary-foreground" />
          </div>
          <Skeleton className="h-9 w-64 mx-auto" /> {/* Title */}
          <Skeleton className="h-6 w-48 mx-auto" /> {/* Description */}
        </div>

        {/* Form Card Skeleton */}
        <Card className="border shadow-xl bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <Skeleton className="h-6 w-32 mb-2" /> {/* Card Title */}
            <Skeleton className="h-4 w-48" /> {/* Card Description */}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-20" /> {/* Label */}
                <Skeleton className="h-12 w-full" /> {/* Input field */}
                <Skeleton className="h-4 w-80" /> {/* Helper text */}
              </div>

              <div className="h-px bg-border" /> {/* Separator */}

              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-11 w-24" /> {/* Cancel button */}
                <Skeleton className="h-11 w-32" /> {/* Submit button */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 