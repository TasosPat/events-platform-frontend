import { useEffect, useState } from "react";
import { getEvents, attendEvent, unattendEvent, addEventToCalendar } from "../services/eventService";
import { getCurrentUser, getMyAttendances } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { handleAddToGoogleCalendar } from "../components/googleCalendarHandler"
import { EventCard } from "./EventCard";

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
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
        setUpcomingEvents(eventsData.upcoming);
        setPastEvents(eventsData.past);
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

  const handleViewDetails = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };
  

return (
  <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Upcoming Events */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Upcoming Events</h2>
      {upcomingEvents.length === 0 ? (
        <p className="text-gray-600 text-center">No upcoming events found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              isAttending={attendingIds.includes(event.event_id)}
              handleToggleAttendance={handleToggleAttendance}
              handleShowAttendees={handleShowAttendees}
              handleViewDetails={handleViewDetails}
              addToGoogleCalendar={handleAddToGoogleCalendar}
            />
          ))}
        </div>
      )}

      {/* Past Events */}
      <h2 className="text-3xl font-bold text-gray-900 my-6 text-center">Past Events</h2>
      {pastEvents.length === 0 ? (
        <p className="text-gray-600 text-center">No past events yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              isAttending={attendingIds.includes(event.event_id)}
              handleToggleAttendance={handleToggleAttendance}
              handleShowAttendees={handleShowAttendees}
              handleViewDetails={handleViewDetails}
              addToGoogleCalendar={handleAddToGoogleCalendar}
            />
          ))}
        </div>
      )}
    </div>
);
}
