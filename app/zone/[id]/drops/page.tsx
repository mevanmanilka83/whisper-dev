"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text, FileImage, Shield, Info, ArrowLeft, Users, UserPlus, UserMinus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import SkeltonCard from "@/app/components/SkeltonCard"

import SubmitButton from "@/app/components/SubmitButton"
import EditorComponent from "@/app/components/Editor"
import { UploadButton } from "@/app/components/uploadthing"
import type { JSONContent } from "@tiptap/react"
import { createPoint, joinZone, leaveZone } from "@/app/actions/actions"
import { toast } from "sonner"

const rules = [
  {
    id: 1,
    title: "Be respectful",
    description: "Speak to others with kindness and treat everyone with respect, regardless of differences.",
  },
  {
    id: 2,
    title: "No hate speech",
    description: "Discrimination, slurs, or hateful language of any kind is not allowed in this zone.",
  },
  {
    id: 3,
    title: "No spam",
    description: "Avoid sending repetitive messages, links, or unrelated content.",
  },
  {
    id: 4,
    title: "Stay on topic",
    description: "Keep your messages relevant to the channel or discussion topic.",
  },
  {
    id: 5,
    title: "No personal attacks",
    description: "Debate ideas, not individuals. Harassment or bullying will not be tolerated.",
  },
]

