import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(35rem 25rem at 50% 20%, rgba(255,45,85,0.16), transparent 60%)",
        }}
      />
      <h1 className="text-[7rem] font-extrabold leading-none tracking-tighter sm:text-[10rem]">
        <span className="text-gradient">404</span>
      </h1>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">Page not found</h2>
      <p className="mt-3 max-w-sm text-muted">
        The page you're looking for doesn't exist, was moved, or never made it
        to air.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn btn-primary">
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link to="/search" className="btn btn-ghost">
          <Compass className="h-4 w-4" />
          Explore videos
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
