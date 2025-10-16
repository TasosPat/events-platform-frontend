import { useEffect, useState } from "react";
import { getMyAttendances, updateUser } from "../services/userService";
import { unattendEvent } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/Field"
import { EditButtons } from "../components/EditButtons"

export default function UserProfilePage() {
  const { currentUser, setCurrentUser } = useAuth();
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    description: "",
});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        setFormData({
            displayName: currentUser.name || "",
            email: currentUser.email || "",
            description: currentUser.description || ""
          });
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await updateUser({
        displayName: formData.displayName,
        email: formData.email,
        description: formData.description,
      });
      alert("Profile updated successfully!");
      setCurrentUser(updated.user)
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>

      <div className="mb-6">
      <Field label="Name" name="displayName" value={formData.displayName} editMode={editMode} onChange={handleChange} textarea />
      <Field label="Email" name="email" value={formData.email} editMode={editMode} onChange={handleChange} textarea />
      <Field label="Description" name="description" value={formData.description} editMode={editMode} onChange={handleChange} textarea />
        <p><strong>Role:</strong> {currentUser.role}</p>
      </div>
      <div className="flex gap-3 mb-6">

      <EditButtons
          editMode={editMode}
          onEdit={() => setEditMode(true)}
          onSave={handleSave}
          onCancel={() => setEditMode(false)}
          editLabel="Edit Profile"
          saveLabel="Save Changes"
        />
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
