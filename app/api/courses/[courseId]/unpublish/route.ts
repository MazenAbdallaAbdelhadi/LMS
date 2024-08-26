import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
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

    if (!user || !user.id)
      return new NextResponse("unAuthorized", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!course) return new NextResponse("Not found", { status: 404 });

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log("[COURSES_ID_UNPUBLISH_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
