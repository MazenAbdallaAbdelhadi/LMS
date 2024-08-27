import Mux from "@mux/mux-node";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    const { courseId } = params;
    const values = await req.json();

    if (!user || !user.id || user.role !== UserRole.ADMIN)
      return new NextResponse("unAuthorized", { status: 401 });

    const course = await db.course.update({
      where: {
        id: courseId,
        userId: user.id,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
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

    if (!course) return new NextResponse("Not Found", { status: 404 });

    for (let chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await video.assets.delete(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[CHAPTERS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
