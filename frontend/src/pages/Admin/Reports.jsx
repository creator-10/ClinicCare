import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#5f6FFF", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666", "#82ca9d"
];

const Reports = () => {
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  // Pie chart: Visits per specialization
  const fetchPieData = async () => {
    setPieData([]);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chart/stats/specialization`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setPieData(
          res.data.data.map((item) => ({
            name: item._id || "Unknown",
            value: item.count,
          }))
        );
      } else {
        setPieData([]);
      }
    } catch (err) {
      setPieData([]);
    }
  };

  // Line chart: Appointments per day
  const fetchLineData = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/chart/stats/daily`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setLineData(
            res.data.data.map((item) => ({
              date: item._id,
              count: item.count,
            }))
          );
        }
      });
  };

  useEffect(() => {
    fetchPieData();
    fetchLineData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-12 px-2">
      <div className="max-w-6xl mx-auto rounded-3xl shadow-2xl border border-blue-200 bg-white/60 backdrop-blur-lg p-8">
        <h2 className="text-4xl font-extrabold mb-10 text-blue-800 text-center tracking-tight drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
            Reports & Analytics
          </span>
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Pie Chart: Visits Per Specialization */}
          <div className="flex-1 rounded-2xl p-8 flex flex-col items-center shadow-xl bg-white/70 backdrop-blur-md border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center tracking-wide">
              Visits Per Specialization
            </h3>
            <button
              className="mb-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200"
              onClick={fetchPieData}
            >
              Refresh Chart
            </button>
            <div className="flex justify-center items-center h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    fill="#2563eb"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      color: "#222",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "16px",
                      fontWeight: "500",
                      color: "#2563eb",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Appointments Per Day */}
          <div className="flex-1 rounded-2xl p-8 flex flex-col items-center shadow-xl bg-white/70 backdrop-blur-md border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center tracking-wide">
              Appointments Booked Per Day
            </h3>
            <button
              className="mb-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200"
              onClick={fetchLineData}
            >
              Refresh Chart
            </button>
            <div className="flex justify-center items-center h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="date" stroke="#2563eb" />
                  <YAxis allowDecimals={false} stroke="#2563eb" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      color: "#222",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "16px",
                      fontWeight: "500",
                      color: "#2563eb",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Appointments"
                    stroke="#5f6FFF"
                    strokeWidth={3}
                    dot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;