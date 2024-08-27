import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string };
  }
) {
  try {
    const user = await currentUser();
    const { courseId } = params;

    if (!user || !user.id || user.role !== UserRole.ADMIN)
      return new NextResponse("unAuthorized", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) return new NextResponse("Not found", { status: 404 });

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.imgUrl ||
      !course.categoryId ||
      !course.price ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log("[COURSES_ID_PUBLISH_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
