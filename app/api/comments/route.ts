import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/utils/auth"
import { prisma } from "@/app/utils/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pointId = searchParams.get("pointId")

    if (!pointId) {
      return NextResponse.json({ error: "Point ID is required" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: {
        pointId: pointId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, pointId } = await request.json()

    if (!content || !pointId) {
      return NextResponse.json({ error: "Content and point ID are required" }, { status: 400 })
    }

    if (content.trim().length === 0) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 })
    }

    // Verify the point exists
    const point = await prisma.point.findUnique({
      where: { id: pointId },
    })

    if (!point) {
      return NextResponse.json({ error: "Point not found" }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        pointId: pointId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
} 