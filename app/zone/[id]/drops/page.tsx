"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text, Video, FileImage, Shield, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import SubmitButton from "@/app/components/SubmitButton";
import EditorComponent from "@/app/components/Editor";
import { UploadButton } from "@/app/components/uploadthing";
import type { JSONContent } from "@tiptap/react";
import { createPoint } from "@/app/actions/actions";
import { toast } from "sonner";

const rules = [
  {
    id: 1,
    title: "Be respectful",
    description:
      "Speak to others with kindness and treat everyone with respect, regardless of differences.",
  },
  {
    id: 2,
    title: "No hate speech",
    description:
      "Discrimination, slurs, or hateful language of any kind is not allowed in this zone.",
  },
  {
    id: 3,
    title: "No spam",
    description:
      "Avoid sending repetitive messages, links, or unrelated content.",
  },
  {
    id: 4,
    title: "Stay on topic",
    description:
      "Keep your messages relevant to the channel or discussion topic.",
  },
  {
    id: 5,
    title: "No personal attacks",
    description:
      "Debate ideas, not individuals. Harassment or bullying will not be tolerated.",
  },
];

export default function CreatePostRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params) as { id: string };
  const { status } = useSession();
  const router = useRouter();
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [json, setJson] = React.useState<JSONContent | null>(null);
  const [title, setTitle] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  const createPointZone = createPoint.bind(null, { jsonContent: json });

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    formData.set("imageUrl", imageUrl);
    const response = await createPointZone(formData);

    if (response.error) {
      setError(response.error);
      toast.error("Error", {
        description:
          response.error || "Failed to create point. Please try again.",
      });
      return;
    }

    if (response.success && response.pointId) {
      toast.success("Point created successfully!");
      router.push(`/zone/${resolvedParams.id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6  min-h-screen">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Zone
              </Badge>
              <h1 className="text-2xl font-semibold">
                <Link
                  href={`/zone/${resolvedParams.id}`}
                  className="text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  {resolvedParams.id}
                </Link>
              </h1>
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

          <Tabs defaultValue="post" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/60">
              <TabsTrigger
                value="post"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Text className="h-4 w-4" />
                Point
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Video className="h-4 w-4" />
                Image & Video
              </TabsTrigger>
            </TabsList>
            <TabsContent value="post" className="m-0 space-y-4">
              <Card className="border shadow-md rounded-lg overflow-hidden">
                <form action={handleSubmit}>
                  <input type="hidden" name="imageUrl" value={imageUrl} />
                  <input
                    type="hidden"
                    name="zoneId"
                    value={resolvedParams.id}
                  />
                  <CardHeader className="space-y-4 pb-4 ">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Text className="h-5 w-5 text-primary" />
                      Drop Point
                    </CardTitle>
                    <Separator className="my-2" />
                    <div className="grid gap-2">
                      <input
                        type="hidden"
                        name="subName"
                        value={resolvedParams.id}
                      />
                      <Label htmlFor="title" className="font-medium">
                        Title
                      </Label>
                      <Input
                        id="title"
                        required
                        name="title"
                        className="focus-visible:ring-1 focus-visible:ring-primary border-muted-foreground/20"
                        placeholder="Give your drop a title"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-6">
                    <div className="grid gap-2">
                      <Label htmlFor="content" className="font-medium">
                        Content
                      </Label>
                      <EditorComponent setJson={setJson} json={json} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-4 bg-muted/30">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <SubmitButton
                        text="Create Point"
                        variant="default"
                        icon={<Text className="h-4 w-4" />}
                      />
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="image" className="m-0 space-y-4">
              <Card className="border shadow-md rounded-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 mb-4">
                    <FileImage className="h-5 w-5 text-primary" />
                    Upload Media
                  </CardTitle>
                  <Separator className="my-2" />
                </CardHeader>

                <CardContent className="flex flex-col items-center justify-center py-8">
                  <div className="w-full max-w-md">
                    <div className="mt-6 p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                      {imageUrl ? (
                        <div className="flex flex-col items-center gap-3">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt="Uploaded Image"
                            className="object-cover"
                            width={300}
                            height={200}
                          />
                          <button
                            type="button"
                            className="text-red-500 text-sm"
                            onClick={() => setImageUrl("")}
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log(res);
                            setImageUrl(res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full md:w-1/3">
          <Card className="border shadow-md rounded-lg sticky top-20">
            <CardHeader className="pb-3 ">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-base">Guidelines</CardTitle>
              </div>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="space-y-0 text-sm p-0">
              {rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium text-base flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {rule.id}
                    </span>
                    {rule.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 ml-8">
                    {rule.description}
                  </p>
                  {index < rules.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
