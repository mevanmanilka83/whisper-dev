"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { User, LogOut, Users, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { getNotificationStatus, getUserZoneMemberships, getUserOwnedZones } from "@/app/actions/profile"
import { Badge } from "@/components/ui/badge"


interface UserDropdownProps {
  user: {
    name?: string | null
    image?: string | null
    email?: string | null
  }
}

type ZoneMembership = Awaited<ReturnType<typeof getUserZoneMemberships>>["memberships"][0]
type OwnedZone = Awaited<ReturnType<typeof getUserOwnedZones>>["zones"][0]

export default function UserDropdown({ user }: UserDropdownProps) {
    const [invitationCount, setInvitationCount] = useState(0)
    const [collaborations, setCollaborations] = useState<ZoneMembership[]>([])
    const [ownedZones, setOwnedZones] = useState<OwnedZone[]>([])
    const [isLoadingCollaborations, setIsLoadingCollaborations] = useState(true)
    const [isLoadingOwnedZones, setIsLoadingOwnedZones] = useState(true)

    useEffect(() => {
      const checkNotifications = async () => {
        try {
          const { count } = await getNotificationStatus()
          setInvitationCount(count)
        } catch {
            // Silently fail, don't bother the user with notification errors

        }
      }

      const loadCollaborations = async () => {
        try {
          const { memberships } = await getUserZoneMemberships()
          setCollaborations(memberships)
        } catch {

        } finally {
          setIsLoadingCollaborations(false)
        }
      }

      const loadOwnedZones = async () => {
        try {
          const { zones } = await getUserOwnedZones()
          setOwnedZones(zones)
        } catch {

        } finally {
          setIsLoadingOwnedZones(false)
        }
      }
  
      checkNotifications()
      loadCollaborations()
      loadOwnedZones()
      
      const interval = setInterval(checkNotifications, 30000) // Poll every 30 seconds

      // Listen for manual refresh event
      const refreshListener = () => {
        checkNotifications()
        loadCollaborations()
        loadOwnedZones()
      }
      window.addEventListener("refresh-notifications", refreshListener)

      return () => {
        clearInterval(interval)
        window.removeEventListener("refresh-notifications", refreshListener)
      }
    }, [])

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <button className="relative flex items-center justify-center rounded-full w-10 h-10 ring-2 ring-offset-2 ring-offset-background ring-primary/20 focus:outline-none focus:ring-primary">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || "/whisper.jpg"} alt={user.name || "User Avatar"} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          {invitationCount > 0 && (
            <span className="absolute -top-1 -right-1 block min-w-[1.5em] h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white">
              {invitationCount}
            </span>
          )}
        </button>
        </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer flex justify-between items-center">
                <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Collaboration Invitations & Join Requests</span>
          </div>
                {invitationCount > 0 && <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-xs">{invitationCount}</Badge>}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            Your Collaborations ({collaborations.length})
          </DropdownMenuLabel>
          {isLoadingCollaborations ? (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground px-2 py-1.5">
              Loading...
            </DropdownMenuItem>
          ) : collaborations.length > 0 ? (
            collaborations.slice(0, 3).map((collaboration) => (
              <DropdownMenuItem 
                key={collaboration.id} 
                className="cursor-pointer px-2 py-1.5"
                onClick={() => window.open(`/zone/${collaboration.zone.name}`, '_blank')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={collaboration.zone.user.image ?? undefined} />
                      <AvatarFallback className="text-xs">{collaboration.zone.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{collaboration.zone.name}</span>
                      <span className="text-xs text-muted-foreground">by {collaboration.zone.user.name}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground px-2 py-1.5">
              No collaborations yet
            </DropdownMenuItem>
          )}
          {collaborations.length > 3 && (
            <DropdownMenuItem className="text-xs text-muted-foreground px-2 py-1.5">
              +{collaborations.length - 3} more...
            </DropdownMenuItem>
          )}
          {collaborations.length > 0 && (
            <Link href="/settings">
              <DropdownMenuItem className="text-xs text-primary px-2 py-1.5 cursor-pointer">
                View All Collaborations →
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            My Zones ({ownedZones.length})
          </DropdownMenuLabel>
          {isLoadingOwnedZones ? (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground px-2 py-1.5">
              Loading...
            </DropdownMenuItem>
          ) : ownedZones.length > 0 ? (
            ownedZones.slice(0, 3).map((zone) => (
              <DropdownMenuItem 
                key={zone.id} 
                className="cursor-pointer px-2 py-1.5"
                onClick={() => window.open(`/zone/${zone.name}`, '_blank')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{zone.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{zone.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {zone._count.points} points • {zone._count.members} members
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground px-2 py-1.5">
              No zones created yet
            </DropdownMenuItem>
          )}
          {ownedZones.length > 3 && (
            <DropdownMenuItem className="text-xs text-muted-foreground px-2 py-1.5">
              +{ownedZones.length - 3} more...
            </DropdownMenuItem>
          )}
          {ownedZones.length > 0 && (
            <Link href="/zone/setup">
              <DropdownMenuItem className="text-xs text-primary px-2 py-1.5 cursor-pointer">
                Create New Zone →
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
