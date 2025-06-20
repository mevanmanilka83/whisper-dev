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

    // Find the zone
    const zone = await prisma.zone.findUnique({
      where: { name: id },
    })

    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 })
    }

    // Check if user is the zone owner
    const isZoneOwner = zone.userId === session.user.id

    if (!isZoneOwner) {
      return NextResponse.json({ error: "Only zone owners can view invitations" }, { status: 403 })
    }

    // Get pending invitations for this zone
    const invitations = await prisma.zoneInvitation.findMany({
      where: {
        zoneId: zone.id,
        status: "PENDING",
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        invitee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    const body = await request.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { inviteeEmail, message } = body

    if (!inviteeEmail) {
      return NextResponse.json({ error: "Invitee email is required" }, { status: 400 })
    }

    // Find the zone
    const zone = await prisma.zone.findUnique({
      where: { name: id },
    })

    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 })
    }

    // Check if user is the zone owner
    if (zone.userId !== session.user.id) {
      return NextResponse.json({ error: "Only zone owners can send invitations" }, { status: 403 })
    }

    // Find the invitee by email
    const invitee = await prisma.user.findUnique({
      where: { email: inviteeEmail },
    })

    if (!invitee) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if invitee is already a member
    const existingMembership = await prisma.zoneMember.findUnique({
      where: {
        userId_zoneId: {
          userId: invitee.id,
          zoneId: zone.id,
        },
      },
    })

    if (existingMembership) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 })
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.zoneInvitation.findUnique({
      where: {
        zoneId_inviteeId: {
          zoneId: zone.id,
          inviteeId: invitee.id,
        },
      },
    })

    if (existingInvitation && existingInvitation.status === "PENDING") {
      return NextResponse.json({ error: "Invitation already pending" }, { status: 400 })
    }

    // Create invitation
    const invitation = await prisma.zoneInvitation.create({
      data: {
        zoneId: zone.id,
        inviterId: session.user.id,
        inviteeId: invitee.id,
        message: message || null,
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        invitee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ invitation })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 