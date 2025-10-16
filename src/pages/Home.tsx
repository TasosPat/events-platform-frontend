import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/eventService";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // Show only first 3 as a preview
        setEvents(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Eventify 🎉</h1>
      <p className="text-gray-700 mb-6">Find and attend events that matter to you.</p>

      <div className="mb-8">
        {isLoggedIn ? (
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Browse All Events
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Log In to Get Started
          </button>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Featured Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-600">No upcoming events found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-white border border-gray-200 rounded-lg p-4 w-64 shadow hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-700 mb-2">{event.description}</p>
              <small className="text-gray-500">
                {new Date(event.date).toLocaleDateString()} @ {event.start_time}
              </small>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-12 text-gray-500 text-sm">
        © 2025 Eventify. All rights reserved.
      </footer>
    </div>
  );
}
