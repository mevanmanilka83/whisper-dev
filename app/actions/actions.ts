"use server";

import { redirect } from "next/navigation";
import { auth } from "../utils/auth";
import { prisma } from "../utils/db";
import { Prisma, TypeOfBoost } from "@prisma/client";
import type { JSONContent } from "@tiptap/react";
import { revalidatePath } from "next/cache";

type ActionState = {
  message: string;
  error: boolean;
  zoneId?: string;
};

export async function createZone(prevState: ActionState, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  try {
    const name = formData.get("name")?.toString().trim();

    if (!name) {
      throw new Error("Zone name is required.");
    }

    if (!session.user.id) {
      throw new Error("User ID is required.");
    }

    const zone = await prisma.zone.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return {
      message: "Zone created successfully!",
      error: false,
      zoneId: zone.name,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          message: "Zone name already exists.",
          error: true,
        };
      }
    }
    throw e;
  }
}

export async function deleteZone(prevState: ActionState, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return {
      message: "Not authenticated",
      error: true,
    };
  }

  try {
    const zoneId = formData.get("zoneId")?.toString().trim();

    if (!zoneId) {
      throw new Error("Zone ID is required.");
    }

    const existingZone = await prisma.zone.findUnique({
      where: { id: zoneId },
    });

    if (!existingZone || existingZone.userId !== session.user.id) {
      throw new Error("Zone not found or access denied");
    }

    await prisma.zone.delete({
      where: {
        id: zoneId,
      },
    });

    return {
      message: "Zone deleted successfully",
      error: false,
    };
  } catch (e) {
    console.error(e);
    return {
      message: "Failed to delete zone",
      error: true,
    };
  }
}

export async function updateZone(prevState: ActionState, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  try {
    const zoneId = formData.get("zoneId")?.toString().trim();
    const name = formData.get("name")?.toString().trim();

    if (!zoneId || !name) {
      throw new Error("Zone ID and name are required.");
    }

    const existingZone = await prisma.zone.findUnique({
      where: { id: zoneId },
    });

    if (!existingZone || existingZone.userId !== session.user.id) {
      throw new Error("Zone not found or access denied");
    }

    await prisma.zone.update({
      where: {
        id: zoneId,
      },
      data: {
        name,
      },
    });

    return redirect("/");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          message: "You already have a zone with this name.",
          error: true,
        };
      }
    }
    console.error(e);
    return {
      message: "Failed to update zone",
      error: true,
    };
  }
}

export async function updateDescription(
  prevState: ActionState,
  formData: FormData
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  try {
    const description = formData.get("description")?.toString().trim();
    const zoneId = formData.get("zoneId")?.toString().trim();

    if (!description || !zoneId) {
      throw new Error("Zone ID and description are required.");
    }

    const existingZone = await prisma.zone.findUnique({
      where: { id: zoneId },
    });

    if (!existingZone || existingZone.userId !== session.user.id) {
      throw new Error("Zone not found or access denied");
    }

    await prisma.zone.update({
      where: {
        id: zoneId,
      },
      data: {
        description,
      },
    });

    return {
      success: true,
      message: "Description updated successfully",
    };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update description" };
  }
}

export async function createPoint(
  data: { jsonContent: JSONContent | null },
  formData: FormData
): Promise<{ error?: string; success?: boolean; pointId?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/api/auth/signin");
  }

  try {
    const title = formData.get("title")?.toString().trim() || "Untitled";
    const imageUrl = formData.get("imageUrl")?.toString() || null;
    const zoneName = formData.get("zoneId")?.toString() || null;
    const subName = formData.get("subName")?.toString() || null;

    if (!zoneName) {
      throw new Error("Zone name is required.");
    }

    const zone = await prisma.zone.findUnique({
      where: { name: zoneName },
    });

    if (!zone) {
      throw new Error(`Zone with name ${zoneName} not found.`);
    }

    // Check if user is a member of the zone
    const membership = await prisma.zoneMember.findUnique({
      where: {
        userId_zoneId: {
          userId: session.user.id,
          zoneId: zone.id,
        },
      },
    });

    // Check if user is the zone owner
    const isZoneOwner = zone.userId === session.user.id;

    if (!membership && !isZoneOwner) {
      throw new Error("You must be a member of this zone to create points. Please join the zone first.");
    }

    const point = await prisma.point.create({
      data: {
        title,
        textContent: data.jsonContent ? JSON.stringify(data.jsonContent) : null,
        image: imageUrl,
        subName,
        userId: session.user.id,
        zoneId: zone.id,
      },
    });

    return {
      success: true,
      pointId: point.id,
    };
  } catch (e) {
    console.error("Error creating point:", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          error: "A point with this title already exists in this zone.",
        };
      }
    }
    return { error: e instanceof Error ? e.message : "Failed to create point" };
  }
}

