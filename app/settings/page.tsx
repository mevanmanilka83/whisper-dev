"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ZoneSettingsSkeleton from "@/app/components/ZoneSettingsSkeleton"
import InvitationsTab from "@/app/components/InvitationsTab"

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
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
        <p className="text-muted-foreground">
          Manage your collaboration invitations.
        </p>
      </div>

      <InvitationsTab />
    </div>
  )
} 