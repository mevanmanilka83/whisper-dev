"use client"

import { useEffect, useState, useTransition } from "react"
import { getPendingInvitations } from "@/app/actions/profile"
import { acceptInvitation, declineInvitation } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Clock, Mail, Users, UserPlus, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Invitation = Awaited<ReturnType<typeof getPendingInvitations>>["invitations"][0]

export default function InvitationsTab() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const fetchInvitations = async () => {
    setIsLoading(true)
    try {
        const { invitations } = await getPendingInvitations()
        setInvitations(invitations)
    } catch (error) {
        toast.error("Failed to load invitations.")
        console.error(error)
    } finally {
        setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const handleResponse = (invitationId: string, action: "accept" | "decline") => {
    startTransition(async () => {
      const responseFn = action === "accept" ? acceptInvitation : declineInvitation
      const response = await responseFn({ invitationId })

      if (response.success) {
        toast.success(`Invitation ${action}ed successfully!`)
        fetchInvitations()
        window.dispatchEvent(new Event("refresh-notifications"))
      } else {
        toast.error(`Failed to ${action} invitation`, { description: response.error })
      }
    })
  }

  // Separate collaboration invitations from join requests
  const collaborationInvites = invitations.filter(invite => invite.inviterId !== invite.inviteeId)
  const joinRequests = invitations.filter(invite => invite.inviterId === invite.inviteeId)

  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="h-32 w-full bg-muted/50 animate-pulse rounded-lg"></div>
            <div className="h-32 w-full bg-muted/50 animate-pulse rounded-lg"></div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Collaboration Invitations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Mail className="mr-2 h-5 w-5 text-primary" /> 
            Collaboration Invites
            {collaborationInvites.length > 0 && (
              <Badge variant="secondary" className="ml-2">{collaborationInvites.length}</Badge>
            )}
          </h3>
        </div>
        <Card>
          <CardContent className="p-0">
            {collaborationInvites.length > 0 ? (
              <ul className="divide-y divide-border">
                {collaborationInvites.map((invite) => (
                  <li key={invite.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={invite.inviter.image ?? undefined} />
                        <AvatarFallback>{invite.inviter.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          <span className="font-bold">{invite.inviter.name}</span> invited you to collaborate on{" "}
                          <span className="font-bold text-primary">{invite.zone.name}</span>.
                        </p>
                        {invite.message && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-start">
                            <MessageSquare className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                            &ldquo;{invite.message}&rdquo;
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="hover:bg-destructive/10 hover:text-destructive" 
                        onClick={() => handleResponse(invite.id, 'decline')} 
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="hover:bg-primary/10 hover:text-primary" 
                        onClick={() => handleResponse(invite.id, 'accept')} 
                        disabled={isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Mail className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50"/>
                <p>You have no pending collaboration invitations.</p>
                <p className="text-sm mt-1">Zone owners can invite you to collaborate on their zones.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Join Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <UserPlus className="mr-2 h-5 w-5 text-primary" /> 
            Join Requests
            {joinRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">{joinRequests.length}</Badge>
            )}
          </h3>
        </div>
        <Card>
          <CardContent className="p-0">
            {joinRequests.length > 0 ? (
              <ul className="divide-y divide-border">
                {joinRequests.map((request) => (
                  <li key={request.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.inviter.image ?? undefined} />
                        <AvatarFallback>{request.inviter.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          You requested to join{" "}
                          <span className="font-bold text-primary">{request.zone.name}</span>.
                        </p>
                        {request.message && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-start">
                            <MessageSquare className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                            &ldquo;{request.message}&rdquo;
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">Pending approval</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="hover:bg-destructive/10 hover:text-destructive" 
                        onClick={() => handleResponse(request.id, 'decline')} 
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <UserPlus className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50"/>
                <p>You have no pending join requests.</p>
                <p className="text-sm mt-1">Your join requests to zones will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Invitation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-2xl font-bold text-primary">{collaborationInvites.length}</p>
              <p className="text-sm text-muted-foreground">Collaboration Invites</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-2xl font-bold text-primary">{joinRequests.length}</p>
              <p className="text-sm text-muted-foreground">Join Requests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 