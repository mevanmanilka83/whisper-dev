"use client"

import { useEffect, useState, useTransition } from "react"
import { getPendingInvitations } from "@/app/actions/profile"
import { acceptInvitation, declineInvitation } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Clock, Mail, Inbox } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

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
      } else {
        toast.error(`Failed to ${action} invitation`, { description: response.error })
      }
    })
  }

  const collaborationInvites = invitations; // All invitations are collaboration invitations
  const joinRequests: Invitation[] = []; // No join requests in current schema

  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="h-24 w-full bg-muted/50 animate-pulse rounded-lg"></div>
            <div className="h-24 w-full bg-muted/50 animate-pulse rounded-lg"></div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center"><Mail className="mr-2 h-5 w-5 text-primary" /> Collaboration Invites</h3>
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
                      <div>
                        <p className="font-medium">
                          <span className="font-bold">{invite.inviter.name}</span> invited you to collaborate on <span className="font-bold text-primary">{invite.zone.name}</span>.
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1.5" />
                            {formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => handleResponse(invite.id, 'decline')} disabled={isPending}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary" onClick={() => handleResponse(invite.id, 'accept')} disabled={isPending}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Inbox className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50"/>
                <p>You have no pending collaboration invitations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 