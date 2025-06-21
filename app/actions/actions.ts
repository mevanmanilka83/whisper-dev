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

    // Validate zone name format
    if (name.includes(" ")) {
      return {
        message: "Zone name cannot contain spaces. Use hyphens or underscores instead.",
        error: true,
      };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return {
        message: "Zone name can only contain letters, numbers, hyphens, and underscores.",
        error: true,
      };
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
      zoneId: zone.name, // Return the zone name for URL-friendly routing
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

export async function sendCollaborationInvite(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/api/auth/signin");
  }

  try {
    const zoneName = formData.get("zoneName")?.toString().trim();
    const inviteeEmail = formData.get("inviteeEmail")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!zoneName || !inviteeEmail) {
      throw new Error("Zone name and invitee email are required.");
    }

    // Find the zone
    const zone = await prisma.zone.findUnique({
      where: { name: zoneName },
    });

    if (!zone) {
      throw new Error(`Zone with name ${zoneName} not found.`);
    }

    // Check if user is the zone owner
    if (zone.userId !== session.user.id) {
      throw new Error("Only zone owners can send collaboration invites.");
    }

    // Find the invitee by email
    const invitee = await prisma.user.findUnique({
      where: { email: inviteeEmail },
    });

    if (!invitee) {
      throw new Error(`User with email ${inviteeEmail} not found.`);
    }

    // Check if invitee is already a member
    const existingMembership = await prisma.zoneMember.findUnique({
      where: {
        userId_zoneId: {
          userId: invitee.id,
          zoneId: zone.id,
        },
      },
    });

    if (existingMembership) {
      throw new Error("User is already a member of this zone.");
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.zoneInvitation.findUnique({
      where: {
        zoneId_inviteeId: {
          zoneId: zone.id,
          inviteeId: invitee.id,
        },
      },
    });

    if (existingInvitation && existingInvitation.status === "PENDING") {
      throw new Error("An invitation is already pending for this user.");
    }

    // Create invitation
    await prisma.zoneInvitation.create({
      data: {
        zoneId: zone.id,
        inviterId: session.user.id,
        inviteeId: invitee.id,
        message: message || null,
      },
    });

    return {
      success: true,
      message: `Collaboration invite sent to ${inviteeEmail}!`,
    };
  } catch (e) {
    console.error("Error sending collaboration invite:", e);
    return { error: e instanceof Error ? e.message : "Failed to send collaboration invite" };
  }
}

export async function requestToJoinZone(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/api/auth/signin");
  }

  try {
    const zoneName = formData.get("zoneName")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

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
      throw new Error("You are already a member of this zone.");
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.zoneInvitation.findUnique({
      where: {
        zoneId_inviteeId: {
          zoneId: zone.id,
          inviteeId: session.user.id,
        },
      },
    });

    if (existingInvitation && existingInvitation.status === "PENDING") {
      throw new Error("You already have a pending request for this zone.");
    }

    // Create a join request. The user is both the inviter and invitee,
    // which signifies a request about themselves for the zone owner to review.
    await prisma.zoneInvitation.create({
      data: {
        zoneId: zone.id,
        inviterId: session.user.id,
        inviteeId: session.user.id,
        message: message || null,
      },
    });

    return {
      success: true,
      message: `Join request sent to zone owner!`,
    };
  } catch (e) {
    console.error("Error requesting to join zone:", e);
    return { error: e instanceof Error ? e.message : "Failed to request to join zone" };
  }
}

export async function acceptInvitation(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/api/auth/signin");
  }

  try {
    const invitationId = formData.get("invitationId")?.toString().trim();

    if (!invitationId) {
      throw new Error("Invitation ID is required.");
    }

    const invitation = await prisma.zoneInvitation.findUnique({
      where: { id: invitationId },
      include: {
        zone: true,
        inviter: true,
        invitee: true,
      },
    });

    if (!invitation) {
      throw new Error("Invitation not found.");
    }

    // Check if user is the invitee or zone owner
    const isInvitee = invitation.inviteeId === session.user.id;
    const isZoneOwner = invitation.zone.userId === session.user.id;

    if (!isInvitee && !isZoneOwner) {
      throw new Error("You are not authorized to accept this invitation.");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("This invitation is no longer pending.");
    }

    // Update invitation status
    await prisma.zoneInvitation.update({
      where: { id: invitationId },
      data: { status: "ACCEPTED" },
    });

    // Create membership
    await prisma.zoneMember.create({
      data: {
        userId: invitation.inviteeId,
        zoneId: invitation.zoneId,
        role: "COLLABORATOR",
      },
    });

    return {
      success: true,
      message: "Invitation accepted! You are now a collaborator.",
    };
  } catch (e) {
    console.error("Error accepting invitation:", e);
    return { error: e instanceof Error ? e.message : "Failed to accept invitation" };
  }
}

export async function declineInvitation(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/api/auth/signin");
  }

  try {
    const invitationId = formData.get("invitationId")?.toString().trim();

    if (!invitationId) {
      throw new Error("Invitation ID is required.");
    }

    const invitation = await prisma.zoneInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new Error("Invitation not found.");
    }

    // Check if user is the invitee or zone owner
    const isInvitee = invitation.inviteeId === session.user.id;
    const isZoneOwner = invitation.zoneId === session.user.id;

    if (!isInvitee && !isZoneOwner) {
      throw new Error("You are not authorized to decline this invitation.");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("This invitation is no longer pending.");
    }

    // Update invitation status
    await prisma.zoneInvitation.update({
      where: { id: invitationId },
      data: { status: "DECLINED" },
    });

    return {
      success: true,
      message: "Invitation declined.",
    };
  } catch (e) {
    console.error("Error declining invitation:", e);
    return { error: e instanceof Error ? e.message : "Failed to decline invitation" };
  }
}

// Update existing joinZone function to work with new system
export async function joinZone(formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  return requestToJoinZone(formData);
}

// Update existing leaveZone function
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

