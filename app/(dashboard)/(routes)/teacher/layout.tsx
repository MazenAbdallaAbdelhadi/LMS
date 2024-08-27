import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const role = await currentRole();

  if (role !== UserRole.ADMIN) return redirect("/");

  return <>{children}</>;
};

export default TeacherLayout;
