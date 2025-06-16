"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type React from "react"
import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
  text: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
  width?: string
  icon?: React.ReactNode
  loadingText?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export default function SubmitButton({
  text,
  variant = "default",
  width = "w-auto",
  icon,
  loadingText,
  size = "default",
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={`${width} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 ${
        variant === "outline"
          ? "border-2 hover:bg-accent/50 hover:border-primary/20 hover:shadow-md"
          : variant === "default"
            ? "shadow-md hover:shadow-lg"
            : ""
      }`}
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>{loadingText || "Loading..."}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {icon && <span className="mr-2 flex items-center">{icon}</span>}
          <span>{text}</span>
        </div>
      )}
    </Button>
  )
}

export function SaveButton({
  className = "",
  loadingText = "Saving...",
  size = "default",
}: {
  className?: string
  loadingText?: string
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="default"
      size={size}
      className={`w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-md hover:shadow-lg ${className}`}
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        <span>Save</span>
      )}
    </Button>
  )
}

// Additional specialized button variants
export function DeleteButton({
  className = "",
  loadingText = "Deleting...",
  size = "default",
}: {
  className?: string
  loadingText?: string
  size?: "default" | "sm" | "lg" | "icon"
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="destructive"
      size={size}
      className={`transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-md hover:shadow-lg ${className}`}
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        <span>Delete</span>
      )}
    </Button>
  )
}

export function CancelButton({
  className = "",
  onClick,
  size = "default",
}: {
  className?: string
  onClick?: () => void
  size?: "default" | "sm" | "lg" | "icon"
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={`transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 hover:bg-accent/50 hover:border-primary/20 hover:shadow-md ${className}`}
      onClick={onClick}
    >
      <span>Cancel</span>
    </Button>
  )
}
