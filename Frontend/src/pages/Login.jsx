import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res?.data?.accessToken);
      setUser(res?.data?.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("aarav.sharma@example.com");
    setPassword("Test@1234");
    setError("");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          New to VideoTube?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Create an account
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

        <Field
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Password"
            className="field pl-11 pr-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={fillDemo}
        className="mt-4 w-full rounded-xl border border-dashed border-line py-2.5 text-xs text-muted transition hover:border-brand/40 hover:text-zinc-300"
      >
        Use a demo account · aarav.sharma@example.com / Test@1234
      </button>
    </AuthShell>
  );
};

const Field = ({ icon: Icon, type, placeholder, value, onChange, ...rest }) => (
  <div className="relative">
    {Icon && (
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
    )}
    <input
      type={type}
      placeholder={placeholder}
      className="field pl-11"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      {...rest}
    />
  </div>
);

export default Login;
