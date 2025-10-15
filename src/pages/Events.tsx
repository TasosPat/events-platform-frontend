import { useEffect, useState } from "react";
import { getEvents, attendEvent, unattendEvent, addEventToCalendar } from "../services/eventService";
import { getCurrentUser, getMyAttendances } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [attendingIds, setAttendingIds] = useState<number[]>([]);
  const navigate = useNavigate();
  
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

  const handleShowAttendees = (eventId: number) => {
    navigate(`/attendances/events/${eventId}`);
  };
  
  const addToGoogleCalendar = async (event: any) => {
    try {
      const eventId = event.event_id;
      const res = await addEventToCalendar(eventId);
      console.log("Response from backend:", res); 
      const url = res.url;
  
      if (url) {
        window.open(url, "_blank");
        alert(`Added "${event.title}" to your Google Calendar!`);
      } else {
        alert("Could not get Google Calendar link");
      }
      
    }
    catch (err) {
    console.error("Failed to get Google auth URL:", err);
    alert("Something went wrong while adding to calendar");
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
            <button onClick={() => navigate(`/events/${event.event_id}`)}>
              View Details
            </button>
            <button onClick={() => handleToggleAttendance(event.event_id)}>{isAttending ? "Unattend" : "Attend"}</button>
            <button onClick={() => handleShowAttendees(event.event_id)}>View Attendees</button>
            {isAttending && (<button onClick={() => addToGoogleCalendar(event)}>Add to Calendar</button>)}
          </div>
        )
      })}
    </div>
  );
}
