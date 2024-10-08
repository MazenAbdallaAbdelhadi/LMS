"use client";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@prisma/client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "./ui/button";
import { SearchInput } from "./search-inpute";
import { useCurrentRole } from "@/hooks/use-current-role";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const role = useCurrentRole();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : role === UserRole.ADMIN ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}

        <UserButton />
      </div>
    </>
  );
};

export default NavbarRoutes;
