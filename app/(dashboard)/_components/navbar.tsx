import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./mobile-sidebar";
import { Suspense } from "react";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <Suspense>
        <NavbarRoutes />
      </Suspense>
    </div>
  );
};

export default Navbar;
