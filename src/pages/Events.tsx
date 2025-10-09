import { useEffect, useState } from "react";
import { getEvents, attendEvent } from "../services/eventService";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const handleAttend = async (id: number) => {
    console.log("Token:", localStorage.getItem("token"));
    await attendEvent(id);
    alert("Attendance created!");
  };

  return (
    <div>
      <h2>Events</h2>
      {events.map((event) => (
        <div key={event.event_id}>
          <h3>{event.name}</h3>
          <p>{event.description}</p>
          <button onClick={() => handleAttend(event.event_id)}>Attend</button>
        </div>
      ))}
    </div>
  );
}
