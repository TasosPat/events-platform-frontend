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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Eventify 🎉</h1>
      <p>Find and attend events that matter to you.</p>

      <div style={{ margin: "2rem 0" }}>
        {isLoggedIn ? (
          <button onClick={() => navigate("/events")}>Browse All Events</button>
        ) : (
          <button onClick={() => navigate("/login")}>Log In to Get Started</button>
        )}
      </div>

      <h2>Featured Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          {events.map((event) => (
            <div
              key={event.event_id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "1rem",
                width: "250px",
              }}
            >
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <small>
                {new Date(event.date).toLocaleDateString()} @ {event.time}
              </small>
            </div>
          ))}
        </div>
      )}

      <footer style={{ marginTop: "3rem", fontSize: "0.9rem", color: "#666" }}>
        © 2025 Eventify. All rights reserved.
      </footer>
    </div>
  );
}
