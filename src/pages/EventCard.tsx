import { Event } from "../types/event"

interface EventCardProps {
  event: Event;
  isAttending: boolean;
  handleToggleAttendance: (eventId: number) => void;
  handleShowAttendees: (eventId: number) => void;
  addToGoogleCalendar: (event: any) => void;
  handleViewDetails: (eventId: number) => void;
  isPreview?: boolean;
}

export function EventCard ({ event, isAttending, handleToggleAttendance, handleShowAttendees, addToGoogleCalendar, handleViewDetails, isPreview = false, }: EventCardProps) 
{
   const startTime = new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    const endTime = new Date(`1970-01-01T${event.end_time}`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
  return (
    <div
        className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between h-full w-full"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-700 mb-2">{event.description}</p>
          <p className="text-gray-500 text-sm mb-2">
            {new Date(event.date).toLocaleDateString()} @ {startTime} - {endTime}
          </p>
          <p className="text-gray-700 font-medium mb-2">
            {event.price ? `£${event.price}` : "Free"}
          </p>
        </div>

        {!isPreview && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleViewDetails?.(event.event_id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
          >
            View Details
          </button>

          <button
            onClick={() => handleToggleAttendance?.(event.event_id)}
            className={`px-3 py-1 rounded transition-colors duration-200 ${
              isAttending
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isAttending ? "Unattend" : "Attend"}
          </button>

          <button
            onClick={() => handleShowAttendees?.(event.event_id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          >
            View Attendees
          </button>

          {isAttending && (
            <button
              onClick={() => addToGoogleCalendar?.(event)}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200"
            >
              Add to Google Calendar
            </button>
          )}
        </div>
      )}
    </div>
  );
}