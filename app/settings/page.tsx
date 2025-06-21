"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ZoneSettingsSkeleton from "@/app/components/ZoneSettingsSkeleton"
import InvitationsTab from "@/app/components/InvitationsTab"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function SettingsPage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  if (status === "loading") {
    return <ZoneSettingsSkeleton />
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Collaboration Invitations & Join Requests</h1>
        <p className="text-muted-foreground">
          Manage your collaboration invitations and join requests for zones.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invitations Management
          </CardTitle>
          <CardDescription>
            Accept or decline collaboration invitations and manage your join requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvitationsTab />
        </CardContent>
      </Card>
    </div>
  )
} 