import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });
      
      // Save token to localStorage
      localStorage.setItem("token", res?.data?.accessToken);

      // Update user state in AuthContext
      setUser(res?.data?.user);

      // Redirect to homepage
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-[#141414] rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Sign In
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <p className="mt-6 text-sm text-gray-400 text-center">
          New here?{" "}
          <a href="/register" className="text-red-500 hover:underline">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
