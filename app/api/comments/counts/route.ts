import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/utils/db"

export async function POST(request: NextRequest) {
  try {
    const { pointIds } = await request.json()

    if (!pointIds || !Array.isArray(pointIds)) {
      return NextResponse.json({ error: "Point IDs array is required" }, { status: 400 })
    }

    const commentCounts = await prisma.comment.groupBy({
      by: ['pointId'],
      where: {
        pointId: {
          in: pointIds,
        },
      },
      _count: {
        pointId: true,
      },
    })

    const countMap: Record<string, number> = {}
    pointIds.forEach(id => {
      countMap[id] = 0
    })

    commentCounts.forEach(count => {
      countMap[count.pointId] = count._count.pointId
    })

    return NextResponse.json(countMap)
  } catch (error) {

    return NextResponse.json({ error: "Failed to get comment counts" }, { status: 500 })
  }
} 