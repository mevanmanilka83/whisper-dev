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

    return []
  }
}

export async function getUserProfile(userId: string) {
  try {
    if (!userId) {

      return null
    }
    

    
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
    

    
    if (!user) {

      
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
        

        return userByEmail
      }
    }
    
    return user
  } catch (error) {

    return null
  }
}

export async function getNotificationStatus() {
  const session = await auth()
  if (!session?.user?.id) {
    return { count: 0 }
  }

  // Get zones owned by the current user
  const ownedZones = await prisma.zone.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  const [invitationCount, zoneOwnerRequestCount] = await Promise.all([
    // Count only collaboration invitations where user is the invitee (not their own join requests)
    prisma.zoneInvitation.count({
      where: {
        inviteeId: session.user.id,
        status: "PENDING",
        // Exclude join requests where user is both inviter and invitee
        NOT: {
          inviterId: session.user.id,
        },
      },
    }),
    // Count join requests for zones owned by the user
    ownedZones.length > 0 ? (async () => {
      const joinRequests = await prisma.zoneInvitation.findMany({
        where: {
          zoneId: {
            in: ownedZones.map(zone => zone.id),
          },
          status: "PENDING",
        },
        select: {
          inviterId: true,
          inviteeId: true,
        },
      })
      // Filter for join requests where inviterId equals inviteeId
      return joinRequests.filter(request => request.inviterId === request.inviteeId).length
    })() : Promise.resolve(0),
  ])

  return {
    count: invitationCount + zoneOwnerRequestCount,
  }
}

export async function getPendingInvitations() {
  const session = await auth()
  if (!session?.user?.id) {
    return { invitations: [] }
  }

  const invitations = await prisma.zoneInvitation.findMany({
    where: {
      OR: [
        // Collaboration invitations where user is the invitee
        {
          inviteeId: session.user.id,
          status: "PENDING",
        },
        // Join requests where user is both inviter and invitee
        {
          inviterId: session.user.id,
          inviteeId: session.user.id,
          status: "PENDING",
        },
      ],
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

export async function getZoneOwnerJoinRequests() {
  const session = await auth()
  if (!session?.user?.id) {
    return { joinRequests: [] }
  }

  // Get zones owned by the current user
  const ownedZones = await prisma.zone.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (ownedZones.length === 0) {
    return { joinRequests: [] }
  }

  // Get join requests for zones owned by the current user
  const joinRequests = await prisma.zoneInvitation.findMany({
    where: {
      zoneId: {
        in: ownedZones.map(zone => zone.id),
      },
      // Join requests where inviter and invitee are the same (self-request)
      // Use raw SQL condition since Prisma doesn't support field-to-field comparison easily
      AND: [
        { status: "PENDING" },
        // This will be handled by filtering in JavaScript
      ],
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
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Filter for join requests where inviterId equals inviteeId
  const filteredJoinRequests = joinRequests.filter(request => request.inviterId === request.inviteeId)



  return { joinRequests: filteredJoinRequests }
} 

export async function getUserZoneMemberships() {
  const session = await auth()
  if (!session?.user?.id) {
    return { memberships: [] }
  }

  const memberships = await prisma.zoneMember.findMany({
    where: {
      userId: session.user.id,
      role: "COLLABORATOR",
    },
    include: {
      zone: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      zone: {
        createdAt: "desc",
      },
    },
  })

  return { memberships }
} 

export async function getUserOwnedZones() {
  const session = await auth()
  if (!session?.user?.id) {
    return { zones: [] }
  }

  const zones = await prisma.zone.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          points: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return { zones }
} 