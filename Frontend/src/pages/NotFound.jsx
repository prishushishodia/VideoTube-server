import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-8xl font-extrabold text-red-600 mb-6 animate-pulse">404</h1>
      <p className="text-lg text-gray-400 mb-4">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFound;
