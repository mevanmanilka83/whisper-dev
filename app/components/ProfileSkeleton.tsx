import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfileSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Skeleton */}
          <Card className="border shadow-sm rounded-xl overflow-hidden p-0">
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="absolute bottom-4 left-6">
                <div className="flex items-end space-x-4">
                  <div className="relative">
                    <Skeleton className="h-24 w-24 rounded-full ring-4 ring-background shadow-lg" />
                  </div>
                  <div className="mb-2 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Content Skeleton */}
          <div className="space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="about" disabled>About</TabsTrigger>
                <TabsTrigger value="activity" disabled>Activity</TabsTrigger>
                <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card className="border shadow-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-48" />
                    </CardTitle>
                    <Skeleton className="h-4 w-80" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="border shadow-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-40" />
                    </CardTitle>
                    <Skeleton className="h-4 w-72" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-5 w-5" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="border shadow-sm rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-44" />
                    </CardTitle>
                    <Skeleton className="h-4 w-80" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistics Card Skeleton */}
          <Card className="border shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="text-center p-3 bg-primary/10 rounded-lg">
                    <Skeleton className="h-8 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Zones Card Skeleton */}
          <Card className="border shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 