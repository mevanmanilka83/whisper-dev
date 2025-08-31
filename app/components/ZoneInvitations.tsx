"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Clock, User, Check, X } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { acceptInvitation, declineInvitation } from "@/app/actions/actions"

interface Invitation {
  id: string
  status: string
  createdAt: string
  invitee: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

interface ZoneInvitationsProps {
  zoneName: string
  isOwner: boolean
}

export default function ZoneInvitations({ zoneName, isOwner }: ZoneInvitationsProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInvitations = useCallback(async () => {
    try {
      const response = await fetch(`/api/zones/${zoneName}/invitations`)
      if (response.ok) {
        const data = await response.json()
        setInvitations(data.invitations || [])
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }, [zoneName])

  useEffect(() => {
    if (isOwner) {
      fetchInvitations()
    }
  }, [isOwner, fetchInvitations])

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const formData = new FormData()
      formData.append("invitationId", invitationId)

      const result = await acceptInvitation(formData)

      if (result.success) {
        toast.success("Invitation accepted!")
        fetchInvitations() // Refresh the list
      } else {
        toast.error(result.error || "Failed to accept invitation")
      }
    } catch {
      toast.error("An error occurred while accepting the invitation")
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      const formData = new FormData()
      formData.append("invitationId", invitationId)

      const result = await declineInvitation(formData)

      if (result.success) {
        toast.success("Invitation declined")
        fetchInvitations() // Refresh the list
      } else {
        toast.error(result.error || "Failed to decline invitation")
      }
    } catch {
      toast.error("An error occurred while declining the invitation")
    }
  }

  if (!isOwner) {
    return null
  }

  if (loading) {
    return (
      <Card className="border shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-32 bg-muted rounded" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-muted rounded" />
                  <div className="h-8 w-16 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const pendingInvitations = invitations.filter(inv => inv.status === "PENDING")

  if (pendingInvitations.length === 0) {
    return null
  }

  return (
    <Card className="border shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Pending Invitations ({pendingInvitations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingInvitations.map((invitation) => (
            <div key={invitation.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={invitation.invitee.image || undefined} alt="User avatar" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {invitation.invitee.name || invitation.invitee.email || "Unknown User"}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleAcceptInvitation(invitation.id)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeclineInvitation(invitation.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 