import { prisma } from '@/app/utils/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Globe, Calendar, User } from 'lucide-react';

export default async function PublicProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params;
  
  const user = await prisma.user.findUnique({
    where: { profileId },
    select: {
      name: true,
      image: true,
      bio: true,
      website: true,
      location: true,
      createdAt: true,
    },
  });

  if (!user) return notFound();

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden p-0">
            <div className="relative">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/15 to-muted/20"></div>
              
              {/* Profile Image */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <Image
                    src={user.image || '/whisper.jpg'}
                    alt={user.name || 'User'}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-background shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
              </div>
            </div>
            
            <CardContent className="pt-16 pb-6 text-center">
              <CardTitle className="text-xl font-bold mb-2">{user.name || 'User'}</CardTitle>
              
              {user.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {user.bio}
                </p>
              )}
              
              <div className="space-y-3">
                {user.location && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.website && (
                  <div className="flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 'Recently'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Card */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Zones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Boosts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground">No recent activity yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">When {user.name || 'this user'} starts sharing, their activity will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 