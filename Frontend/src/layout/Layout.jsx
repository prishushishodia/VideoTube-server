import Sidebar, { MobileNav } from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen text-zinc-100">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 md:pb-10">
          {/* key on route → re-trigger entrance animation per page */}
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
