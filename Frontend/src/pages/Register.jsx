import { useState } from "react";
import { register, login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarFile(file);
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

      // ✅ Auto-login after successful registration
      await login({
        email: formData.email,
        password: formData.password,
      });

      navigate("/"); // Redirect to home/dashboard
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="bg-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Create Account
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 bg-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full p-3 bg-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 bg-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="block text-white mb-1">Upload Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full mb-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 bg-zinc-700 rounded text-white placeholder-zinc-400 focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-3 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <p className="text-sm text-zinc-400 mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
