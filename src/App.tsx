import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import EventsPage from "./pages/Events";
import AttendeesPage from "./pages/Attendees";
import Navbar from "./components/common/Navbar";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default function App() {
  const { currentUser } = useAuth();
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <EventsPage />
            </PrivateRoute>
          }
        />
        <Route
        path="/attendances/events/:id"
        element={
        <PrivateRoute>
        <AttendeesPage />
        </PrivateRoute>
  }
/>
<Route
  path="/events/create"
  element={
    <PrivateRoute>
      {currentUser?.role === "staff" ? <CreateEventPage /> : <Navigate to="/events" />}
    </PrivateRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}
