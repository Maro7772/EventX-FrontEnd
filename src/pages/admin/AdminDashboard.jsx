import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  CalendarDays,
  Ticket,
  Users,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import API from "../../lib/api";
import Loading from "../../layouts/Loading";

const donutColors = ["#8E8EFF", "#7FD38B", "#F5A623", "#23C0EA", "#6E6EF7"];

export default function AdminDashboard() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [latestEvent, setLatestEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [lineData, setLineData] = useState([]);
  const [donutData, setDonutData] = useState([]);
  const [seats, setSeats] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const { data } = await API.get("/events?status=Upcoming");
        setUpcoming(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUpcoming();
  }, []);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        const eventsData = res.data || [];
        setEvents(eventsData);
        setTotalEvents(eventsData.length);

        // Calculate total revenue & bookings for all events
        let revenueSum = 0;
        let bookingsSum = 0;
        eventsData.forEach((ev) => {
          const price = parseFloat(ev.price) || 0;
          const bookedSeats = (ev.seats || []).filter((s) => s.isBooked).length;
          revenueSum += bookedSeats * price;
          bookingsSum += bookedSeats;
        });

        setTotalRevenue(revenueSum);
        setTotalBookings(bookingsSum);

        // Set latest event
        if (eventsData.length > 0) {
          const last = eventsData[eventsData.length - 1];
          setLatestEvent(last);
          setSeats(last.seats || []);

          const booked = (last.seats || []).filter((s) => s.isBooked).length;
          const available = (last.totalSeats || 0) - booked;
          setDonutData([
            { name: "Booked", value: booked },
            { name: "Available", value: available },
          ]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch line chart data
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await API.get("/analytics/sales");
        setLineData(res.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSales();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications/my");
        setNotifications(res.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setShowNotifDropdown(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 bg-[#F3F4F6] min-h-screen">
      {/* Header */}
      <header className="bg-black text-white rounded-2xl p-4 md:p-5 flex flex-col xl:flex-row gap-4 md:items-center md:justify-between shadow">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=120&auto=format&fit=crop"
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div>
            <p className="text-lg md:text-md font-semibold">
              Welcome {user.name}
            </p>
            <p className="text-white/70 text-xs">System Administrator</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial relative">
            <input
              type="text"
              placeholder="Search ..."
              className="font-semibold w-full md:w-[420px] rounded-lg bg-white px-10 py-2 text-sm text-black outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              color="black"
            />
          </div>

          {/* Notification dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifDropdown((s) => !s)}
              className="relative cursor-pointer bg-white text-black p-2 rounded-full shadow"
              aria-expanded={showNotifDropdown}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-2xl shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="font-semibold">Notifications</div>
                  {unreadCount > 0 ? (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs cursor-pointer text-blue-600 hover:underline"
                    >
                      Mark all
                    </button>
                  ) : (
                    <div className="text-xs text-gray-500">All read</div>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`flex items-start gap-3 px-4 py-3 border-b ${
                          n.isRead ? "bg-white opacity-75" : "bg-gray-50"
                        }`}
                      >
                        <CalendarDays
                          className="mt-0.5 flex-shrink-0"
                          size={18}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              n.isRead ? "text-gray-500" : "font-medium"
                            }`}
                          >
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={() => markAsRead(n._id)}
                            className="text-xs cursor-pointer text-blue-600 whitespace-nowrap"
                          >
                            Mark
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="bg-white text-black p-2 rounded-full shadow">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Top stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <StatCard
          icon={<Users className="text-blue-600" />}
          title="EVENTS"
          value={`${totalEvents} Events`}
        />
        <StatCard
          icon={<Ticket className="text-yellow-600" />}
          title="BOOKINGS"
          value={`${totalBookings} Tickets`}
        />
        <StatCard
          icon={<DollarSign className="text-green-600" />}
          title="REVENUE"
          value={`${totalRevenue}LKR`}
        />
        {/* Upcoming Events */}
        <div className="col-span-1 row-span-2 bg-white rounded-2xl p-4 shadow max-sm:hidden">
          <h3 className="font-semibold text-lg mb-2">Upcoming Events</h3>
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
            {upcoming.map((ev) => (
              <div
                key={ev._id}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
              >
                <img
                  src={ev.img || "http//placeholder"}
                  alt={ev.title}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div className="text-sm">
                  <p className="font-medium truncate">{ev.title}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(ev.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Net Sales */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">NET SALES</h3>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => `${v.toLocaleString()} LKR`} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#F97366"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Donut */}
          {donutData.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold text-lg mb-2">Seat Occupancy</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                    >
                      {donutData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={donutColors[index % donutColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={24} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Latest Event Seats */}
        {latestEvent && (
          <div className="grid mt-5 md:col-span-3 bg-white rounded-2xl p-4 shadow">
            <h3 className="font-semibold text-lg mb-1">Latest Event</h3>
            <div className="text-sm text-gray-500 mb-4">
              <p>
                Event Name:{" "}
                <span className="text-black">{latestEvent.title}</span>
              </p>
              <p>
                Event Date:{" "}
                <span className="text-black">
                  {new Date(latestEvent.date).toLocaleDateString()}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-6 flex-wrap mb-4 text-sm">
              <LegendDot label="Booked" className="bg-[#6E6EF7]" />
              <LegendDot label="Available" className="bg-[#E5E7EB]" />
            </div>
            <div className="grid grid-cols-12 gap-2">
              {seats.map((s, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-xl ${
                    s.isBooked ? "bg-[#6E6EF7]" : "bg-gray-200"
                  }`}
                  title={s.seatNo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Notifications list (right column) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow max-sm:hidden">
          <h3 className="font-semibold text-lg mb-2">Notifications</h3>
          <div className="flex flex-col divide-y max-h-full overflow-y-auto">
            {notifications.map((n, i) => (
              <div
                key={i}
                className={`py-3 text-sm flex items-start gap-2 hover:bg-gray-50 rounded transition ${
                  n.isRead ? "opacity-60" : ""
                }`}
              >
                <CalendarDays className="mt-0.5 flex-shrink-0" size={16} />
                <p>{n.message}</p>
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="ml-auto text-xs text-blue-600 cursor-pointer"
                  >
                    Mark
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow">
      <div className="w-12 h-12 rounded-xl bg-gray-100 grid place-items-center text-gray-700">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <p
          className={`text-xl ${
            title === "EVENTS"
              ? "text-blue-600"
              : title === "BOOKINGS"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function LegendDot({ label, className }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`inline-block w-4 h-4 rounded ${className}`} />
      <span>{label}</span>
    </div>
  );
}
