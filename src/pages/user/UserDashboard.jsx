import React, { useEffect, useState, useRef } from "react";
import { Search, Bell, Settings, CalendarDays } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../lib/api";
import Loading from "../../layouts/Loading";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // dropdown state
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get("/events");
        setEvents(data);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // fetch upcoming events
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const { data } = await API.get("/events?status=Upcoming");
        setUpcoming(data);
      } catch (err) {
        console.error("❌ Error fetching upcoming events:", err);
      }
    };
    fetchUpcoming();
  }, []);

  // fetch notifications (from backend)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await API.get("/notifications/my");
        setNotifications(data);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // mark single notification as read
  const markAsRead = async (id) => {
    try {
      const { data } = await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  // mark all as read
  const markAllAsRead = async () => {
    try {
      await API.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("❌ Error marking all as read:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6 bg-[#F3F4F6] min-h-screen">
      {/* Header */}
      <header className="bg-black text-white rounded-2xl p-4 md:p-5 flex flex-col xl:flex-row gap-4 md:items-center md:justify-between shadow">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || "https://via.placeholder.com/100?text=User"}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div>
            <p className="text-lg font-semibold">Welcome {user.name}</p>
            <p className="text-white/70 text-xs">Event User</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="flex-1 md:flex-initial relative">
            <input
              type="text"
              placeholder="Search events..."
              className="font-semibold w-full md:w-[420px] rounded-lg bg-white px-10 py-2 text-sm text-black outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              color="black"
            />
          </div>

          {/* Notifications */}
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

          {/* Settings */}
          <button className="bg-white text-black p-2 rounded-full shadow">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Upcoming Events */}
      <section className="mt-6 bg-white rounded-2xl p-4 shadow">
        <h3 className="font-semibold text-lg mb-2">Upcoming Events</h3>
        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
          {upcoming.map((ev) => (
            <div
              key={ev._id}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition cursor-pointer"
              onClick={() => navigate(`/user/manage-events/${ev._id}`)}
            >
              <img
                src={ev.img || "https://via.placeholder.com/50?text=Event"}
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
      </section>

      {/* All Events */}
      <section className="mt-6">
        <h3 className="font-semibold text-lg mb-4">All Events</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col"
            >
              <img
                src={
                  event.banner ||
                  "https://via.placeholder.com/400x200?text=Event"
                }
                alt={event.title}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-gray-600 text-sm">
                {new Date(event.date).toLocaleDateString()} • {event.location}
              </p>
              <button
                onClick={() => navigate(`/user/manage-events/${event._id}`)}
                className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
