import { Ticket, ArrowRight, Delete } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";
import { useAuth } from "../context/AuthContext";

const EventCard = ({ event, onDelete }) => {
  const { user } = useAuth();
  const bookedSeats = event.seats.filter((s) => s.isBooked).length;
  const availableSeats = event.totalSeats - bookedSeats;
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      if (user.role !== "admin") {
        alert("You are not authorized to delete this event");
        return;
      }
      await API.delete(`/events/${event._id}`);
      alert("Event deleted successfully");
      onDelete?.(event._id);
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="rounded-2xl shadow bg-white p-4 flex flex-col gap-2 hover:shadow-lg transition mb-5">
      {/* Title */}
      <div className="flex justify-between gap-2">
        <h4 className="font-semibold text-md text-center">{event.title}</h4>
        <Delete
          onClick={(e) => {
            e.stopPropagation();
            deleteHandler();
          }}
          className="cursor-pointer"
        />
      </div>
      {/* Prices and seats */}
      <div className="flex gap-6 text-sm font-semibold">
        <span className="text-green-600 flex items-center gap-1">
          💵 {event.price}LKR
        </span>
        <span className="text-red-500 flex items-center gap-1">
          <Ticket className="w-4 h-4" /> {bookedSeats}
        </span>
        <span className="text-purple-500 flex items-center gap-1">
          🎟 {availableSeats}
        </span>
      </div>
      <hr />

      {/* Venue */}
      <div className="text-gray-600 text-sm flex items-center gap-1">
        Venue : <span className="text-black font-semibold">{event.venue}</span>
      </div>

      {/* Date & Time */}
      <div className="text-gray-600 text-sm flex items-center gap-1">
        Date :{" "}
        <span className="text-black font-semibold">
          {new Date(event.date).toLocaleDateString()}
        </span>
      </div>
      <div className="text-gray-600 text-sm flex items-center gap-1">
        Time :{" "}
        <span className="text-black font-semibold">
          {event.startTime && event.endTime
            ? `${event.startTime} - ${event.endTime}`
            : "09:00 PM - 11:30 PM"}
        </span>
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`${event._id}`);
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-black hover:bg-gray-100 cursor-pointer"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
