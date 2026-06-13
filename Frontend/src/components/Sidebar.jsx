import {
  Home,
  Clapperboard,
  ThumbsUp,
  UserCircle,
  Upload,
  Compass,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useNav = () => {
  const { user } = useAuth();
  const primary = [{ to: "/", label: "Home", icon: Home, end: true }];
  const you = user
    ? [
        { to: "/subscriptions", label: "Subscriptions", icon: Clapperboard },
        { to: "/liked", label: "Liked Videos", icon: ThumbsUp },
        { to: "/upload", label: "Upload", icon: Upload },
        { to: `/profile/${user._id}`, label: "Your Channel", icon: UserCircle },
      ]
    : [];
  return { user, primary, you };
};

/* ── Desktop rail ───────────────────────────────────────────── */
const Sidebar = () => {
  const { user, primary, you } = useNav();

  return (
    <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r border-white/5 px-3 py-5 md:flex">
      {primary.map((item) => (
        <RailLink key={item.to} {...item} />
      ))}

      {you.length > 0 && (
        <>
          <Divider />
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            You
          </p>
          {you.map((item) => (
            <RailLink key={item.to} {...item} />
          ))}
        </>
      )}

      {!user && (
        <>
          <Divider />
          <div className="rounded-xl border border-line bg-panel/60 p-4">
            <p className="text-sm text-muted">
              Sign in to like videos, subscribe and build playlists.
            </p>
            <NavLink to="/login" className="btn btn-primary mt-3 w-full">
              Sign in
            </NavLink>
          </div>
        </>
      )}

      <Divider />
      <p className="px-3 pt-1 text-xs leading-relaxed text-zinc-600">
        VideoTube · built for learning
      </p>
    </aside>
  );
};

const RailLink = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `group relative flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-white/[0.06] text-white"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span
          className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand transition-opacity ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />
        {Icon && (
          <Icon
            className={`h-[19px] w-[19px] transition-colors ${
              isActive ? "text-brand" : "text-zinc-400 group-hover:text-white"
            }`}
          />
        )}
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const Divider = () => <div className="my-2 h-px bg-white/5" />;

/* ── Mobile bottom bar ──────────────────────────────────────── */
export const MobileNav = () => {
  const { user } = useAuth();

  const items = user
    ? [
        { to: "/", label: "Home", icon: Home, end: true },
        { to: "/subscriptions", label: "Subs", icon: Clapperboard },
        { to: "/upload", label: "Upload", icon: Upload },
        { to: "/liked", label: "Liked", icon: ThumbsUp },
        { to: `/profile/${user._id}`, label: "You", icon: UserCircle },
      ]
    : [
        { to: "/", label: "Home", icon: Home, end: true },
        { to: "/search", label: "Search", icon: Compass },
        { to: "/login", label: "Sign in", icon: UserCircle },
      ];

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-white/5 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 md:hidden">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition ${
              isActive ? "text-brand" : "text-zinc-400 hover:text-white"
            }`
          }
        >
          {Icon && <Icon className="h-5 w-5" />}
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
