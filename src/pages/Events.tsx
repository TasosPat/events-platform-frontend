import { useEffect, useState } from "react";
import { getEvents, attendEvent, unattendEvent, addEventToCalendar } from "../services/eventService";
import { getCurrentUser, getMyAttendances } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { handleAddToGoogleCalendar } from "../components/googleCalendarHandler"

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-600 text-center">No upcoming events found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => {
            const isAttending = attendingIds.includes(event.event_id);
            return (
              <div
                key={event.event_id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-700 mb-2">{event.description}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    {new Date(event.date).toLocaleDateString()} @ {event.start_time} - {event.end_time}
                  </p>
                  <p className="text-gray-700 font-medium mb-2">
                    {event.price ? `£${event.price}` : "Free"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/events/${event.event_id}`)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleToggleAttendance(event.event_id)}
                    className={`px-3 py-1 rounded transition-colors duration-200 ${
                      isAttending
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {isAttending ? "Unattend" : "Attend"}
                  </button>

                  <button
                    onClick={() => handleShowAttendees(event.event_id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    View Attendees
                  </button>

                  {isAttending && (
                    <button
                      onClick={() => handleAddToGoogleCalendar(event)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Add to Google Calendar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