export async function handleBoost(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  const pointId = formData.get("pointId")?.toString().trim();
  const boostDirection = formData
    .get("boostDirection")
    ?.toString() as TypeOfBoost;

  if (!pointId || (boostDirection !== "Boost" && boostDirection !== "Reduce")) {
    throw new Error("Invalid boost parameters");
  }

  try {
    // Get the current user's existing boost/reduce action
    const existingBoost = await prisma.boost.findFirst({
      where: {
        pointId: pointId,
        userId: session.user.id,
      },
    });

    // Count all existing boosts and reduces for this point
    const boostCount = await prisma.boost.count({
      where: {
        pointId: pointId,
        type: "Boost",
      },
    });

    const reduceCount = await prisma.boost.count({
      where: {
        pointId: pointId,
        type: "Reduce",
      },
    });

    // Calculate the current net count
    let netCount = boostCount - reduceCount;

    // Handle existing user action
    if (existingBoost) {
      // Clicking the same button again - toggle off
      if (existingBoost.type === boostDirection) {
        await prisma.boost.delete({
          where: { id: existingBoost.id },
        });
      }
      // Switching from Boost to Reduce
      else if (existingBoost.type === "Boost" && boostDirection === "Reduce") {
        // Adjust net count to exclude the user's existing boost
        netCount = netCount - 1;

        // If the reduced count would be negative, just remove the boost
        if (netCount <= 0) {
          await prisma.boost.delete({
            where: { id: existingBoost.id },
          });
        }
        // Otherwise, update to Reduce
        else {
          await prisma.boost.update({
            where: { id: existingBoost.id },
            data: { type: "Reduce" },
          });
        }
      }
      // Switching from Reduce to Boost (always allowed)
      else {
        await prisma.boost.update({
          where: { id: existingBoost.id },
          data: { type: "Boost" },
        });
      }
    }
    // No existing action from this user
    else {
      // Prevent Reduce if it would make the count negative
      if (boostDirection === "Reduce" && netCount <= 0) {
        // Do nothing, don't allow reducing below zero
      }
      // Create a new boost/reduce action
      else {
        await prisma.boost.create({
          data: {
            pointId,
            userId: session.user.id,
            type: boostDirection,
          },
        });
      }
    }

    // Refresh the UI
    revalidatePath("/");
  } catch (error) {
    console.error("Error handling boost/reduce action:", error);
    revalidatePath("/");
  }
}

export async function joinZone(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/api/auth/signin");
  }

  try {
    const zoneName = formData.get("zoneName")?.toString().trim();

    if (!zoneName) {
      throw new Error("Zone name is required.");
    }

    const zone = await prisma.zone.findUnique({
      where: { name: zoneName },
    });

    if (!zone) {
      throw new Error(`Zone with name ${zoneName} not found.`);
    }

    // Check if user is already a member
    const existingMembership = await prisma.zoneMember.findUnique({
      where: {
        userId_zoneId: {
          userId: session.user.id,
          zoneId: zone.id,
        },
      },
    });

    if (existingMembership) {
      return { error: "You are already a member of this zone." };
    }

    // Create membership
    await prisma.zoneMember.create({
      data: {
        userId: session.user.id,
        zoneId: zone.id,
      },
    });

    return {
      success: true,
      message: `Successfully joined ${zoneName}!`,
    };
  } catch (e) {
    console.error("Error joining zone:", e);
    return { error: e instanceof Error ? e.message : "Failed to join zone" };
  }
}

export async function leaveZone(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/api/auth/signin");
  }

  try {
    const zoneName = formData.get("zoneName")?.toString().trim();

    if (!zoneName) {
      throw new Error("Zone name is required.");
    }

    const zone = await prisma.zone.findUnique({
      where: { name: zoneName },
    });

    if (!zone) {
      throw new Error(`Zone with name ${zoneName} not found.`);
    }

    // Check if user is the zone owner
    if (zone.userId === session.user.id) {
      return { error: "Zone owners cannot leave their own zone." };
    }

    // Check if user is a member
    const membership = await prisma.zoneMember.findUnique({
      where: {
        userId_zoneId: {
          userId: session.user.id,
          zoneId: zone.id,
        },
      },
    });

    if (!membership) {
      return { error: "You are not a member of this zone." };
    }

    // Remove membership
    await prisma.zoneMember.delete({
      where: {
        id: membership.id,
      },
    });

    return {
      success: true,
      message: `Successfully left ${zoneName}.`,
    };
  } catch (e) {
    console.error("Error leaving zone:", e);
    return { error: e instanceof Error ? e.message : "Failed to leave zone" };
  }
}
