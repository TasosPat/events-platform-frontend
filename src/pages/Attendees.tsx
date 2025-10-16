import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventAttendees, getEventById } from "../services/eventService";
import { useAuth } from "../context/AuthContext";

export default function AttendeesPage() {
    const { currentUser } = useAuth();
  const { id } = useParams();
  const [attendees, setAttendees] = useState<any[]>([]);
  const [eventName, setEventName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendeeData, eventData] = await Promise.all([
          getEventAttendees(Number(id)),
          getEventById(Number(id)), // optional if you want event name
        ]);
        setAttendees(attendeeData);
        setEventName(eventData?.title || "");
      } catch (err) {
        console.error("Error loading attendees:", err);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
      Attendees for {eventName}
    </h1>

    {attendees.length === 0 ? (
      <p className="text-gray-600 text-center">No attendees yet.</p>
    ) : (
      <ul className="space-y-3">
        {attendees.map(a => (
          <li
            key={a.user_id}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow flex justify-between items-center"
          >
            <span className="text-gray-800 font-medium">{a.name}</span>
            {currentUser && a.user_id === currentUser.user_id && (
              <span className="text-gray-500 text-sm">(You)</span>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
  );
}
