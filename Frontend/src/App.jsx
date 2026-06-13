import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center text-white mt-10">Loading...</div>;

  return (

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/liked" element={user ? <LikedVideos /> : <Navigate to="/login" />} />
          <Route path="/subscriptions" element={user ? <Subscriptions /> : <Navigate to="/login" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/video/:id" element={user ? <VideoDetail /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/playlist/:id" element={user ? <PlaylistDetail /> : <Navigate to="/login" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>

  );
}

export default App;
