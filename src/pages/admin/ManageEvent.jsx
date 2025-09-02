import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ListFilter,
  PlusCircle,
  Search,
} from "lucide-react";
import API from "../../lib/api";
import EventCard from "../../components/EventCard";
import { useNavigate } from "react-router-dom";
import Loading from "../../layouts/Loading";

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await API.get("/events");

        const now = new Date();

        const updatedEvents = await Promise.all(
          res.data.map(async (ev) => {
            const eventDate = new Date(ev.date);

            if (eventDate < now && ev.status !== "Closed") {
              try {
                await API.put(`/events/${ev._id}`, { status: "Closed" });
                return { ...ev, status: "Closed" };
              } catch (err) {
                console.error(`Failed to update event ${ev._id}:`, err);
                return ev;
              }
            }
            return ev;
          })
        );

        setEvents(updatedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  const upcomingEvents = events.filter((ev) => ev.status === "Upcoming");
  const pendingEvents = events.filter((ev) => ev.status === "Pending");
  const closedEvents = events.filter((ev) => ev.status === "Closed");
  return (
    <div>
      <div className="p-6 flex flex-col gap-2 md:flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Event Management Section</h1>
        <div className="flex flex-col md:flex-row gap-2 space-x-4 max-sm:hidden">
          <div className="flex items-center justify-between p-2 gap-2 border rounded-xl">
            <div className="flex gap-1">
              <ListFilter />
              Filter
            </div>
            <ChevronDown className="inline-block mr-2" />
          </div>
          <div className="border flex items-center px-2 rounded-xl">
            <Search className="inline-block mr-2" />
            <input
              type="search"
              placeholder="Search Events..."
              className="p-2 rounded outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row items-center justify-between p-6">
        <div className="flex gap-4">
          <div
            onClick={() => navigate("/admin/add-event")}
            className="text-blue-600 cursor-pointer flex gap-2 border-2 pl-4 pr-6 py-2 rounded-xl items-center border-blue-600"
          >
            <PlusCircle className="inline-block mr-2 text-blue-600" />
            <span className="font-semibold">New Event</span>
          </div>
          <div
            onClick={() => navigate(`/admin/attendee-insights`)}
            className="text-[#FBAD54] cursor-pointer flex gap-2 border-2 px-3 py-2 rounded-xl items-center border-[#FBAD54]"
          >
            <span className="font-semibold">Attendies Insights</span>
            <ChevronDown />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border flex items-center px-2 py-2 rounded-xl">
            <span className="mr-2">Sort by: </span>
            <div className="flex gap-1">
              <span>Status</span>
              <ChevronDown />
            </div>
          </div>
          <div className="border flex items-center px-2 py-2 rounded-xl">
            <Calendar className="inline-block mr-2" />
            <h3>Pick Date</h3>
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-100 min-h-screen overflow-y-auto">
        {/* Upcoming */}
        <div className="flex flex-col">
          <h3 className="mb-2 flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-blue-600"></span>
            <span className="text-lg text-[#434343]">Upcoming Events</span>
          </h3>

          {loading ? (
            <Loading />
          ) : (
            upcomingEvents.map((ev) => (
              <EventCard key={ev._id} event={ev} onDelete={handleDelete} />
            ))
          )}
        </div>

        {/* Pending */}
        <div className="flex flex-col">
          <h3 className="mb-2 flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-green-600"></span>
            <span className="text-lg text-[#434343]">Pending Events</span>
          </h3>
          {loading ? (
            <Loading />
          ) : (
            pendingEvents.map((ev) => (
              <EventCard key={ev._id} event={ev} onDelete={handleDelete} />
            ))
          )}
        </div>

        {/* Closed */}
        <div className="flex flex-col">
          <h3 className="mb-2 flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-red-600"></span>
            <span className="text-lg text-[#434343]">Closed Events</span>
          </h3>
          {loading ? (
            <Loading />
          ) : (
            closedEvents.map((ev) => (
              <EventCard key={ev._id} event={ev} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEvent;
