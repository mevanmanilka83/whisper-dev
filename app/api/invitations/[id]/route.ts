import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/utils/auth"
import { prisma } from "@/app/utils/db"

export async function PATCH(
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

    const { action } = body // "accept" or "decline"

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const invitation = await prisma.zoneInvitation.findUnique({
      where: { id },
      include: {
        zone: true,
        inviter: true,
        invitee: true,
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Check if user is the invitee or zone owner
    const isInvitee = invitation.inviteeId === session.user.id
    const isZoneOwner = invitation.zone.userId === session.user.id

    if (!isInvitee && !isZoneOwner) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "Invitation is no longer pending" }, { status: 400 })
    }

    if (action === "accept") {
      // Update invitation status
      await prisma.zoneInvitation.update({
        where: { id },
        data: { status: "ACCEPTED" },
      })

      // Create membership
      await prisma.zoneMember.create({
        data: {
          userId: invitation.inviteeId,
          zoneId: invitation.zoneId,
          role: "COLLABORATOR",
        },
      })

      return NextResponse.json({ message: "Invitation accepted" })
    } else if (action === "decline") {
      // Update invitation status
      await prisma.zoneInvitation.update({
        where: { id },
        data: { status: "DECLINED" },
      })

      return NextResponse.json({ message: "Invitation declined" })
    }
  } catch {

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 