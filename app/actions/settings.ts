"use server"

import { prisma } from "@/app/utils/db"
import { auth } from "@/app/utils/auth"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export async function updateSettings(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Parse settings from form data
    const settings = {
      notifications: {
        email: formData.get("notifications.email") === "true",
        push: formData.get("notifications.push") === "true",
        mentions: formData.get("notifications.mentions") === "true",
        zoneUpdates: formData.get("notifications.zoneUpdates") === "true"
      },
      privacy: {
        profileVisibility: formData.get("privacy.profileVisibility") as string,
        showEmail: formData.get("privacy.showEmail") === "true",
        allowMessages: formData.get("privacy.allowMessages") === "true"
      },
      appearance: {
        theme: formData.get("appearance.theme") as string,
        compactMode: formData.get("appearance.compactMode") === "true",
        showAvatars: formData.get("appearance.showAvatars") === "true"
      },
      security: {
        sessionTimeout: parseInt(formData.get("security.sessionTimeout") as string) || 30,
        loginAlerts: formData.get("security.loginAlerts") === "true"
      }
    }

    // Note: You might want to add a UserSettings model to your schema
    // For now, we'll just return success
    // In a real implementation, you would save these settings to the database

    revalidatePath("/settings")
    return { success: true, settings }
  } catch (error) {

    return { error: "Failed to update settings" }
  }
}

export async function acceptInvitation({ invitationId }: { invitationId: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    const invitation = await prisma.zoneInvitation.findUnique({
      where: { id: invitationId },
      include: {
        zone: true,
      },
    })

    if (!invitation) {
      return { error: "Invitation not found." }
    }

    // Check if user is the invitee OR the zone owner
    const isInvitee = invitation.inviteeId === session.user.id
    const isZoneOwner = invitation.zone.userId === session.user.id

    if (!isInvitee && !isZoneOwner) {
      return { error: "You are not authorized to accept this invitation." }
    }
    
    if (invitation.status !== "PENDING") {
      return { error: "Invitation is not pending." }
    }

    await prisma.$transaction(async (tx) => {
      await tx.zoneInvitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      })

      await tx.zoneMember.create({
        data: {
          userId: invitation.inviteeId,
          zoneId: invitation.zoneId,
          role: "COLLABORATOR",
        },
      })
    })

    revalidatePath("/settings")
    if (invitation.zoneId) {
        revalidatePath(`/zone/${invitation.zoneId}`)
    }
    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        await prisma.zoneInvitation.update({
            where: { id: invitationId },
            data: { status: "DECLINED" },
        });
        return { error: "User is already a member of this zone. The invitation has been declined." }
    }

    return { error: "An unexpected error occurred." }
  }
}

export async function declineInvitation({ invitationId }: { invitationId: string }) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Not authenticated" }
    }

    try {
        const invitation = await prisma.zoneInvitation.findUnique({
            where: { id: invitationId },
            include: {
                zone: true,
            },
        })

        if (!invitation) {
            return { error: "Invitation not found." }
        }

        // Check if user is the invitee OR the zone owner
        const isInvitee = invitation.inviteeId === session.user.id
        const isZoneOwner = invitation.zone.userId === session.user.id

        if (!isInvitee && !isZoneOwner) {
            return { error: "You are not authorized to decline this invitation." }
        }

        if (invitation.status !== "PENDING") {
          return { error: "Invitation is not pending." }
        }

        await prisma.zoneInvitation.update({
            where: { id: invitationId },
            data: { status: "DECLINED" },
        })

        revalidatePath("/settings")
        return { success: true }
    } catch (error) {

        return { error: "An unexpected error occurred." }
    }
}

export async function deleteAccount() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Delete user and all related data
    await prisma.user.delete({
      where: { id: session.user.id }
    })

    return { success: true }
  } catch (error) {

    return { error: "Failed to delete account" }
  }
} 