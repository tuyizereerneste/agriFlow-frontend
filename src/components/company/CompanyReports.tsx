// pages/company/CompanyReports.tsx
import { useState } from "react";
import { Download, FileText } from "lucide-react";

const mockProjects = [
  {
    id: "p1",
    title: "Soil Health Project",
    practices: [
      {
        id: "tp1",
        title: "Organic Composting",
        activities: [
          { id: "a1", title: "Compost Workshop" },
          { id: "a2", title: "Follow-up Demo" },
        ],
      },
    ],
  },
  {
    id: "p2",
    title: "Irrigation Program",
    practices: [
      {
        id: "tp2",
        title: "Drip Setup",
        activities: [{ id: "a3", title: "Drip System Training" }],
      },
    ],
  },
];

const mockFarmers = [
  { id: "f1", name: "Mary K." },
  { id: "f2", name: "John O." },
  { id: "f3", name: "Grace A." },
];

export default function CompanyReports() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const handleExport = (format: "csv" | "pdf") => {
    alert(`Exporting as ${format.toUpperCase()}...`);
    // Call your backend API here
  };

  const selectedProj = mockProjects.find(p => p.id === selectedProject);
  const selectedPract = selectedProj?.practices.find(tp => tp.id === selectedPractice);
  const selectedAct = selectedPract?.activities.find(a => a.id === selectedActivity);

  const tableData = mockFarmers; // Based on practice/activity filters

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          className="border rounded px-3 py-2"
          value={selectedProject ?? ""}
          onChange={(e) => {
            setSelectedProject(e.target.value);
            setSelectedPractice(null);
            setSelectedActivity(null);
          }}
        >
          <option value="">Select Project</option>
          {mockProjects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={selectedPractice ?? ""}
          onChange={(e) => {
            setSelectedPractice(e.target.value);
            setSelectedActivity(null);
          }}
          disabled={!selectedProject}
        >
          <option value="">Select Practice</option>
          {selectedProj?.practices.map(tp => (
            <option key={tp.id} value={tp.id}>{tp.title}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={selectedActivity ?? ""}
          onChange={(e) => setSelectedActivity(e.target.value)}
          disabled={!selectedPractice}
        >
          <option value="">Select Activity (optional)</option>
          {selectedPract?.activities.map(a => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>
      </div>

      {/* 📤 Export Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleExport("csv")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <Download size={16} />
          Export CSV
        </button>
        <button
          onClick={() => handleExport("pdf")}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          <FileText size={16} />
          Export PDF
        </button>
      </div>

      {/* 📊 Report Table */}
      <div className="overflow-x-auto bg-white border rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Farmer ID</th>
              <th className="px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(f => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{f.id}</td>
                <td className="px-4 py-2">{f.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}