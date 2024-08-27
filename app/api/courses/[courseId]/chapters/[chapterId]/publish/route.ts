import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";


export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string; chapterId: string };
  }
) {
  try {
    const user = await currentUser();
    const { courseId, chapterId } = params;

    if (!user || !user.id || user.role !== UserRole.ADMIN)
      return new NextResponse("unAuthorized", { status: 401 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) return new NextResponse("unAuthorized", { status: 401 });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    });

    if (!chapter) {
      return new NextResponse("chapter not found", { status: 404 });
    }

    if (!chapter.title || !chapter.description || !chapter.videoUrl || !muxData) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        isPublished: true,
      },
    });


    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("[COURSES_CHAPTERS_ID_PUBLISH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
