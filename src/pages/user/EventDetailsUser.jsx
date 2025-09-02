import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  QrCode,
  ArrowLeft,
  TagIcon,
  LucideSeparatorHorizontal,
  LucideSeparatorVertical,
  TargetIcon,
  Tags,
  Users,
} from "lucide-react";
import API from "../../lib/api";
import Loading from "../../layouts/Loading";

const EventDetailsUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tags, setTags] = useState("#Music,#Festival");
  const [attendance, setAttendance] = useState("+1000");

  useEffect(() => {
    API.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  if (!event) return <Loading />;

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
                className="outline-none w-full bg-gray-100"
                value={event.title}
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label>Event Venue</label>
            <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
              <input
                className="outline-none w-full bg-gray-100"
                value={event.venue}
                readOnly
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
                className="outline-none w-full bg-gray-100"
                value={
                  event.date
                    ? new Date(event.date).toISOString().split("T")[0]
                    : ""
                }
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label>Event Time</label>
            <div className="flex items-center gap-2">
              <div className="border-2 border-[#ADADAD] p-2 rounded-lg w-full">
                <input
                  type="time"
                  className="outline-none w-full bg-gray-100"
                  value={event.startTime}
                  readOnly
                />
              </div>
              <span>to</span>
              <div className="border-2 border-[#ADADAD] p-2 rounded-lg w-full">
                <input
                  type="time"
                  className="outline-none w-full bg-gray-100"
                  value={event.endTime}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event Description full width */}
        <div className="flex flex-col gap-1 col-span-3">
          <label>Event Description</label>
          <textarea
            className="border-2 border-[#ADADAD] p-2 rounded-lg w-full h-28 bg-gray-100"
            value={event.description}
            readOnly
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
              className="outline-none w-full bg-gray-100"
              value={event.price}
              readOnly
            />
            <TagIcon />
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Seat Amount</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              className="outline-none w-full bg-gray-100"
              value={event.totalSeats}
              readOnly
            />
            <LucideSeparatorHorizontal />
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Status</label>
          <div className="border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              className="outline-none w-full bg-gray-100"
              value={event.status}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Available Seats</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              className="outline-none w-full bg-gray-100"
              value={availableSeats}
              readOnly
            />
            <LucideSeparatorVertical />
          </div>
        </div>
        <div className="flex flex-col md:w-[22%]">
          <label>Popularity</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              className="outline-none w-full bg-gray-100"
              value={event.popularity}
              readOnly
            />
            <TargetIcon />
          </div>
        </div>
      </div>

      {/* Seat Allocation */}
      <div className="border-2 border-[#ADADAD] p-4 rounded-xl">
        <h2 className="font-bold text-2xl mb-3 text-center">Seat Allocation</h2>

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
              key={i}
              className={`w-10 h-10 rounded ${
                seat.isBooked ? "bg-purple-600" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Tags and Attendance */}
      <div className="flex gap-2 mt-5">
        <div className="flex flex-col gap-1">
          <label>Tags</label>
          <div className="flex justify-between border-2 border-[#ADADAD] p-2 rounded-lg w-full">
            <input
              type="text"
              value={tags}
              className="outline-none w-full bg-gray-100"
              readOnly
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
              className="outline-none w-full bg-gray-100"
              readOnly
            />
            <Users />
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="flex items-center gap-2 border p-4 rounded mt-5">
        <QrCode className="size-35 border" />
        <p>Scan QR code for easy payments</p>
      </div>
    </div>
  );
};

export default EventDetailsUser;
