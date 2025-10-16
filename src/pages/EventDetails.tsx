import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent, editEvent } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/Field"
import { EditButtons } from "../components/EditButtons"

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
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try{
      await deleteEvent(Number(eventId));
      alert("Event deleted succesfully");
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
      <Field label="Title" name="title" value={formData.title} editMode={editMode} onChange={handleChange} />
<Field label="Description" name="description" value={formData.description} editMode={editMode} onChange={handleChange} textarea />
<Field label="Date" name="date" value={formData.date} editMode={editMode} onChange={handleChange} type="date" />
<Field label="Start Time" name="start_time" value={formData.start_time} editMode={editMode} onChange={handleChange} type="time" />
<Field label="End Time" name="end_time" value={formData.end_time} editMode={editMode} onChange={handleChange} type="time" />
<Field label="Location" name="location" value={formData.location} editMode={editMode} onChange={handleChange} />
<Field label="Price" name="price" value={formData.price} editMode={editMode} onChange={handleChange} type="number" />

      {currentUser?.role === "staff" && 
        (<EditButtons
          editMode={editMode}
          onEdit={() => setEditMode(true)}
          onSave={handleSave}
          onCancel={() => setEditMode(false)}
          onDelete={handleDelete}
          editLabel="Edit Event"
          saveLabel="Save Changes"
          deleteLabel="Delete Event"
        />)}
  </div>
  )
}
