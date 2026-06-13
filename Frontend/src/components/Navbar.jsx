import { Search, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-black text-white border-b border-zinc-800 shadow">
      <Link to="/" className="text-2xl font-extrabold text-red-600 tracking-wide">
        VideoTube
      </Link>

      <form onSubmit={handleSearch} className="flex-1 mx-8 max-w-xl relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search videos..."
          className="w-full py-2 pl-10 pr-4 rounded-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-400" />
      </form>

      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 hover:text-red-500 cursor-pointer" />
        {user ? (
          <>
            <img
              src={user?.avatar || "https://i.pravatar.cc/150"}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover cursor-pointer"
              onClick={() => navigate(`/profile/${user?._id}`)}
            />
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
