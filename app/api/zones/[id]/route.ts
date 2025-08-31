import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/utils/auth"
import { prisma } from "@/app/utils/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // First try to find the zone by name (for URL-friendly routing)
    let zone = await prisma.zone.findFirst({
      where: { name: id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        userId: true,
      },
    })

    // Fallback: if no zone found by name, try by ID (for backward compatibility)
    // Only try this if the id looks like a valid MongoDB ObjectID (24 hex characters)
    if (!zone && /^[0-9a-fA-F]{24}$/.test(id)) {
      zone = await prisma.zone.findUnique({
        where: { id: id },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          userId: true,
        },
      })
    }

    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 })
    }

    // Check if user is the zone owner
    if (zone.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json(zone)
  } catch (error) {

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 