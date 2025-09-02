import React, { useEffect, useState } from "react";
import API from "../../lib/api";
import toast from "react-hot-toast";

const Booking = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem("token");

  // Load events
  useEffect(() => {
    API.get("/events").then((res) => setEvents(res.data));
  }, []);

  // Load user tickets
  useEffect(() => {
    if (token) {
      API.get("/tickets/mine", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setTickets(res.data));
    }
  }, [token]);

  const handleBook = async (seatNo) => {
    try {
      const res = await API.post(
        "/tickets/book",
        { eventId: selectedEvent._id, seatNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTicket = res.data;
      setTickets([...tickets, newTicket]);

      // Update UI seats
      const updatedSeats = selectedEvent.seats.map((s) =>
        s.seatNo === seatNo ? { ...s, isBooked: true } : s
      );
      setSelectedEvent({ ...selectedEvent, seats: updatedSeats });

      // Show toast with QR code
      toast.custom(() => (
        <div className="p-3 bg-white border shadow rounded flex flex-col items-center">
          <p className="mb-2">
            🎟️ Seat {seatNo} booked for "{selectedEvent.title}"
          </p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${newTicket.qrToken}&size=100x100`}
            alt="QR code"
          />
        </div>
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      const res = await API.delete(`/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from UI
      const updatedTickets = tickets.filter((t) => t._id !== ticketId);
      setTickets(updatedTickets);

      toast.custom(() => (
        <div className="p-3 bg-white border shadow rounded">
          <p>{res.data.message}</p>
        </div>
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Events List */}
      <div>
        <h2 className="text-xl font-bold mb-4">🎉 Available Events</h2>
        <div className="space-y-4">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{ev.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(ev.date).toDateString()}
                  </p>
                  <p className="text-sm">💰 {ev.price} EGP</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(ev)}
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Selection */}
      {selectedEvent && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">
            🪑 Choose a Seat - {selectedEvent.title}
          </h2>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-3 mb-3 text-sm">
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-600 rounded"></div> Booked
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div> Available
            </span>
          </div>

          <div className="grid grid-cols-10 gap-2 justify-center">
            {selectedEvent.seats.map((seat, i) => (
              <div
                key={i}
                onClick={() => !seat.isBooked && handleBook(seat.seatNo)}
                className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer text-xs
                  ${
                    seat.isBooked
                      ? "bg-purple-600 text-white cursor-not-allowed"
                      : "bg-gray-200 hover:bg-green-400"
                  }`}
              >
                {seat.seatNo}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Tickets */}
      <div className="md:col-span-2 mt-6">
        <h2 className="text-xl font-bold mb-4">🎟️ My Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">No tickets booked yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {tickets.map((t) => (
              <div
                key={t._id}
                className="border rounded-xl p-4 shadow hover:shadow-lg flex flex-col items-center"
              >
                <h3 className="font-semibold">{t.event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(t.event.date).toDateString()}
                </p>
                <p>🪑 Seat: {t.seatNo}</p>
                <p>💰 Paid: {t.pricePaid} EGP</p>
                {/* QR code From ChatGPT */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${t.qrToken}&size=100x100`}
                  alt="QR code"
                  className="mt-2"
                />
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(t._id)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Cancel Ticket
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
