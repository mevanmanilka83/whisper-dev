"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteZone } from "@/app/actions/actions"
import ZoneSettingsSkeleton from "@/app/components/ZoneSettingsSkeleton"

interface ZoneData {
  id: string
  name: string
  description: string | null
  createdAt: string
  userId: string
}

export default function ZoneSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params) as { id: string }
  const { status, data: session } = useSession()
  const router = useRouter()
  const [zoneData, setZoneData] = useState<ZoneData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
      return
    }

    const fetchZoneData = async () => {
      try {
        const response = await fetch(`/api/zones/${resolvedParams.id}`)
        if (response.ok) {
          const data = await response.json()
          setZoneData(data)
          setIsOwner(data.userId === session?.user?.id)
        } else {
          toast.error("Zone not found")
          router.push("/")
        }
      } catch (error) {

        toast.error("Failed to load zone data")
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchZoneData()
    }
  }, [status, session, resolvedParams.id, router])

  const handleDeleteZone = async () => {
    if (!zoneData) return

    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.set("zoneId", zoneData.id)

      const result = await deleteZone({ message: "", error: false }, formData)

      if (result.error) {
        toast.error(result.message || "Failed to delete zone")
      } else {
        toast.success("Zone deleted successfully!")
        router.push("/")
      }
    } catch (error) {

      toast.error("Failed to delete zone")
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === "loading" || isLoading) {
    return <ZoneSettingsSkeleton />
  }

  if (!zoneData) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Zone not found</h1>
        </div>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2">Only zone owners can access settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/zone/${zoneData.name}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">
              <Link
                href={`/zone/${zoneData.name}`}
                className="text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                {zoneData.name}
              </Link>
            </h1>
            <span className="text-sm text-muted-foreground">Settings</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <Card className="border border-destructive/20 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80">
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-destructive">Delete Zone</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete this zone and all its content. This action cannot be undone.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Zone</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the{" "}
                    <strong>{zoneData.name}</strong> zone and remove all its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteZone}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Zone"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 