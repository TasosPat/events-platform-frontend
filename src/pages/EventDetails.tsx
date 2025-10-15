import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { useAuth } from "../context/AuthContext";

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const data = await getEventById(Number(eventId));
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleEdit = () => {
    // Navigate to your edit page or open modal
    navigate(`/events/${eventId}/edit`);
  };

  const handleDelete = () => {
    // Placeholder: call delete endpoint later
    if (window.confirm("Are you sure you want to delete this event?")) {
      alert("Event would be deleted here");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2"><strong>Description:</strong> {event.description}</p>
      <p className="mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB")}</p>
      <p className="mb-2"><strong>Start Time:</strong> {new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
      <p className="mb-2"><strong>End Time:</strong> {new Date(`1970-01-01T${event.end_time}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
      <p className="mb-2"><strong>Location:</strong> {event.location}</p>
      {event.price && <p className="mb-2"><strong>Price:</strong> £{event.price}</p>}

      {currentUser?.role === "staff" && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
