"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Save, 
  Edit3,
  Shield,
  Activity,
  Globe
} from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateProfile, getUserStats, getUserActivity, getUserZones } from "@/app/actions/profile"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "Passionate developer and tech enthusiast. Love building amazing products and sharing knowledge with the community.",
    location: "San Francisco, CA",
    website: "https://example.com",
    avatar: "/whisper.jpg"
  })

  const [stats, setStats] = useState({
    points: 0,
    zones: 0,
    comments: 0,
    boosts: 0
  })

  const [activity, setActivity] = useState<Array<{
    id: string
    type: string
    title: string
    zoneName: string
    createdAt: Date
    boostCount?: number
    description?: string
  }>>([])

  const [userZones, setUserZones] = useState<Array<{
    id: string
    name: string
    description: string | null
    createdAt: Date
    _count: { points: number }
  }>>([])

  // Update profile data when session loads
  useEffect(() => {
    if (session?.user) {
      setProfileData(prev => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
        avatar: session.user?.image || "/whisper.jpg"
      }))
    }
  }, [session])

  // Fetch user stats and activity
  useEffect(() => {
    if (status === "loading") {
      return
    }
    
    if (status === "unauthenticated") {
      router.push("/sign-in")
      return
    }
    
    if (session?.user?.id) {
      const userId = session.user.id
      
      const fetchData = async () => {
        try {
          const statsData = await getUserStats(userId)
          const activityData = await getUserActivity(userId)
          const zonesData = await getUserZones(userId)
          
          // Ensure stats data is valid
          const validStats = {
            points: typeof statsData?.points === 'number' ? statsData.points : 0,
            zones: typeof statsData?.zones === 'number' ? statsData.zones : 0,
            boosts: typeof statsData?.boosts === 'number' ? statsData.boosts : 0,
            comments: typeof statsData?.comments === 'number' ? statsData.comments : 0
          }
          
          setStats(validStats)
          
          // Combine points and zones into activity
          const combinedActivity = [
            ...(activityData || []),
            ...(zonesData || []).map(zone => ({
              id: zone.id,
              type: "zone",
              title: zone.name,
              zoneName: zone.name,
              createdAt: zone.createdAt,
              description: zone.description || undefined
            }))
          ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10) // Keep only the 10 most recent items
          
          setActivity(combinedActivity)
          setUserZones(zonesData || [])
          
        } catch (error) {
          console.error("Error fetching user data:", error)
          setStats({
            points: 0,
            zones: 0,
            boosts: 0,
            comments: 0
          })
          setActivity([])
          setUserZones([])
        }
      }
      
      fetchData()
    }
  }, [session?.user?.id, status, router])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Loading profile...</h1>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Please sign in to view your profile</h1>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", profileData.name)
      formData.append("email", profileData.email)

      const result = await updateProfile(formData)
      
      if (result.success) {
        toast.success("Profile updated successfully!")
        setIsEditing(false)
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch {
      toast.error("An error occurred while updating profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Handle avatar upload logic here
      console.log("Avatar file selected:", file.name)
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl">
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="absolute bottom-4 left-6">
                <div className="flex items-end space-x-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                      <AvatarImage src={profileData.avatar} alt={profileData.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        {profileData.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute -bottom-1 -right-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label htmlFor="avatar-upload">
                          <Button size="sm" className="h-8 w-8 rounded-full p-0 cursor-pointer">
                            <User className="h-4 w-4" />
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <h1 className="text-2xl font-bold text-foreground">{profileData.name || "User"}</h1>
                    <p className="text-muted-foreground">@{profileData.name?.toLowerCase().replace(/\s+/g, '') || "user"}</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card className="border shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Manage your personal information and bio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="border shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your recent interactions and contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  {activity.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No activity yet. Start creating points to see your activity here!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activity.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">zone/{item.zoneName}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your privacy settings and account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications about your activity</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                    </div>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-destructive">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistics Card */}
          <Card className="border shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{stats.points}</p>
                  <p className="text-sm text-muted-foreground">Points</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{stats.zones}</p>
                  <p className="text-sm text-muted-foreground">Zones</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{stats.boosts}</p>
                  <p className="text-sm text-muted-foreground">Boosts</p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{stats.comments}</p>
                  <p className="text-sm text-muted-foreground">Comments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Zones Card */}
          {userZones.length > 0 && (
            <Card className="border shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  My Zones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {zone._count.points} points
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/zone/${zone.name}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 