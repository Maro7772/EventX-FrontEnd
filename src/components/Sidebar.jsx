import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck2,
  Ticket,
  Users,
  BarChart3,
  Headphones,
  Bell,
  Settings,
  Megaphone,
  Folder,
  UserCog,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [open, setOpen] = useState(false);

  const isDashboardActive =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user");

  return (
    <>
      <button
        className="cursor-pointer md:hidden fixed top-4 right-4 z-50 bg-[#111111] text-white p-2 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`min-h-screen max-sm:h-[100%] bg-[#111111] text-white w-64 p-4
        md:static md:translate-x-0 fixed top-0 left-0 z-40
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="flex gap-4 items-center mb-3">
          <img
            className="w-10 h-10 border rounded-full"
            src="/Frame.svg"
            alt="EventX Logo"
          />
          <div>
            <h1 className="font-bold text-xl">EventX</h1>
            <p className="text-xs text-gray-400">studio</p>
          </div>
        </div>

        {/* Add Quick Event */}
        <NavLink
          to="add-event"
          className="flex items-center gap-2 bg-[#282828] text-white font-semibold rounded-lg px-3 py-2 mb-2"
        >
          <PlusCircle className="bg-[#C1FF72] p-1 rounded-xl" size={40} />
          <span>Add Quick Event</span>
        </NavLink>

        <div className="flex flex-col">
          {/* Main Navigation */}
          <DropdownSection
            className="mt-2 bg-[#1F1F1F]"
            title="Main Navigation"
          >
            <NavLink
              to="dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="manage-events"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <CalendarCheck2 size={20} />
              <span>Manage Events</span>
            </NavLink>
            <NavLink
              to="tickets"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <Ticket size={20} />
              <span>Booking & Tickets</span>
            </NavLink>
            <NavLink
              to="attendee-insights"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <Users size={20} />
              <span>Attendee Insights</span>
            </NavLink>
            <NavLink
              to="analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <BarChart3 size={20} />
              <span>Analytics & Reports</span>
            </NavLink>
          </DropdownSection>

          {/* Support & Management */}
          <DropdownSection title="Support & Management">
            <NavLink
              to="support"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <Headphones size={20} />
              <span>Contact Support</span>
            </NavLink>
            <NavLink
              to="notifications"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <Bell size={20} />
              <span>Notifications</span>
            </NavLink>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </DropdownSection>

          {/* Additional Features */}
          <DropdownSection title="Additional Features">
            <NavLink
              to="marketing"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <Megaphone size={20} />
              <span>Marketing</span>
            </NavLink>
            <NavLink
              to="categories"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <Folder size={20} />
              <span>Event Categories</span>
            </NavLink>
          </DropdownSection>

          {/* Account Management */}
          <DropdownSection title="Account Management">
            <NavLink
              to="users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] ${
                  isActive ? "bg-[#282828] font-semibold" : ""
                }`
              }
            >
              <UserCog size={20} />
              <span>Manage Users</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#282828] w-full text-left"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </DropdownSection>
        </div>
      </aside>
    </>
  );
};

function DropdownSection({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        className="cursor-pointer flex justify-between items-center w-full text-white uppercase text-xs mb-2"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <div className={`flex flex-col gap-1 ${open ? "block" : "hidden"}`}>
        {children}
      </div>
      <hr className="border-white my-3" />
    </div>
  );
}

export default Sidebar;
