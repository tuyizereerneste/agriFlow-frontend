// pages/company/CompanyOverview.tsx
import { Link } from "react-router-dom";

const projects = [
  {
    id: "proj1",
    title: "Soil Health Initiative",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    totalPractices: 4,
    totalFarmers: 35,
  },
  {
    id: "proj2",
    title: "Water Conservation Project",
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    totalPractices: 3,
    totalFarmers: 28,
  },
];

export default function CompanyOverview() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Company Projects Overview</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {project.startDate} → {project.endDate}
            </p>
            <p className="mt-2">
              <strong>{project.totalPractices}</strong> practices,{" "}
              <strong>{project.totalFarmers}</strong> farmers enrolled
            </p>
            <Link
              to={`/company/project/${project.id}`}
              className="inline-block mt-4 text-blue-600 hover:underline text-sm"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}