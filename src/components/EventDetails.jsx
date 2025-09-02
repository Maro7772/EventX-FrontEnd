import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  QrCode,
  ArrowLeft,
  PenToolIcon,
  TimerIcon,
  TagIcon,
  LucideSeparatorHorizontal,
  LucideSeparatorVertical,
  TargetIcon,
  Tags,
  Users,
} from "lucide-react";
import API from "../lib/api";
import Loading from "../layouts/Loading";
import toast from "react-hot-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tags, setTags] = useState("#Music,#Festival");
  const [attendance, setAttendance] = useState("+1000");
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    API.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  if (!event) return <Loading />;

  const handleSave = async () => {
    try {
      setLoadingSave(true);
      await API.put(`/events/${id}`, {
        ...event,
        tags,
        attendance,
      });

      toast.success("Event updated successfully 🎉");

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event ❌");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSeatClick = (index) => {
    const updatedSeats = [...event.seats];

    updatedSeats[index].isBooked = !updatedSeats[index].isBooked;

    setEvent({ ...event, seats: updatedSeats });
  };

  const bookedSeats = event.seats.filter((s) => s.isBooked).length;
  const availableSeats = event.totalSeats - bookedSeats;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Back Button + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full border hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold mx-auto">Event Details</h1>
      </div>

      {/* Event Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="space-y-3 col-span-2">
          <div className="flex flex-col gap-1">
            <label>Event Name</label>
            <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
              <input
                className="outline-none w-full"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
              <PenToolIcon />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label>Event Venue</label>
            <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
              <input
                className="outline-none w-full"
                value={event.venue}
                onChange={(e) => setEvent({ ...event, venue: e.target.value })}
              />
              <MapPin />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label>Event Date</label>
            <div className="border-2 border-[#ADADAD] p-2 rounded-lg w-full">
              <input
                type="date"
                className="outline-none w-full"
                value={
                  event.date
                    ? new Date(event.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label>Event Time</label>
            <div className="flex items-center gap-2">
              <div className="border-2 border-[#ADADAD] p-2 rounded-lg w-full">
                <input
                  type="time"
                  className="outline-none w-full"
                  value={event.startTime}
                  onChange={(e) =>
                    setEvent({ ...event, startTime: e.target.value })
                  }
                />
              </div>
              <span>to</span>
              <div className="border-2 border-[#ADADAD] p-2 rounded-lg w-full">
                <input
                  type="time"
                  className="outline-none w-full"
                  value={event.endTime}
                  onChange={(e) =>
                    setEvent({ ...event, endTime: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event Description full width */}
        <div className="flex flex-col gap-1 col-span-3">
          <label>Event Description</label>
          <textarea
            className="border-2 border-[#ADADAD] p-2 rounded-lg w-full h-28"
            value={event.description}
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col md:flex-row md:gap-[3%] w-full">
        <div className="flex flex-col md:w-[22%]">
          <label>Ticket Price</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              className="outline-none w-full"
              value={event.price}
              onChange={(e) => setEvent({ ...event, price: e.target.value })}
            />
            <TagIcon />
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Seat Amount</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              className="outline-none w-full"
              value={event.totalSeats}
              onChange={(e) =>
                setEvent({ ...event, totalSeats: e.target.value })
              }
            />
            <LucideSeparatorHorizontal />
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Status</label>
          <div className="border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <select
              className="outline-none w-full"
              value={event.status}
              onChange={(e) => setEvent({ ...event, status: e.target.value })}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Available Seats</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              className="outline-none w-full"
              value={availableSeats}
            />
            <LucideSeparatorVertical />
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Popularity</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              className="outline-none w-full"
              value={event.popularity}
            />
            <TargetIcon />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between md:flex-row md:gap-20">
        {/* Seat Allocation */}
        <div className="border-2 border-[#ADADAD] p-4 rounded-xl flex-1">
          <h2 className="font-bold text-2xl mb-3 text-center">
            Seat Allocation
          </h2>

          <div className="flex justify-center gap-4 mt-3 mb-3 text-sm">
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-600 rounded"></div> Paid Seats
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-400 rounded"></div> Reserved Seats
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div> Available
            </span>
          </div>

          <div className="grid grid-cols-10 gap-2 justify-center">
            {event.seats.map((seat, i) => (
              <div
                onClick={() => handleSeatClick(i)}
                key={i}
                className={`w-10 h-10 rounded cursor-pointer ${
                  seat.isBooked ? "bg-purple-600" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex gap-2 mb-5">
            <div className="flex flex-col gap-1">
              <label>Tags</label>
              <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="outline-none w-full"
                />
                <Tags />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>Expected Attendance</label>
              <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
                <input
                  type="text"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="outline-none w-full"
                />
                <Users />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 border p-4 rounded mb-5">
            <QrCode className="size-35 border" />
            <p>Scan QR code for easy payments</p>
          </div>
          <div className="flex gap-3 justify-between">
            <button
              onClick={handleSave}
              disabled={loadingSave}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl w-full cursor-pointer disabled:opacity-50"
            >
              {loadingSave ? "Saving..." : "EDIT"}
            </button>
            <button
              onClick={() => navigate(`/admin/attendee-insights/${event._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full cursor-pointer"
            >
              Attendee Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
