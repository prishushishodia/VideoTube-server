import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  AlertCircle,
} from "lucide-react";
import { register, login } from "../services/authService";
import AuthShell from "../components/AuthShell";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!avatarFile) {
        setError("Avatar file is required");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("avatar", avatarFile);

      await register(formDataToSend);
      await login({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join VideoTube — it only takes a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* avatar uploader */}
        <div className="flex items-center gap-4">
          <label className="group relative cursor-pointer">
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-line bg-panel-2">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera className="h-6 w-6 text-zinc-500" />
              )}
            </span>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white ring-2 ring-ink">
              <Camera className="h-3 w-3" />
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="sr-only"
              required
            />
          </label>
          <div className="text-sm">
            <p className="font-medium text-zinc-200">Profile picture</p>
            <p className="text-muted">Click to upload an avatar (required)</p>
          </div>
        </div>

        <IconInput icon={User} name="fullName" placeholder="Full name" value={formData.fullName} onChange={handleChange} />
        <IconInput icon={AtSign} name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
        <IconInput icon={Mail} name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} />

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
          <input
            type={showPw ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="field pl-11 pr-11"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
};

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
    )}
    <input className="field pl-11" required {...props} />
  </div>
);

export default Register;
