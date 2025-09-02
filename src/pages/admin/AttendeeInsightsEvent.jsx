import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../lib/api";
import Loading from "../../layouts/Loading";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ListFilterPlusIcon,
  LucideUsers,
  Search,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaQrcode, FaTwitter } from "react-icons/fa";
import {
  Cell,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FBAD54",
  "#A569BD",
  "#D2B4DE",
  "#EAB8E4",
  "#FF4D4D",
];

const AttendeeInsightsEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await API.get("/attendee/insights");
        setInsights(res.data);
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);
  console.log(insights);

  if (loading || !insights) return <Loading />;

  if (!event) return <Loading />;

  return (
    <div className="min-h-screen bg-[#EBEBEC]">
      <div className="flex justify-between items-center bg-white rounded p-4">
        <div className="flex gap-2">
          <div
            className="relative size-[30px] cursor-pointer border-2 rounded-full"
            onClick={() => navigate("/admin/manage-events")}
          >
            <ArrowLeft className="absolute inset-0 m-auto" />
          </div>
          <h1 className="text-2xl font-bold">
            Attendee Insights - {event.title}
          </h1>
        </div>
        <div className="flex gap-1 border-2 border-[#ADADAD] p-3 rounded-xl">
          <Search />
          <input
            type="search"
            className="outline-none w-full"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex justify-between items-center pl-6 bg-white rounded p-4">
        <div>
          <ul className="list-disc pl-5">
            <li>Event Venue : {event.venue}</li>
            <li>Event Date : {new Date(event.date).toLocaleDateString()}</li>
            <li>
              Event Time : {event.startTime} to {event.endTime}
            </li>
          </ul>
        </div>
        <div className="flex gap-4">
          <span className="border-2 rounded-xl border-[#ADADAD] flex gap-1 p-2">
            Attendees: 7523 <LucideUsers />
          </span>
          <span className="border-2 rounded-xl border-[#ADADAD] flex gap-1 p-2">
            <ListFilterPlusIcon /> Filter <ArrowDown />
          </span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 min-h-screen gap-4">
        <div className="col-span-2">
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h3 className="font-semibold mb-2">ATTENDEE AGES</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insights.ages}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {insights.ages &&
                    insights.ages.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h3 className="font-bold text-xl">
              Engagement & Social Media Reach
            </h3>
            <p className="text-md text-gray-500">
              🎤 How attendees engaged with the event
            </p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <FaInstagram size={30} color="#E1306C" />
                <p>Instagram Mentions</p>
              </div>
              <span className="text-[#44A7A9]">5200</span>
            </div>
            <hr className="my-3 text-gray-200" />
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <FaFacebook size={30} color="#1877F2" />
                <p>Facebook Shares</p>
              </div>
              <span className="text-[#44A7A9]">3800</span>
            </div>
            <hr className="my-3 text-gray-200" />
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <FaTwitter size={30} color="#1DA1F2" />
                <p>Twitter Tweets</p>
              </div>
              <span className="text-[#44A7A9]">1200</span>
            </div>
            <hr className="my-3 text-gray-200" />
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <FaQrcode size={30} />
                <p>
                  Event Check-ins <br />
                  (QR scans)
                </p>
              </div>
              <span className="text-[#44A7A9]">9500</span>
            </div>
            <hr className="my-3 text-gray-200" />
            <div className="text-center text-[#44A7A9] my-3">
              Total Count: 19700
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h3 className="font-semibold mb-2">ATTENDEE INTERESTS</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insights.interests}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {insights.interests &&
                    insights.interests.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h3 className="font-semibold mb-2">ATTENDEE LOCATIONS</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insights.locations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h3 className="font-semibold mb-2">ATTENDEE LOCATIONS</h3>

            <div className="flex justify-center mt-4">
              <table className="border-2 border-black text-center w-full">
                <thead>
                  <tr>
                    <th className="border-2 border-black px-4 py-2">
                      Location
                    </th>
                    <th className="border-2 border-black px-4 py-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.locations &&
                    insights.locations.map((loc, idx) => {
                      const colors = [
                        "#2563eb",
                        "#dc2626",
                        "#d946ef",
                        "#f59e0b",
                        "#16a34a",
                      ];
                      return (
                        <tr key={idx}>
                          <td className="border-2 border-black px-4 py-2">
                            {loc.name}
                          </td>
                          <td className="border-2 border-black px-4 py-2 flex justify-between items-center">
                            {loc.value}
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: colors[idx % colors.length],
                              }}
                            ></span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeInsightsEvent;
