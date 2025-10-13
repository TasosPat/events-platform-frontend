import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  
  const { isLoggedIn, currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-semibold hover:text-blue-400">
          Eventify
        </Link>
        <Link to="/events" className="hover:text-blue-400">
          Events
        </Link>
         {/* Only show Create Event for staff */}
         {isLoggedIn && currentUser?.role === "staff" && (
          <Link
            to="/events/create"
            className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
          >
            Create Event
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="hover:text-blue-400">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
          <Link
            to="/login"
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Register
          </Link>
          </>
        )}
      </div>
    </nav>
  );
}
