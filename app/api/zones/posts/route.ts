import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";

const ITEMS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const [count, data] = await prisma.$transaction([
      prisma.point.count(),
      prisma.point.findMany({
        take: ITEMS_PER_PAGE,
        skip: skip,
        select: {
          title: true,
          createdAt: true,
          id: true,
          textContent: true,
          image: true,
          Boost: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          subName: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Calculate boost count for each post
    const formattedData = data.map((post) => {
      const boostCount = Math.max(
        0,
        post.Boost.reduce((acc, boost) => {
          return boost.type === "Boost" ? acc + 1 : acc - 1;
        }, 0)
      );

      return {
        ...post,
        boostCount,
      };
    });

    return NextResponse.json({ data: formattedData, count });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
