import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/utils/db"
import { auth } from "@/app/utils/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    
    console.log("API Test - User ID:", session.user.id)
    console.log("API Test - User Email:", session.user.email)
    
    // Test user lookup
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true }
    })
    
    console.log("API Test - Found user:", user)
    
    if (!user) {
      // Try to find user by email
      const userByEmail = await prisma.user.findFirst({
        where: { email: session.user.email },
        select: { id: true, name: true, email: true }
      })
      
      console.log("API Test - Found user by email:", userByEmail)
      
      if (!userByEmail) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      
      // Use the user found by email
      const pointsCount = await prisma.point.count({
        where: { userId: userByEmail.id }
      })
      
      const zonesCount = await prisma.zone.count({
        where: { userId: userByEmail.id }
      })
      
      const boostsCount = await prisma.boost.count({
        where: { 
          userId: userByEmail.id,
          type: "Boost"
        }
      })
      
      const result = {
        user: userByEmail,
        stats: {
          points: pointsCount,
          zones: zonesCount,
          boosts: boostsCount,
          comments: 0
        }
      }
      
      console.log("API Test - Result (by email):", result)
      
      return NextResponse.json(result)
    }
    
    // Test points count
    const pointsCount = await prisma.point.count({
      where: { userId: session.user.id }
    })
    
    // Test zones count
    const zonesCount = await prisma.zone.count({
      where: { userId: session.user.id }
    })
    
    // Test boosts count
    const boostsCount = await prisma.boost.count({
      where: { 
        userId: session.user.id,
        type: "Boost"
      }
    })
    
    const result = {
      user,
      stats: {
        points: pointsCount,
        zones: zonesCount,
        boosts: boostsCount,
        comments: 0
      }
    }
    
    console.log("API Test - Result:", result)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error("API Test - Error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
} 