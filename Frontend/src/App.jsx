import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import LikedVideos from "./pages/LikedVideos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PlaylistDetail from "./pages/PlaylistDetail";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Subscriptions from "./pages/Subscriptions";
import Upload from "./pages/Upload";
import VideoDetail from "./pages/VideoDetail";
import { useAuth } from "./context/AuthContext";

const Splash = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-5">
    <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff5470] to-brand-600 shadow-[0_10px_40px_-8px_rgba(255,45,85,0.7)]">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
    <span className="text-lg font-extrabold tracking-tight">
      <span className="text-gradient">Video</span>
      <span className="text-white">Tube</span>
    </span>
  </div>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) return <Splash />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      {/* App shell */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/liked"
          element={user ? <LikedVideos /> : <Navigate to="/login" />}
        />
        <Route
          path="/subscriptions"
          element={user ? <Subscriptions /> : <Navigate to="/login" />}
        />
        <Route path="/search" element={<Search />} />
        <Route
          path="/upload"
          element={user ? <Upload /> : <Navigate to="/login" />}
        />
        <Route
          path="/video/:id"
          element={user ? <VideoDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/playlist/:id"
          element={user ? <PlaylistDetail /> : <Navigate to="/login" />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
