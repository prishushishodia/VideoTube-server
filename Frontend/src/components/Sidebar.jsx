import { Home, Video, User, Folder } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#1a1a1a] text-white p-6 gap-6 sticky top-0">
      <SidebarLink to="/" icon={<Home size={20} />} label="Home" />
      {user && <SidebarLink to="/subscriptions" icon={<Video size={20} />} label="Subscriptions" />}
      {user && <SidebarLink to={`/profile/${user?._id}`} icon={<User size={20} />} label="Profile" />}
      {user && <SidebarLink to="/liked" icon={<Folder size={20} />} label="Library" />}
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-2 rounded hover:bg-zinc-800 cursor-pointer transition ${
        isActive ? "text-red-500 font-semibold" : "text-white"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
