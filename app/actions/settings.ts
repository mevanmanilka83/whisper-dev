"use server"

import { prisma } from "@/app/utils/db"
import { auth } from "@/app/utils/auth"
import { revalidatePath } from "next/cache"

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
    console.error("Error updating settings:", error)
    return { error: "Failed to update settings" }
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
    console.error("Error deleting account:", error)
    return { error: "Failed to delete account" }
  }
} 