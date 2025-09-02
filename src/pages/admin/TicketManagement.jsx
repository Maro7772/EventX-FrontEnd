import React, { useEffect, useState } from "react";
import API from "../../lib/api";
import Loading from "../../layouts/Loading";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get("/tickets");
        setTickets(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Ticket ID</th>
              <th className="border p-2">Event</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Seat No</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className="border p-2">{ticket._id}</td>
                <td className="border p-2">{ticket.eventTitle}</td>
                <td className="border p-2">{ticket.userName}</td>
                <td className="border p-2">{ticket.seatNo}</td>
                <td className="border p-2">
                  {ticket.isBooked ? "Booked" : "Available"}
                </td>
                <td className="border p-2">{ticket.pricePaid} LKR</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketManagement;
