import { prisma } from '@/app/utils/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    },
  });

  if (!user) return notFound();

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="overflow-hidden border shadow-sm rounded-xl">
        <CardHeader className="flex flex-col items-center gap-2 bg-gradient-to-br from-primary/20 to-primary/5">
          <Image
            src={user.image || '/whisper.jpg'}
            alt={user.name || 'User'}
            width={96}
            height={96}
            className="rounded-full border-4 border-background shadow-lg"
          />
          <CardTitle className="text-2xl font-bold text-center">{user.name || 'User'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
          {user.location && <p className="text-sm text-muted-foreground">📍 {user.location}</p>}
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              {user.website}
            </a>
          )}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Shared Content</h3>
            <p className="text-muted-foreground text-sm">This is where public/shared content will appear.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 