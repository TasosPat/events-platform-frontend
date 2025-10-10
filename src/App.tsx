import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import EventsPage from "./pages/Events";
import Navbar from "./components/common/Navbar";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <EventsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
