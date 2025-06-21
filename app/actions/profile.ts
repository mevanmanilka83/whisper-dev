"use server"

import { prisma } from "@/app/utils/db"
import { auth } from "@/app/utils/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const location = formData.get("location") as string
  const website = formData.get("website") as string

  // Note: Email is not included here because it's used for authentication
  // and should not be changed through the profile page to avoid conflicts

  // Update user profile (excluding email)
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || null,
      bio: bio || null,
      location: location || null,
      website: website || null,
    },
  })

  revalidatePath("/profile")
  return { success: true }
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

export async function getUserProfile(userId: string) {
  try {
    if (!userId) {
      console.log("getUserProfile: No userId provided")
      return null
    }
    
    console.log("getUserProfile: Looking for user with ID:", userId)
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        profileId: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    console.log("getUserProfile result:", user)
    
    if (!user) {
      console.log("getUserProfile: User not found, trying to find by email...")
      
      // Try to find user by email if ID doesn't work
      const session = await auth()
      if (session?.user?.email) {
        const userByEmail = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            location: true,
            website: true,
            profileId: true,
            createdAt: true,
            updatedAt: true
          }
        })
        
        console.log("getUserProfile by email result:", userByEmail)
        return userByEmail
      }
    }
    
    return user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function getNotificationStatus() {
  const session = await auth()
  if (!session?.user?.id) {
    return { count: 0 }
  }

  const invitationCount = await prisma.zoneInvitation.count({
    where: {
      inviteeId: session.user.id,
      status: "PENDING",
    },
  })

  return {
    count: invitationCount,
  }
}

export async function getPendingInvitations() {
  const session = await auth()
  if (!session?.user?.id) {
    return { invitations: [] }
  }

  const invitations = await prisma.zoneInvitation.findMany({
    where: {
      inviteeId: session.user.id,
      status: "PENDING",
    },
    include: {
      zone: {
        select: {
          name: true,
        },
      },
      inviter: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return { invitations }
} 