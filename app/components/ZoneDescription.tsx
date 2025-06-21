"use client";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";

import { toast } from "sonner";
import { SaveButton } from "./SubmitButton";

interface ZoneDescriptionProps {
  zoneId: string;
  description: string;
  updateDescription: (formData: FormData) => Promise<any>;
}

export function ZoneDescriptionpage({
  zoneId,
  description,
  updateDescription,
}: ZoneDescriptionProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      const result = await updateDescription(formData);

      if (result.success) {
        toast.success("Success", {
          description: result.message || "Description updated successfully!",
        });
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to update description. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="zoneId" value={zoneId} />
      <div className="space-y-3">
      <Textarea
        placeholder="Add a description for this zone"
        maxLength={100}
        name="description"
        defaultValue={description}
      />

      <SaveButton />
      </div>
    </form>
  );
}
