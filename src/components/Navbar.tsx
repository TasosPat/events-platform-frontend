import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  
  const { isLoggedIn, currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
    <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
      {/* Left side: logo + main links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200"
        >
          Eventify
        </Link>
        <Link
          to="/events"
          className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
        >
          Events
        </Link>
        {isLoggedIn && currentUser?.role === "staff" && (
          <Link
            to="/events/create"
            className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900 transition-colors duration-200"
          >
            Create Event
          </Link>
        )}
      </div>
  
      {/* Right side: auth links */}
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
  
  );
}
