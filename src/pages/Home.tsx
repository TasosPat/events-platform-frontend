import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import { EventCard } from "./EventCard";

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data.upcoming.slice(0, 3)); // first 3 upcoming events
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Eventify 🎉
        </h1>
        <p className="text-gray-700 mb-6">
          Find and attend events that matter to you.
        </p>

        {isLoggedIn ? (
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
            aria-label="Browse all events"
          >
            Browse All Events
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
            aria-label="Log in to get started"
          >
            Log In to Get Started
          </button>
        )}
      </section>

      {/* Featured Events */}
      <section aria-labelledby="featured-events">
        <h2
          id="featured-events"
          className="text-2xl font-semibold text-gray-900 mb-4 text-center"
        >
          Featured Events
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-600 text-center">No upcoming events found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {events.map((event) => (
    <div key={event.event_id} className="flex">
      <EventCard
        event={event}
        isAttending={false}
        handleToggleAttendance={() => {
          if (!isLoggedIn) navigate("/login");
        }}
        handleShowAttendees={() => {}}
        addToGoogleCalendar={() => {}}
        handleViewDetails={() => {}}
        isPreview
      />
    </div>
  ))}
</div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm text-center">
        © 2025 Eventify. All rights reserved.
      </footer>
    </main>
  );
}
