import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    const { courseId } = params;
    const {title} = await req.json();

    if (!user || !user.id || user.role !== UserRole.ADMIN)
      return new NextResponse("unAuthorized", { status: 401 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) return new NextResponse("unAuthorized", { status: 401 });

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPostion = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
        data:{
            title,
            courseId: courseId,
            position: newPostion
        }
    })

    return NextResponse.json(chapter);

  } catch (error) {
    console.log("[CHAPTERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
