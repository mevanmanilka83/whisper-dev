"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { deleteAccount } from "@/app/actions/settings"
import ZoneSettingsSkeleton from "@/app/components/ZoneSettingsSkeleton"
import InvitationsTab from "@/app/components/InvitationsTab"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      mentions: true,
      zoneUpdates: true
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      allowMessages: true
    },
    appearance: {
      theme: "system",
      compactMode: false,
      showAvatars: true
    },
    security: {
      sessionTimeout: 30,
      loginAlerts: true
    }
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/settings?tab=${value}`, { scroll: false });
  }

  if (status === "loading") {
    return <ZoneSettingsSkeleton />
  }

  if (status === "unauthenticated") {
    return null
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      
      // Add notification settings
      formData.append("notifications.email", settings.notifications.email.toString())
      formData.append("notifications.push", settings.notifications.push.toString())
      formData.append("notifications.mentions", settings.notifications.mentions.toString())
      formData.append("notifications.zoneUpdates", settings.notifications.zoneUpdates.toString())
      
      // Add privacy settings
      formData.append("privacy.profileVisibility", settings.privacy.profileVisibility)
      formData.append("privacy.showEmail", settings.privacy.showEmail.toString())
      formData.append("privacy.allowMessages", settings.privacy.allowMessages.toString())
      
      // Add appearance settings
      formData.append("appearance.theme", settings.appearance.theme)
      formData.append("appearance.compactMode", settings.appearance.compactMode.toString())
      formData.append("appearance.showAvatars", settings.appearance.showAvatars.toString())
      
      // Add security settings
      formData.append("security.sessionTimeout", settings.security.sessionTimeout.toString())
      formData.append("security.loginAlerts", settings.security.loginAlerts.toString())

      const result = await updateSettings(formData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Settings updated successfully!")
      }
    } catch {
      toast.error("Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsLoading(true)
      try {
        const result = await deleteAccount()
        
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Account deleted successfully")
          router.push("/")
        }
      } catch {
        toast.error("Failed to delete account")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleExportData = () => {
    // In a real implementation, this would export user data
    toast.success("Data export started. You'll receive an email when it's ready.")
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, profile, and zones.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="zones">My Zones</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Profile editing form would go here */}
              <p>Profile editing UI will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
            <Card>
                <CardHeader>
                <CardTitle>My Zones</CardTitle>
                <CardDescription>
                    Zones you own or are a collaborator in.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p>A list of your zones will be here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="invitations">
          <InvitationsTab />
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Account settings UI will be here.</p>
              <Button variant="destructive" className="mt-4" onClick={handleDeleteAccount}>Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 