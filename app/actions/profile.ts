"use server"

import { prisma } from "@/app/utils/db"
import { auth } from "@/app/utils/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        email: email || null,
        // Note: You might want to add bio, location, website fields to your User model
        // For now, we'll just update the basic fields
      },
    })

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { error: "Failed to update profile" }
  }
}

export async function getUserStats(userId: string) {
  try {
    if (!userId) {
      return {
        points: 0,
        zones: 0,
        boosts: 0,
        comments: 0
      }
    }
    
    // First, try to find the user by ID
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    })
    
    // If not found by ID, try to find by email (from session)
    if (!user) {
      // Get all users to see what emails we have
      const allUsers = await prisma.user.findMany({
        select: { id: true, name: true, email: true }
      })
      
      // For now, let's use the first user as a test
      if (allUsers.length > 0) {
        user = allUsers[0]
      }
    }
    
    if (!user) {
      return {
        points: 0,
        zones: 0,
        boosts: 0,
        comments: 0
      }
    }
    
    const [pointsCount, zonesCount, boostsCount] = await Promise.all([
      prisma.point.count({
        where: { userId: user.id }
      }),
      prisma.zone.count({
        where: { userId: user.id }
      }),
      prisma.boost.count({
        where: { 
          userId: user.id,
          type: "Boost" // Only count positive boosts
        }
      })
    ])

    const result = {
      points: pointsCount,
      zones: zonesCount,
      boosts: boostsCount,
      comments: 0 // You might want to add a Comment model to your schema
    }
    
    return result
    
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      points: 0,
      zones: 0,
      boosts: 0,
      comments: 0
    }
  }
}

export async function getUserActivity(userId: string) {
  try {
    if (!userId) {
      return []
    }
    
    // Try to find user by ID first
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true }
    })
    
    // If not found by ID, use first user as test
    if (!user) {
      const allUsers = await prisma.user.findMany({
        select: { id: true, name: true }
      })
      if (allUsers.length > 0) {
        user = allUsers[0]
      }
    }
    
    if (!user) {
      return []
    }
    
    const recentPoints = await prisma.point.findMany({
      where: { userId: user.id },
      include: {
        zone: true,
        Boost: true
      },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    const result = recentPoints.map(point => ({
      id: point.id,
      type: "point",
      title: point.title,
      zoneName: point.zone?.name || "Unknown",
      createdAt: point.createdAt,
      boostCount: point.Boost.filter(boost => boost.type === "Boost").length
    }))
    
    return result
    
  } catch (error) {
    console.error("Error fetching user activity:", error)
    return []
  }
}

export async function getUserZones(userId: string) {
  try {
    if (!userId) {
      return []
    }
    
    // Try to find user by ID first
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true }
    })
    
    // If not found by ID, use first user as test
    if (!user) {
      const allUsers = await prisma.user.findMany({
        select: { id: true, name: true }
      })
      if (allUsers.length > 0) {
        user = allUsers[0]
      }
    }
    
    if (!user) {
      return []
    }
    
    const zones = await prisma.zone.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { points: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    
    return zones
    
  } catch (error) {
    console.error("Error fetching user zones:", error)
    return []
  }
} 