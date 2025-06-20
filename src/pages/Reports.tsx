import { useState, useEffect } from "react";
import { Download, FileText } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Define types based on the response structure
interface CompanyLocation {
  id: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  type: string;
}

interface Company {
  id: string;
  logo: string | null;
  tin: string;
  userId: string;
  user: User;
  location: CompanyLocation[];
}

interface Activity {
  id: string;
  targetPracticeId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface TargetPractice {
  id: string;
  title: string;
  initialSituation: string;
  projectId: string;
  activities: Activity[];
}

interface Owner {
  id: string;
  name: string;
  type: string;
  company: {
    id: string;
    tin: string;
    logo: string;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  objectives: string;
  createdAt: string;
  owner: Owner;
  targetPractices: TargetPractice[];
}

interface ApiResponse {
  message: string;
  data: Project[];
}

export default function CompanyReports() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [practices, setPractices] = useState<TargetPractice[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ message: string; data: Company[] }>(
          `http://localhost:5000/api/company/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompanies(response.data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to fetch companies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedCompanyId) {
        setIsLoading(true);
        try {
          const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
          if (!selectedCompany) return;

          const userId = selectedCompany.userId;
          const token = localStorage.getItem("token");
          const response = await axios.get<ApiResponse>(
            `http://localhost:5000/api/project/get-company-projects/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProjects(response.data.data);
        } catch (error) {
          console.error("Error fetching projects:", error);
          setError("Failed to fetch projects");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
  }, [selectedCompanyId, companies]);

