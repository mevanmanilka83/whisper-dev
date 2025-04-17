"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  width?: string;
  icon?: React.ReactNode;
}

export default function SubmitButton({
  text,
  variant,
  width,
  icon,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button variant={variant} className={width} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span className="sr-only">Submitting...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
}

export function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="default"
      className="w-full mt-2"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          <span className="sr-only">Please wait...</span>
        </>
      ) : (
        <>Save</>
      )}
    </Button>
  );
}
