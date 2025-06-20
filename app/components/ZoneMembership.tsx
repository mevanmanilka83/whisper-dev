"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserPlus, UserMinus } from "lucide-react"
import { joinZone, leaveZone } from "@/app/actions/actions"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface ZoneMembershipProps {
  zoneName: string
}

export default function ZoneMembership({ zoneName }: ZoneMembershipProps) {
  const { status, data: session } = useSession()
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMembership = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/zones/${zoneName}/membership`)
          const data = await response.json()
          setIsMember(data.isMember)
        } catch (error) {
          console.error("Error checking membership:", error)
          setIsMember(false)
        }
      } else {
        setIsMember(false)
      }
      setIsLoading(false)
    }

    checkMembership()
  }, [status, session, zoneName])

  const handleJoinZone = async () => {
    const formData = new FormData()
    formData.set("zoneName", zoneName)
    
    const response = await joinZone(formData)
    
    if (response.success) {
      toast.success("Successfully joined zone!", {
        position: "bottom-right",
      })
      setIsMember(true)
    } else {
      toast.error("Failed to join zone", {
        description: response.error,
        position: "bottom-right",
      })
    }
  }

  const handleLeaveZone = async () => {
    const formData = new FormData()
    formData.set("zoneName", zoneName)
    
    const response = await leaveZone(formData)
    
    if (response.success) {
      toast.success("Successfully left zone!", {
        position: "bottom-right",
      })
      setIsMember(false)
    } else {
      toast.error("Failed to leave zone", {
        description: response.error,
        position: "bottom-right",
      })
    }
  }

  if (status === "loading" || isLoading) {
    return null
  }

  if (status !== "authenticated") {
    return null
  }

  return (
    <Card className="border shadow-sm rounded-xl mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-sm">Zone Membership</h3>
              <p className="text-xs text-muted-foreground">
                {isMember ? "You are a member" : "You are not a member"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isMember ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeaveZone}
                className="flex items-center space-x-2 h-8 px-3"
              >
                <UserMinus className="h-3 w-3" />
                <span className="text-xs">Leave</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleJoinZone}
                className="flex items-center space-x-2 h-8 px-3"
              >
                <UserPlus className="h-3 w-3" />
                <span className="text-xs">Join</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 