import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const CoursesPage = async () => {
  const user = await currentUser();

  const courses = await db.course.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
// <Link href="/teacher/create">
//   <Button> New Course</Button>
// </Link>;
