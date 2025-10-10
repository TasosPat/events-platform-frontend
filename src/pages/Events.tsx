import { useEffect, useState } from "react";
import { getEvents, attendEvent, unattendEvent } from "../services/eventService";
import { getCurrentUser, getMyAttendances } from "../services/userService";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [attendingIds, setAttendingIds] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchData = async() => {
      try {
        const user = await getCurrentUser();

        const [eventsData, myAttendances] = await Promise.all([
            getEvents(),
            getMyAttendances(user.user_id),
          ]);

        setEvents(eventsData);
        setAttendingIds(myAttendances.map((e: any) => e.event_id));
      } catch (err) {
        console.error("Error fetching events or attendances:", err);
      }
    }

    fetchData();
  }, []);

  const handleToggleAttendance = async (eventId: number) => {
    try {
      if (attendingIds.includes(eventId)) {
        await unattendEvent(eventId);
        setAttendingIds(prev => prev.filter(id => id !== eventId));
      } else {
        await attendEvent(eventId);
        setAttendingIds(prev => [...prev, eventId]);
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h2>Events</h2>
      {events.map((event) => {
        const isAttending = attendingIds.includes(event.event_id);
        return (
          <div key={event.event_id}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <button onClick={() => handleToggleAttendance(event.event_id)}>{isAttending ? "Unattend" : "Attend"}</button>
          </div>
        )
      })}
    </div>
  );
}
