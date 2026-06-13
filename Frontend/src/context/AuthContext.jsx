import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await getCurrentUser();
          
          if (res?.user || res?.data?.user) {
            setUser(res?.user || res?.data?.user); // Adjust based on API shape
          } else {
            setUser(null);
            localStorage.removeItem("token");
          }
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