  useEffect(() => {
    const fetchPractices = async () => {
      if (selectedProject) {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get<{ message: string; data: TargetPractice[] }>(
            `http://localhost:5000/api/project/project-practices/${selectedProject}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPractices(response.data.data);
        } catch (error) {
          console.error("Error fetching practices:", error);
          setError("Failed to fetch practices");
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchPractices();
  }, [selectedProject]);
  

  useEffect(() => {
    const fetchFarmers = async () => {
      if (selectedPractice) {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get<{ message: string; data: { farmers: any[] } }>(
            `http://localhost:5000/api/project/get-practice-farmers/${selectedPractice}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFarmers(response.data.data.farmers);
        } catch (error) {
          console.error("Error fetching farmers:", error);
          setError("Failed to fetch farmers");
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchFarmers();
  }, [selectedPractice]);
  

const exportExcel = () => {
  if (!selectedProj || !selectedPract || farmers.length === 0) {
    alert("Please select a practice with registered farmers.");
    return;
  }

  const projectDetails = [
    ["Project Title", selectedProj.title],
    ["Description", selectedProj.description],
    ["Owner", selectedProj.owner.name],
    ["Start Date", new Date(selectedProj.startDate).toLocaleDateString()],
    ["End Date", new Date(selectedProj.endDate).toLocaleDateString()],
    ["Objectives", selectedProj.objectives],
    ["Practice", selectedPract.title],
  ];

  const headers = [
    "Farmer Number",
    "Name",
    "Gender",
    "Date of Birth",
    "Phones",
    "Province",
    "District",
    "Sector",
    "Cell",
    "Village",
  ];

  const farmerRows = farmers.map((farmer) => {
    const location = farmer.location?.[0] ?? {};
    return [
      farmer.farmerNumber,
      farmer.names,
      farmer.gender,
      new Date(farmer.dob).toLocaleDateString(),
      farmer.phones.join(", "),
      location.province || "",
      location.district || "",
      location.sector || "",
      location.cell || "",
      location.village || "",
    ];
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([]);

  XLSX.utils.sheet_add_aoa(ws, projectDetails, { origin: "A1" });

  const startRow = projectDetails.length + 2;

  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: `A${startRow}` });

  headers.forEach((_, colIdx) => {
    const cell = ws[XLSX.utils.encode_cell({ r: startRow - 1, c: colIdx })];
    if (cell) {
      cell.s = {
        font: { bold: true },
        alignment: { vertical: "center", horizontal: "center" },
      };
    }
  });

  XLSX.utils.sheet_add_aoa(ws, farmerRows, { origin: `A${startRow + 1}` });

  // Auto column widths
  const allRows = [headers, ...farmerRows];
  const colWidths = headers.map((_, i) => {
    const maxLength = allRows.reduce((acc, row) => {
      const val = row[i] ?? "";
      const len = String(val).length;
      return Math.max(acc, len);
    }, headers[i].length);
    return { wch: maxLength + 2 };
  });
  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Practice Farmers");

  XLSX.writeFile(wb, "practice-farmers-report.xlsx");
};

const exportPDF = () => {
  if (!selectedProj || !selectedPract || farmers.length === 0) {
    alert("Please select a practice with registered farmers.");
    return;
  }

  const doc = new jsPDF();

  // Project & Practice Details
  const projectDetails = [
    ["Project Title", selectedProj.title],
    ["Description", selectedProj.description],
    ["Owner", selectedProj.owner.name],
    ["Start Date", new Date(selectedProj.startDate).toLocaleDateString()],
    ["End Date", new Date(selectedProj.endDate).toLocaleDateString()],
    ["Objectives", selectedProj.objectives],
    ["Practice", selectedPract.title],
  ];

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Project Registered Farmers", 14, 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  projectDetails.forEach(([label, value], index) => {
    doc.text(`${label}:`, 14, 20 + index * 6);
    doc.text(value, 60, 20 + index * 6, { maxWidth: 120 });
  });

  // Add space before the table
  const tableStartY = 20 + projectDetails.length * 6 + 10;

  // Table headers
  const headers = [
    [
      "Farmer Number",
      "Name",
      "Gender",
      "Date of Birth",
      "Phones",
      "Province",
      "District",
      "Sector",
      "Cell",
      "Village",
    ],
  ];

  // Table body
  const data = farmers.map((farmer) => {
    const location = farmer.location?.[0] ?? {};
    return [
      farmer.farmerNumber,
      farmer.names,
      farmer.gender,
      new Date(farmer.dob).toLocaleDateString(),
      farmer.phones.join(", "),
      location.province || "",
      location.district || "",
      location.sector || "",
      location.cell || "",
      location.village || "",
    ];
  });

  autoTable(doc, {
    head: headers,
    body: data,
    startY: tableStartY,
    styles: {
      fontSize: 8,
      textColor: 0, // ✅ black text
      lineColor: 0, // ✅ black borders
      lineWidth: 0.1,
      cellPadding: 2,
    },
    headStyles: {
      fontStyle: "bold",
      textColor: 0,               // ✅ black header text
      fillColor: [255, 255, 255], // ✅ white background
      lineColor: 0,               // ✅ black header border
      lineWidth: 0.1,
    },
    theme: "grid",
  });

  doc.save("practice-farmers-report.pdf");
};

  

  const selectedProj = Array.isArray(projects) ? projects.find((p) => p.id === selectedProject) : null;
  const selectedPract = Array.isArray(practices) ? practices.find((tp) => tp.id === selectedPractice) : null;
  const selectedCompany = Array.isArray(companies) ? companies.find((c) => c.id === selectedCompanyId) : null;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Company Select */}
        <select
          className="border rounded px-3 py-2"
          value={selectedCompanyId ?? ""}
          onChange={(e) => {
            setSelectedCompanyId(e.target.value);
            setSelectedProject(null);
            setSelectedPractice(null);
            setProjects([]);
            setPractices([]);
            setFarmers([]);
          }}
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.user.name} ({c.tin})
            </option>
          ))}
        </select>

        {/* Project Select */}
        <select
          className="border rounded px-3 py-2"
          value={selectedProject ?? ""}
          onChange={(e) => {
            setSelectedProject(e.target.value);
            setSelectedPractice(null);
            setPractices([]);
            setFarmers([]);
          }}
          disabled={!selectedCompanyId}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Practice Select */}
        <select
          className="border rounded px-3 py-2"
          value={selectedPractice ?? ""}
          onChange={(e) => {
            setSelectedPractice(e.target.value);
            setFarmers([]);
          }}
          disabled={!selectedProject}
        >
          <option value="">Select Practice</option>
          {practices.map((tp) => (
            <option key={tp.id} value={tp.id}>
              {tp.title}
            </option>
          ))}
        </select>
      </div>


      {/* 📤 Export Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={exportExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <Download size={16} />
          Export excel
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          <FileText size={16} />
          Export PDF
        </button>
      </div>

      {/* 📋 Project Details */}
      {selectedProj && selectedPract && (
        <div className="mb-4 p-4 bg-gray-50 border rounded">
          <h2 className="text-xl font-semibold mb-2">{selectedProj.title}</h2>
          <p className="mb-1">
            <strong>Description:</strong> {selectedProj.description}
          </p>
          <p className="mb-1">
            <strong>Owner:</strong> {selectedProj.owner.name}
          </p>
          <p className="mb-1">
            <strong>Start Date:</strong> {new Date(selectedProj.startDate).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>End Date:</strong> {new Date(selectedProj.endDate).toLocaleDateString()}
          </p>
          <p className="mb-1">
            <strong>Objectives:</strong> {selectedProj.objectives}
          </p>
          <p className="mb-1">
            <strong>Practice:</strong> {selectedPract.title}
          </p>
        </div>
      )}

      {/* Farmers List */}
      {farmers.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <h2 className="text-xl font-semibold mb-2">Registered Farmers</h2>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Farmer Number</th>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Gender</th>
                    <th className="border px-4 py-2 text-left">Date of Birth</th>
                    <th className="border px-4 py-2 text-left">Phone Numbers</th>
                    <th className="border px-4 py-2 text-left">Province</th>
                    <th className="border px-4 py-2 text-left">District</th>
                    <th className="border px-4 py-2 text-left">Sector</th>
                    <th className="border px-4 py-2 text-left">Cell</th>
                    <th className="border px-4 py-2 text-left">Village</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.map((farmer) => {
                    const location = farmer.location?.[0] ?? {};
                    return (
                      <tr key={farmer.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{farmer.farmerNumber}</td>
                        <td className="border px-4 py-2">{farmer.names}</td>
                        <td className="border px-4 py-2">{farmer.gender}</td>
                        <td className="border px-4 py-2">
                          {new Date(farmer.dob).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">{farmer.phones.join(", ")}</td>
                        <td className="border px-4 py-2">{location.province}</td>
                        <td className="border px-4 py-2">{location.district}</td>
                        <td className="border px-4 py-2">{location.sector}</td>
                        <td className="border px-4 py-2">{location.cell}</td>
                        <td className="border px-4 py-2">{location.village}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 text-center text-gray-500">
              <p>No farmers registered to this project.</p>
            </div>
          )}
    </div>
  );
}