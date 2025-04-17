"use client";

import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/app/components/SubmitButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createZone } from "@/app/actions/actions";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type ActionState = {
  message: string;
  error: boolean;
  zoneId?: string;
};

const initialState: ActionState = {
  message: "",
  error: false,
};

export default function Page() {
  const { status } = useSession();
  const router = useRouter();
  const [state, formAction] = useFormState(createZone, initialState);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    if (state.message) {
      if (!state.error && state.zoneId) {
        toast.success("Success", {
          description: state.message || "Zone created successfully!",
        });
        // Add a small delay before navigation to ensure toast is visible
        setTimeout(() => {
          router.push(`/zone/${state.zoneId}`);
        }, 500);
      } else {
        toast.error("Error", {
          description:
            state.message || "Failed to create zone. Please try again.",
        });
      }
    }
  }, [state, router]);

  if (status === "loading") {
    return (
      <div className="max-w-[900px] mx-auto flex flex-col mt-8 px-4 md:px-0">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto flex flex-col mt-8 px-4 md:px-0">
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">
        Setup your Zone
      </h1>
      <Separator className="my-6" />
      <form className="space-y-6" action={formAction}>
        <div className="space-y-4">
          <label htmlFor="name" className="text-base font-medium mb-2 block">
            Zone Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/70 transition-all"
            placeholder="Enter zone name"
            minLength={2}
            maxLength={21}
            required
          />
          <p className="text-sm text-destructive">{state.message}</p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          e
          <SubmitButton text="Create Zone" />
        </div>
      </form>
    </div>
  );
}
