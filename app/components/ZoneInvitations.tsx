"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  UserPlus, 
  Clock, 
  Users,
  Send
} from "lucide-react"
import { toast } from "sonner"

interface Invitation {
  id: string
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED"
  message?: string
  createdAt: string
  inviter: {
    id: string
    name: string
    email: string
    image: string
  }
  invitee: {
    id: string
    name: string
    email: string
    image: string
  }
}

interface ZoneInvitationsProps {
  zoneName: string
  isOwner: boolean
}

export default function ZoneInvitations({ zoneName, isOwner }: ZoneInvitationsProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteeEmail, setInviteeEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isOwner) {
      fetchInvitations()
    }
  }, [isOwner, zoneName])

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/zones/${zoneName}/invitations`)
      if (response.ok) {
        const data = await response.json()
        setInvitations(data.invitations || [])
      }
    } catch (error) {
      console.error("Error fetching invitations:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendInvitation = async () => {
    if (!inviteeEmail.trim()) {
      toast.error("Please enter an email address")
      return
    }

    setSending(true)
    try {
      const response = await fetch(`/api/zones/${zoneName}/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteeEmail: inviteeEmail.trim(),
          message: message.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Invitation sent successfully!")
        setInviteeEmail("")
        setMessage("")
        fetchInvitations()
      } else {
        toast.error(data.error || "Failed to send invitation")
      }
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast.error("Failed to send invitation")
    } finally {
      setSending(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleInvitationResponse = async (invitationId: string, action: "accept" | "decline") => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        fetchInvitations()
      } else {
        toast.error(data.error || "Failed to process invitation")
      }
    } catch (error) {
      console.error("Error handling invitation:", error)
      toast.error("Failed to process invitation")
    }
  }

  if (!isOwner) {
    return null
  }

  return (
    <Card className="border shadow-sm rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">Collaboration Invitations</CardTitle>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Send Invitation Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteeEmail" className="text-sm font-medium">
              Invite Collaborator
            </Label>
            <div className="flex gap-2">
              <Input
                id="inviteeEmail"
                type="email"
                placeholder="Enter email address"
                value={inviteeEmail}
                onChange={(e) => setInviteeEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={sendInvitation}
                disabled={sending || !inviteeEmail.trim()}
                size="sm"
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Sent Invitations */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Sent Invitations ({invitations.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No sent invitations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={invitation.invitee.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {invitation.invitee.name?.charAt(0) || invitation.invitee.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {invitation.invitee.name || invitation.invitee.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invitation.invitee.email}
                      </p>
                      {invitation.message && (
                        <p className="text-xs text-muted-foreground mt-1">
                          &ldquo;{invitation.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 