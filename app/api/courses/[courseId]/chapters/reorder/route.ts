import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    const { courseId } = params;

    if (!user || !user.id)
      return new NextResponse("unAuthorized", { status: 401 });

    const { list } = await req.json();

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: user.id,
      },
    });

    if (!courseOwner) return new NextResponse("unAuthorized", { status: 401 });

    for(let item of list){
        await db.chapter.update({
            where: {id: item.id},
            data: {position: item.position}
        })
    }

    return new NextResponse("Success", { status: 200})
  } catch (error) {
    console.log("[CHAPTERS_REORDER_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
