import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API from "../../lib/api";
import Loading from "../../layouts/Loading";
import {
  AlignEndHorizontal,
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  KanbanSquare,
  ListFilterPlusIcon,
  LucideUsers,
  MapPinned,
  Search,
  SquaresIntersect,
  User2Icon,
  UsersRoundIcon,
} from "lucide-react";

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

const AttendeeInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-6 bg-[#F2F2F2] min-h-screen">
      <div className="bg-white p-5 rounded-xl flex flex-col mb-5 md:flex-row justify-between items-center max-md:gap-4">
        <div className="flex items-center gap-4">
          <UsersRoundIcon />
          <h2 className="text-xl font-bold">All Attendee Insights</h2>
        </div>
        <div className="flex gap-4">
          <span className="border-2 rounded-xl border-[#ADADAD] flex gap-1 p-2">
            Attendees: 7523 <LucideUsers />
          </span>
          <span className="border-2 rounded-xl border-[#ADADAD] flex gap-1 p-2">
            <ListFilterPlusIcon /> Filter <ArrowDown />
          </span>
          <span className="border-2 rounded-xl border-[#ADADAD] flex gap-1 p-2">
            <Search />
            <input
              type="search"
              placeholder="Search..."
              className="outline-none w-full"
            />
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-xl py-2 px-3 rounded-xl w-70 mb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">ATTENDEE AGE</h3>
              <AlignEndHorizontal />
            </div>
            <h1 className="text-2xl font-bold mb-2">18 - 24 Years</h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 text-green-400">
                <ArrowUpRight className="ml-10" />
                30% increase
              </div>
              <span className="text-md font-semibold">2735</span>
            </div>
          </div>
          <div className="bg-white shadow-xl py-2 px-3 rounded-xl w-70 mb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">ATTENDEE GENDER</h3>
              <User2Icon />
            </div>
            <h1 className="text-2xl font-bold mb-2">Male</h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 text-green-400">
                <ArrowUpRight className="ml-10" />
                18% increase
              </div>
              <span className="text-md font-semibold">3345</span>
            </div>
          </div>
          <div className="bg-white shadow-xl py-2 px-3 rounded-xl w-70 mb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">ATTENDEE LOCATION</h3>
              <MapPinned />
            </div>
            <h1 className="text-2xl font-bold mb-2">Cairo</h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 text-red-400">
                <ArrowDownRight className="ml-10" />
                15% decrease
              </div>
              <span className="text-md font-semibold">845</span>
            </div>
          </div>
          <div className="bg-white shadow-xl py-2 px-3 rounded-xl w-70 mb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">ATTENDEE INTERESTS</h3>
              <SquaresIntersect />
            </div>
            <h1 className="text-2xl font-bold mb-2">EDM Music</h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 text-green-400">
                <ArrowUpRight className="ml-10" />
                63% increase
              </div>
              <span className="text-md font-semibold">123</span>
            </div>
          </div>
          <div className="bg-white shadow-xl py-2 px-3 rounded-xl w-70 mb-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">ATTENDEE ENGAGEMENT</h3>
              <KanbanSquare />
            </div>
            <h1 className="text-2xl font-bold mb-2">Facebook Ads</h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-1 text-red-400">
                <ArrowDownRight className="ml-10" />
                21% decrease
              </div>
              <span className="text-md font-semibold">21</span>
            </div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* All Attendee Locations */}
          <div className="bg-white shadow-lg rounded-2xl p-4 col-span-2">
            <h3 className="font-semibold mb-2">ALL ATTENDEE LOCATIONS</h3>
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

          {/* Attendee Interests */}
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

          {/* Attendee Ages */}
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
      </div>
    </div>
  );
};

export default AttendeeInsights;
