"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Save, 
  Download, 
  Trash2,
  Eye,
  MessageSquare,
  Users,
  Mail,
  Smartphone
} from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateSettings, deleteAccount } from "@/app/actions/settings"

export default function SettingsPage() {
  const { status } = useSession()
  const router = useRouter()
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

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
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
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and security</p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Mentions</p>
                        <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.mentions}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, mentions: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Zone Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about zone activities</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.zoneUpdates}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, zoneUpdates: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control who can see your information and contact you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <select
                      id="profileVisibility"
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, profileVisibility: e.target.value }
                      }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Show Email Address</p>
                        <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showEmail}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showEmail: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Allow Direct Messages</p>
                        <p className="text-sm text-muted-foreground">Let other users send you direct messages</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowMessages}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, allowMessages: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize how the platform looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      value={settings.appearance.theme}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: e.target.value }
                      }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Compact Mode</p>
                        <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.appearance.compactMode}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, compactMode: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Show Avatars</p>
                        <p className="text-sm text-muted-foreground">Display user avatars throughout the platform</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.appearance.showAvatars}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, showAvatars: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and session settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) || 30 }
                      }))}
                      min="5"
                      max="1440"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Login Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, loginAlerts: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export your data or delete your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 