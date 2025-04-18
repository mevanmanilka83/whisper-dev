"use server";

import { redirect } from "next/navigation";
import { auth } from "../utils/auth";
import { prisma } from "../utils/db";
import { Prisma, TypeOfBoost } from "@prisma/client";
import type { JSONContent } from "@tiptap/react";

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
    return redirect("/api/auth/signin");
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

    return redirect("/");
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

  if (!session?.user) {
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
    return { error: "Failed to create point" };
  }
}

export async function handleBoost(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  const pointId = formData.get("pointId")?.toString().trim();
  const boostDirection = formData.get("boostDirection") as TypeOfBoost;

  if (!pointId) {
    throw new Error("Point ID is required");
  }

  const boost = await prisma.boost.findFirst({
    where: {
      pointId: pointId,
      userId: session.user.id,
    },
  });

  if (boost) {
    if (boost.type === boostDirection) {
      await prisma.boost.delete({
        where: {
          id: boost.id,
        },
      });
    } else {
      await prisma.boost.update({
        where: {
          id: boost.id,
        },
        data: {
          type: boostDirection,
        },
      });
    }
  } else {
    // If no existing boost, create a new one
    await prisma.boost.create({
      data: {
        pointId,
        userId: session.user.id,
        type: boostDirection,
      },
    });
  }
}
