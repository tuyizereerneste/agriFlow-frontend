// pages/company/CompanyNotifications.tsx
const mockNotifications = [
  {
    id: 1,
    type: "enrollment",
    message: "Farmer A enrolled in the Soil Health project.",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "attendance",
    message: "Farmer B attended the 'Composting Training' activity.",
    time: "Yesterday",
  },
  {
    id: 3,
    type: "deadline",
    message: "The 'Water Usage Workshop' activity is scheduled for tomorrow.",
    time: "2 days ago",
  },
  {
    id: 4,
    type: "project",
    message: "New project 'Crop Rotation Study' created.",
    time: "Last week",
  },
];

export default function Notifications() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      <div className="space-y-4">
        {mockNotifications.map((note) => (
          <div
            key={note.id}
            className="bg-white border rounded p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <div className="text-sm font-medium">{note.message}</div>
              <div className="text-xs text-gray-500">{note.time}</div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                note.type === "enrollment"
                  ? "bg-green-100 text-green-800"
                  : note.type === "attendance"
                  ? "bg-blue-100 text-blue-800"
                  : note.type === "deadline"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {note.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
