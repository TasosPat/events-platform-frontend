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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Attendees for {eventName}</h1>
      {attendees.length === 0 ? (
        <p>No attendees yet.</p>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {attendees.map((a) => (
            <li key={a.user_id}>{a.name}{" "}
            {currentUser && a.user_id === currentUser.user_id && (
            <span style={{ color: "gray", marginLeft: "0.3rem" }}>(You)</span>
          )}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
