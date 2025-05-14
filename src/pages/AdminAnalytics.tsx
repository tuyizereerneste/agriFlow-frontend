// pages/company/CompanyAnalytics.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const mockStats = {
  totalProjects: 2,
  totalPractices: 4,
  totalActivities: 6,
  totalFarmers: 125,
  attendanceRate: "82%",
};

const farmersPerProject = [
  { project: "Soil Health", farmers: 80 },
  { project: "Irrigation Program", farmers: 45 },
];

const activityTrends = [
  { month: "Jan", attendance: 20 },
  { month: "Feb", attendance: 30 },
  { month: "Mar", attendance: 45 },
  { month: "Apr", attendance: 30 },
];

export default function Analytics() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* 📦 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(mockStats).map(([key, value]) => (
          <div key={key} className="bg-white border rounded p-4 shadow-sm">
            <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
            <div className="text-xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      {/* 📊 Farmers per Project */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Farmers per Project</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={farmersPerProject}>
            <XAxis dataKey="project" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="farmers" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📈 Attendance Trend */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Activity Attendance Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityTrends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="attendance" stroke="#60a5fa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}