export default function CreatePostRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params) as { id: string }
  const { status, data: session } = useSession()
  const router = useRouter()
  const [imageUrl, setImageUrl] = React.useState<string>("")
  const [json, setJson] = React.useState<JSONContent | null>(null)
  const [title, setTitle] = React.useState<string>("")
  const [error, setError] = React.useState<string | null>(null)
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  useEffect(() => {
    const checkMembership = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/zones/${resolvedParams.id}/membership`)
          const data = await response.json()
          setIsMember(data.isMember)
        } catch (error) {
          console.error("Error checking membership:", error)
          setIsMember(false)
        }
      } else {
        setIsMember(false)
      }
      setIsLoading(false)
    }

    checkMembership()
  }, [status, session, resolvedParams.id])

  const handleJoinZone = async () => {
    const formData = new FormData()
    formData.set("zoneName", resolvedParams.id)
    
    const response = await joinZone(formData)
    
    if (response.success) {
      toast.success("Successfully joined zone!", {
        position: "bottom-right",
      })
      setIsMember(true)
    } else {
      toast.error("Failed to join zone", {
        description: response.error,
        position: "bottom-right",
      })
    }
  }

  const handleLeaveZone = async () => {
    const formData = new FormData()
    formData.set("zoneName", resolvedParams.id)
    
    const response = await leaveZone(formData)
    
    if (response.success) {
      toast.success("Successfully left zone!", {
        position: "bottom-right",
      })
      setIsMember(false)
    } else {
      toast.error("Failed to leave zone", {
        description: response.error,
        position: "bottom-right",
      })
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <SkeltonCard />
      </div>
    )
  }

  const createPointZone = createPoint.bind(null, { jsonContent: json })

  const handleSubmit = async (formData: FormData) => {
    setError(null)

    formData.set("imageUrl", imageUrl)
    const response = await createPointZone(formData)

    if (response.error) {
      setError(response.error)
      toast.error("Error", {
        description: response.error || "Failed to create point. Please try again.",
        position: "bottom-right",
      })
      return
    }

    if (response.success && response.pointId) {
      toast.success("Point created successfully!", {
        position: "bottom-right",
      })
      router.push(`/zone/${resolvedParams.id}`)
    }
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {error && (
        <div className="bg-destructive/15 border border-destructive/20 text-destructive p-4 rounded-lg mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/zone/${resolvedParams.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Zone
                </Badge>
                <h1 className="text-2xl font-bold">
                  <Link
                    href={`/zone/${resolvedParams.id}`}
                    className="text-primary hover:underline hover:text-primary/80 transition-colors"
                  >
                    {resolvedParams.id}
                  </Link>
                </h1>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Learn about posting in this zone</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Membership Status */}
          {status === "authenticated" && (
            <Card className="border shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Zone Membership</h3>
                      <p className="text-sm text-muted-foreground">
                        {isMember ? "You are a member of this zone" : "You are not a member of this zone"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isMember ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLeaveZone}
                        className="flex items-center space-x-2"
                      >
                        <UserMinus className="h-4 w-4" />
                        <span>Leave Zone</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleJoinZone}
                        className="flex items-center space-x-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Join Zone</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content - Only show if user is a member */}
          {isMember ? (
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/60 h-12">
                <TabsTrigger
                  value="post"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm h-10"
                >
                  <Text className="h-4 w-4" />
                  Text Post
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm h-10"
                >
                  <FileImage className="h-4 w-4" />
                  Media Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="post" className="m-0">
                <Card className="border shadow-lg rounded-xl overflow-hidden">
                  <form action={handleSubmit}>
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                    <input type="hidden" name="zoneId" value={resolvedParams.id} />
                    <input type="hidden" name="subName" value={resolvedParams.id} />

                    <CardHeader className="space-y-4 pb-6">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Text className="h-5 w-5 text-primary" />
                        Create Drop Point
                      </CardTitle>
                      <Separator />
                      <div className="space-y-3">
                        <Label htmlFor="title" className="text-base font-medium">
                          Title
                        </Label>
                        <Input
                          id="title"
                          required
                          name="title"
                          className="h-12 text-base focus-visible:ring-2 focus-visible:ring-primary/20"
                          placeholder="Give your drop a compelling title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="pb-6">
                      <div className="space-y-3">
                        <Label htmlFor="content" className="text-base font-medium">
                          Content
                        </Label>
                        <div className="rounded-lg">
                          <EditorComponent setJson={setJson} json={json} />
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6 bg-muted/30">
                      <Button variant="outline" type="button" onClick={() => router.back()} className="h-11 px-6">
                        Cancel
                      </Button>
                      <SubmitButton
                        text="Create Point"
                        loadingText="Creating..."
                        variant="default"
                        size="lg"
                        icon={<Text className="h-4 w-4" />}
                      />
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="image" className="m-0">
                <Card className="border shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileImage className="h-5 w-5 text-primary" />
                      Upload Media
                    </CardTitle>
                    <Separator />
                  </CardHeader>

                  <CardContent className="pb-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-full max-w-lg">
                        <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors">
                          {imageUrl ? (
                            <div className="flex flex-col items-center gap-4">
                              <Image
                                src={imageUrl || "/placeholder.svg"}
                                alt="Uploaded Image"
                                className="object-cover rounded-lg shadow-md"
                                width={300}
                                height={200}
                              />
                              <Button type="button" variant="destructive" size="sm" onClick={() => setImageUrl("")}>
                                Remove Image
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center space-y-4">
                              <FileImage className="h-12 w-12 text-muted-foreground mx-auto" />
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Upload your media</p>
                                <p className="text-xs text-muted-foreground">Drag and drop or click to browse</p>
                              </div>
                              <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                  console.log(res)
                                  setImageUrl(res[0].url)
                                }}
                                onUploadError={(error: Error) => {
                                  toast.error("Upload Failed", {
                                    description: error.message,
                                    position: "bottom-right",
                                  })
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Shield className="h-16 w-16 text-muted-foreground/50" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Join Zone to Create Drops</h3>
                    <p className="text-muted-foreground">
                      You need to be a member of this zone to create drops. Join the zone to start contributing!
                    </p>
                  </div>
                  {status === "authenticated" && (
                    <Button onClick={handleJoinZone} className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Join Zone</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Guidelines Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border shadow-lg rounded-xl sticky top-20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg"> Guidelines</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              {rules.map((rule, index) => (
                <div key={rule.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold text-base flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {rule.id}
                    </span>
                    {rule.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed ml-9">{rule.description}</p>
                  {index < rules.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
