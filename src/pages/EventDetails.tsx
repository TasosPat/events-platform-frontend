import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent, editEvent } from "../services/eventService";
import { useAuth } from "../context/AuthContext";

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    price: 0  
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const data = await getEventById(Number(eventId));
        setEvent(data);
        setFormData({
          title: data.title,
          description: data.description,
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
          location: data.location,
          price: data.price, 
          start_time: data.start_time,
          end_time: data.end_time, 
      })
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const parsedValue = name === "price" ? Number(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await editEvent(formData, Number(eventId));
      setEvent(updated.event)
      setEditMode(false);
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) return;
    try{
      await deleteEvent(Number(eventId));
      alert("Event would be deleted here");
      navigate("/events");
    } catch(err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow">
      {editMode ? (<input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />) : (<h1 className="text-3xl font-bold mb-4">{event.title}</h1>)}
      {editMode ? (<input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />) : (<p className="mb-2"><strong>Description:</strong> {event.description}</p>)}
      {editMode ? (<input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />) : (<p className="mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB")}</p>)}
      {editMode ? (<input
              type="time"
              name="startTime"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />) : (<p className="mb-2"><strong>Start Time:</strong> {new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>)}
      {editMode ? (<input
              type="time"
              name="endTime"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />) : (<p className="mb-2"><strong>End Time:</strong> {new Date(`1970-01-01T${event.end_time}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>)}
      {editMode ? (<input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />) : (<p className="mb-2"><strong>Location:</strong> {event.location}</p>)}
      {editMode ? (<input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />) :  (<p className="mb-2"><strong>Price:</strong> £{event.price || "Free"}</p>)}

      {currentUser?.role === "staff" && 
        (<div className="mt-6 flex gap-4">
           {!editMode ? (
            <>
           <button
            onClick={() => setEditMode(true)}
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
          </>
           ) : ( 
      <>
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
      <button
        onClick={() => setEditMode(false)}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Cancel
      </button>
    </>
  )} 
    </div>
  )}
  </div>
  )
}
