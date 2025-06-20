import { NextResponse } from "next/server"
import { prisma } from "@/app/utils/db"

export async function GET() {
  try {
    console.log("=== DEBUG API START ===")
    
    // Test basic database connection
    const userCount = await prisma.user.count()
    console.log("Total users in database:", userCount)
    
    return NextResponse.json({
      success: true,
      userCount,
      message: "Database connection working"
    })
    
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ 
      error: "Debug API failed", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 