// pages/company/CompanyActivities.tsx
import { format, isBefore, isAfter, isWithinInterval } from "date-fns";

const activities = [
  {
    id: "a1",
    title: "Training on Compost Use",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    practiceTitle: "Compost Application",
    projectTitle: "Soil Health Initiative",
    attendeesCount: 20,
  },
  {
    id: "a2",
    title: "Water Saving Demo",
    startDate: "2025-06-01",
    endDate: "2025-06-03",
    practiceTitle: "Drip Irrigation",
    projectTitle: "Water Conservation Project",
    attendeesCount: 15,
  },
];

// Utility to get status
function getStatus(start: string, end: string) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isBefore(now, startDate)) return "Upcoming";
  if (isWithinInterval(now, { start: startDate, end: endDate })) return "Ongoing";
  if (isAfter(now, endDate)) return "Completed";
  return "Unknown";
}

export default function CompanyActivities() {
  const total = activities.length;
  const totalAttendees = activities.reduce((sum, a) => sum + a.attendeesCount, 0);

  const statuses = {
    Upcoming: activities.filter(a => getStatus(a.startDate, a.endDate) === "Upcoming").length,
    Ongoing: activities.filter(a => getStatus(a.startDate, a.endDate) === "Ongoing").length,
    Completed: activities.filter(a => getStatus(a.startDate, a.endDate) === "Completed").length,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Activities Overview</h1>

      {/* 🧮 Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Activities" value={total} />
        <StatCard label="Total Attendees" value={totalAttendees} />
        <StatCard label="Upcoming" value={statuses.Upcoming} />
        <StatCard label="Completed" value={statuses.Completed} />
      </div>

      {/* 📋 Activity Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3">Practice</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Attendees</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => {
              const status = getStatus(a.startDate, a.endDate);
              return (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{a.title}</td>
                  <td className="px-4 py-2">{a.practiceTitle}</td>
                  <td className="px-4 py-2">{a.projectTitle}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-2">{a.attendeesCount}</td>
                  <td className="px-4 py-2">{format(new Date(a.startDate), "yyyy-MM-dd")}</td>
                  <td className="px-4 py-2">{format(new Date(a.endDate), "yyyy-MM-dd")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔘 Reusable card for stats
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

// 🟢 Status badge
function StatusBadge({ status }: { status: string }) {
  const color = {
    Upcoming: "bg-yellow-100 text-yellow-700",
    Ongoing: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Unknown: "bg-gray-100 text-gray-600",
  }[status] || "bg-gray-100 text-gray-600";

  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
      {status}
    </span>
  );
}