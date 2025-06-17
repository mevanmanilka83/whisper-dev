"use client"

import { Separator } from "@/components/ui/separator"
import SubmitButton from "@/app/components/SubmitButton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createZone } from "@/app/actions/actions"
import { toast } from "sonner"
import { useActionState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ArrowLeft } from "lucide-react"
import ZoneSetupSkeleton from "@/app/components/ZoneSetupSkeleton"

type ActionState = {
  message: string
  error: boolean
  zoneId?: string
}

const initialState: ActionState = {
  message: "",
  error: false,
}

export default function Page() {
  const { status } = useSession()
  const router = useRouter()
  const [state, formAction] = useActionState(createZone, initialState)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in")
    }
  }, [status, router])

  useEffect(() => {
    if (state.message) {
      if (!state.error && state.zoneId) {
        toast.success("Success", {
          description: state.message || "Zone created successfully!",
        })

        setTimeout(() => {
          router.push(`/zone/${state.zoneId}`)
        }, 500)
      } else {
        toast.error("Error", {
          description: state.message || "Failed to create zone. Please try again.",
        })
      }
    }
  }, [state, router])

  if (status === "loading") {
    return <ZoneSetupSkeleton />
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg mb-4">
            <Plus className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Setup your Zone
          </h1>
          <p className="text-muted-foreground text-lg">Create a new space for you</p>
        </div>

        {/* Form Card */}
        <Card className="border shadow-xl bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl">Zone Details</CardTitle>
            <CardDescription>Choose a unique name for your zone</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" action={formAction}>
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">
                  Zone Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  className="h-12 text-base focus-visible:ring-2 focus-visible:ring-primary/20"
                  placeholder="Enter zone name"
                  minLength={2}
                  maxLength={21}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Choose a name between 2-21 characters. This will be your zone&apos;s unique identifier.
                </p>
                {state.message && state.error && (
                  <p className="text-sm text-destructive font-medium">{state.message}</p>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between pt-2">
                <Button type="button" variant="outline" asChild className="h-11 px-6">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                  </Link>
                </Button>

                <SubmitButton text="Create Zone" loadingText="Creating..." size="lg" />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
