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
      return NextResponse.json({ isMember: false, error: "Not authenticated" }, { status: 401 })
    }

    // Find the zone
    const zone = await prisma.zone.findUnique({
      where: { name: id },
    })

    if (!zone) {
      return NextResponse.json({ isMember: false, error: "Zone not found" }, { status: 404 })
    }

    // Check if user is the zone owner
    const isZoneOwner = zone.userId === session.user.id

    if (isZoneOwner) {
      return NextResponse.json({ isMember: true, isOwner: true })
    }

    // Check if user is a member
    const membership = await prisma.zoneMember.findUnique({
      where: {
        userId_zoneId: {
          userId: session.user.id,
          zoneId: zone.id,
        },
      },
    })

    return NextResponse.json({ 
      isMember: !!membership, 
      isOwner: false,
      joinedAt: membership?.joinedAt 
    })
  } catch (error) {

    return NextResponse.json(
      { isMember: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 