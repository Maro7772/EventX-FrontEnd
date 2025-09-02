import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ManageEvent from "./pages/admin/ManageEvent.jsx";
import EventDetails from "./components/EventDetails.jsx";
import { useEffect } from "react";
import Loading from "./layouts/Loading.jsx";
import AddEvent from "./pages/admin/AddEvent.jsx";
import AttendeeInsights from "./pages/admin/AttendeeInsights.jsx";
import AttendeeInsightsEvent from "./pages/admin/AttendeeInsightsEvent.jsx";
import ManageEvents from "./pages/user/ManageEvents.jsx";
import Booking from "./pages/user/Booking.jsx";
import EventDetailsUser from "./pages/user/EventDetailsUser.jsx";
import TicketManagement from "./pages/admin/TicketManagement.jsx";

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login", { replace: true });
      else if (role && user.role !== role) navigate("/", { replace: true });
    }
  }, [user, loading, role, navigate]);

  if (loading) return <Loading />;

  return user ? children : null;
}

const App = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const publicRoutes = ["/login", "/register"];

      if (!user && !publicRoutes.includes(window.location.pathname)) {
        navigate("/login", { replace: true });
      } else if (user && window.location.pathname === "/") {
        navigate(
          user.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
          { replace: true }
        );
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <Loading />;

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="manage-events" element={<ManageEvent />} />
        <Route path="manage-events/:id" element={<EventDetails />} />
        <Route path="add-event" element={<AddEvent />} />
        <Route path="tickets" element={<TicketManagement />} />
        <Route path="attendee-insights" element={<AttendeeInsights />} />
        <Route
          path="attendee-insights/:id"
          element={<AttendeeInsightsEvent />}
        />
      </Route>

      {/* User Routes */}
      <Route
        path="/user"
        element={
          <PrivateRoute role="user">
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="manage-events" element={<ManageEvents />} />
        <Route path="manage-events/:id" element={<EventDetailsUser />} />
        <Route path="tickets" element={<Booking />} />
      </Route>
    </Routes>
  );
};

export default App;
