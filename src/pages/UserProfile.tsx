import { useEffect, useState } from "react";
import { getMyAttendances } from "../services/userService";
import { unattendEvent } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const { currentUser } = useAuth();
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        const myAttendances = await getMyAttendances(currentUser.user_id);
        setAttendingEvents(myAttendances);
      } catch (err) {
        console.error("Error fetching attendances:", err);
      }
    };
    fetchData();
  }, [currentUser]);

  const handleCancelAttendance = async (eventId: number) => {
    try {
      await unattendEvent(eventId);
      setAttendingEvents(prev => prev.filter(e => e.event_id !== eventId));
    } catch (err) {
      console.error("Error cancelling attendance:", err);
      alert("Failed to cancel attendance");
    }
  };

  if (!currentUser) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>

      <div className="mb-6">
        <p><strong>Name:</strong> {currentUser.name || "N/A"}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        {currentUser.description && (<p><strong>Description:</strong> {currentUser.description}</p>)}
        <p><strong>Role:</strong> {currentUser.role}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Events You're Attending:</h2>
      {attendingEvents.length === 0 && <p>You are not attending any events.</p>}

      <ul>
        {attendingEvents.map((event) => (
          <li key={event.event_id} className="mb-4 p-3 border rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString("en-GB")} {new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}-{new Date(`1970-01-01T${event.end_time}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
              <p className="text-sm">{event.location}</p>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleCancelAttendance(event.event_id)}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
