import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignInSkeleton() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card className="border shadow-lg">
        <CardHeader className="text-center pb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-2" /> {/* Title */}
          <Skeleton className="h-5 w-64 mx-auto" /> {/* Description */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GitHub button skeleton */}
          <Skeleton className="h-12 w-full" />
          
          {/* Divider skeleton */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          {/* Google button skeleton */}
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      {/* Terms and Privacy links skeleton */}
      <div className="text-center text-sm text-muted-foreground mt-6">
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>
    </div>
  );
} 