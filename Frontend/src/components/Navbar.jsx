import { Search, Bell, Upload as UploadIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const Brand = () => (
  <Link to="/" className="flex items-center gap-2 shrink-0">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff5470] to-brand-600 shadow-[0_4px_14px_-4px_rgba(255,45,85,0.7)]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
    <span className="text-xl font-extrabold tracking-tight">
      <span className="text-gradient">Video</span>
      <span className="text-white">Tube</span>
    </span>
  </Link>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="glass sticky top-0 z-30 border-b border-white/5">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
        <Brand />

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="relative mx-auto hidden w-full max-w-xl sm:block"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos…"
            className="w-full rounded-full border border-line bg-panel-2/80 py-2.5 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-brand focus:bg-panel-2 focus:ring-2 focus:ring-brand/20"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* mobile search */}
          <button
            onClick={() => navigate("/search")}
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            <>
              <Link
                to="/upload"
                className="hidden items-center gap-2 rounded-full border border-line bg-panel-2 px-3.5 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-[#25252d] sm:inline-flex"
              >
                <UploadIcon className="h-4 w-4" />
                Upload
              </Link>

              <button
                className="relative grid h-10 w-10 place-items-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-brand" />
              </button>

              <button
                onClick={() => navigate(`/profile/${user?._id}`)}
                className="rounded-full ring-2 ring-transparent transition hover:ring-brand/40"
                aria-label="Your channel"
              >
                <Avatar src={user?.avatar} name={user?.fullName} size="w-9 h-9" />
              </button>

              <button
                onClick={logout}
                className="grid h-10 w-10 place-items-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-brand"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
