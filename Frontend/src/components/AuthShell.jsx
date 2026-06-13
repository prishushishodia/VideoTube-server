import { Link } from "react-router-dom";
import { Play, Heart, ListVideo, Users } from "lucide-react";

const perks = [
  { icon: Play, text: "Stream videos in a clean, distraction-free player" },
  { icon: Users, text: "Subscribe to channels you love" },
  { icon: Heart, text: "Like and save videos to your library" },
  { icon: ListVideo, text: "Organise everything into playlists" },
];

/** Branded two-column wrapper shared by Login & Register. */
const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    {/* Brand panel */}
    <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(40rem 30rem at 20% 10%, rgba(255,45,85,0.22), transparent 60%), radial-gradient(35rem 30rem at 90% 90%, rgba(124,92,255,0.18), transparent 55%), #0c0c10",
        }}
      />
      <Link to="/" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5470] to-brand-600">
          <Play className="h-4 w-4 fill-white text-white" />
        </span>
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-gradient">Video</span>Tube
        </span>
      </Link>

      <div>
        <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight">
          Your stage for{" "}
          <span className="text-gradient">every story</span> worth watching.
        </h2>
        <ul className="mt-8 space-y-4">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-zinc-300">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                {Icon && <Icon className="h-4 w-4 text-brand" />}
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-zinc-500">
        Built for learning · VideoTube © {new Date().getFullYear()}
      </p>
    </aside>

    {/* Form panel */}
    <main className="flex items-center justify-center px-5 py-10 sm:px-8">
      <div className="w-full max-w-md animate-fade-up">
        {/* mobile brand */}
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 lg:hidden"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff5470] to-brand-600">
            <Play className="h-4 w-4 fill-white text-white" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-gradient">Video</span>Tube
          </span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}

        <div className="mt-8">{children}</div>

        {footer && (
          <p className="mt-8 text-center text-sm text-muted">{footer}</p>
        )}
      </div>
    </main>
  </div>
);

export default AuthShell;
