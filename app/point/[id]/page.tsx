import { prisma } from "@/app/utils/db"
import PointSkeleton from "@/app/components/PointSkeleton"
import { Suspense } from "react"

async function getPoint(id: string) {
  const point = await prisma.point.findUnique({
    where: { id },
    select: {
      title: true,
      textContent: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      subName: true,
      zone: {
        select: {
          name: true,
          
          createdAt: true,
       
          description: true,
        },
     
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })
  return point
}

function PointContent({ id }: { id: string }) {
  return (
    <Suspense fallback={<PointSkeleton />}>
      <PointData id={id} />
    </Suspense>
  )
}

async function PointData({ id }: { id: string }) {
  const point = await getPoint(id)
  
  if (!point) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Point not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{point.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            {point.user && (
              <div className="flex items-center gap-2">
                <span>By {point.user.name}</span>
              </div>
            )}
            <span>Created {new Date(point.createdAt).toLocaleDateString()}</span>
            {point.zone && (
              <span>in {point.zone.name}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {point.textContent && (
            <div className="prose prose-lg max-w-none">
              {(() => {
                try {
                  const content = typeof point.textContent === 'string' 
                    ? JSON.parse(point.textContent) 
                    : point.textContent;
                  
                  // Extract text from the JSON structure
                  const extractText = (node: unknown): string => {
                    if (typeof node === 'string') return node;
                    if (node && typeof node === 'object' && 'text' in node) {
                      return String((node as { text: string }).text);
                    }
                    if (node && typeof node === 'object' && 'content' in node && Array.isArray((node as { content: unknown[] }).content)) {
                      return (node as { content: unknown[] }).content.map(extractText).join(' ');
                    }
                    return '';
                  };
                  
                  const text = extractText(content);
                  return <p className="text-lg leading-relaxed">{text}</p>;
                } catch {
                  return <p className="text-lg leading-relaxed">{String(point.textContent)}</p>;
                }
              })()}
            </div>
          )}
          
          {point.image && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={point.image} 
                alt={point.title}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <PointContent id={id} />
}
