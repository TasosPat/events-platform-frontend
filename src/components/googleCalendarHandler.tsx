import { Event } from "../types/event"

export const handleAddToGoogleCalendar = (event: Event) => {
  if (!event.date || !event.start_time || !event.end_time) {
    alert("Invalid event date or time. Cannot add to Google Calendar.");
    return;
  }
  const datePart = event.date.includes("T") ? event.date.split("T")[0] : event.date;
  const start = new Date(`${datePart}T${event.start_time}`);
  const end = new Date(`${datePart}T${event.end_time}`);


  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Invalid Date objects:", start, end);
    alert("Invalid event date or time. Cannot add to Google Calendar.");
    return;
  }

  const startStr = start.toISOString().replace(/-|:|\.\d+/g, "");
  const endStr = end.toISOString().replace(/-|:|\.\d+/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startStr}/${endStr}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location || "")}`;
    
    window.open(url, "_blank");
  };
  