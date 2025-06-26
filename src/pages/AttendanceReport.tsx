import { useState, useEffect } from "react";
import { Download, FileText, Search } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";

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

interface Farmer {
  id: string;
  names: string;
  phones: string[];
  farmerNumber: string;
  gender: string;
  dob: string;
  location: CompanyLocation[];
}

interface AttendanceRecord extends Farmer {
  activityId: string;
  attendedAt: string;
  notes: string;
  photos: string[];
}

interface ApiResponse {
  message: string;
  data: Project[];
}

export default function AttendanceReports() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [practices, setPractices] = useState<TargetPractice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Farmer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ message: string; data: Company[] }>(
          `https://agriflow-backend-cw6m.onrender.com/api/company/all`,
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
            `https://agriflow-backend-cw6m.onrender.com/api/project/get-company-projects/${userId}`,
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
            `https://agriflow-backend-cw6m.onrender.com/api/project/project-practices/${selectedProject}`,
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
    const fetchActivities = async () => {
      if (selectedPractice) {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get<{ message: string; data: Activity[] }>(
            `https://agriflow-backend-cw6m.onrender.com/api/project/practice-activities/${selectedPractice}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setActivities(response.data.data);
        } catch (error) {
          console.error("Error fetching activities:", error);
          setError("Failed to fetch activities");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchActivities();
  }, [selectedPractice]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedActivity) return;
  
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ attendance: Array<{ id: string; farmer: Farmer; activityId: string; createdAt: string; notes: string; photos: string[] }> }>(
          `https://agriflow-backend-cw6m.onrender.com/api/project/attendance/${selectedActivity}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Base URL for the photos
        const basePhotoUrl = "https://agriflow-backend-cw6m.onrender.com/uploads/attendance/";
  
        const records = response.data.attendance.map(att => ({
          ...att.farmer,
          activityId: att.activityId,
          attendedAt: att.createdAt,
          notes: att.notes,
          photos: att.photos.map(photo => {
            const photoUrl = basePhotoUrl + photo;
            console.log(photoUrl);
            return photoUrl;
          }),
        }));
  
        setAttendanceRecords(records);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setError("Failed to fetch attendance records");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAttendance();
  }, [selectedActivity]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchFarmers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
  
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  
  const searchFarmers = async (query: string) => {
    try {
      const response = await axios.get<{ farmers: Farmer[] }>(
        `https://agriflow-backend-cw6m.onrender.com/api/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (response.data && Array.isArray(response.data.farmers)) {
        setSearchResults(response.data.farmers);
      } else {
        setSearchResults([]);
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error('Error searching farmers:', err);
      setError('Failed to search farmers');
      setSearchResults([]);
    }
  };

  const handleSelectFarmer = (farmerId: string) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/admin/farmer-attendances/${farmerId}`);
  };
  
  
  

  const filteredAttendanceRecords = attendanceRecords;

  const handleRowClick = (record: AttendanceRecord) => {
    const projectDetails = projects.find(p => p.id === selectedProject);
    const practiceDetails = practices.find(tp => tp.id === selectedPractice);
    const activityDetails = activities.find(a => a.id === selectedActivity);
  
    navigate(`/admin/attendance-details/${record.id}`, {
      state: {
        farmerDetails: record,
        project: projectDetails,
        practice: practiceDetails,
        activity: activityDetails
      }
    });
  };
  

  const exportToExcel = () => {
    if (!selectedProj || !selectedPract || !selectedActivity || attendanceRecords.length === 0) {
      alert("Please select an activity with attendance records.");
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
      ["Activity", activities.find((a) => a.id === selectedActivity)?.title || "Unknown Activity"],
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
      "Attended At",
      "Notes",
    ];
  
    const attendanceRows = filteredAttendanceRecords.map((record) => {
      const location = record.location?.[0] ?? {};
      return [
        record.farmerNumber,
        record.names,
        record.gender,
        new Date(record.dob).toLocaleDateString(),
        record.phones.join(", "),
        location.province || "",
        location.district || "",
        location.sector || "",
        location.cell || "",
        location.village || "",
        new Date(record.attendedAt).toLocaleDateString(),
        record.notes,
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
  
    XLSX.utils.sheet_add_aoa(ws, attendanceRows, { origin: `A${startRow + 1}` });
  
    const allRows = [headers, ...attendanceRows];
    const colWidths = headers.map((_, i) => {
      const maxLength = allRows.reduce((acc, row) => {
        const val = row[i] ?? "";
        const len = String(val).length;
        return Math.max(acc, len);
      }, headers[i].length);
      return { wch: maxLength + 2 };
    });
    ws["!cols"] = colWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  
    XLSX.writeFile(wb, "attendance-records.xlsx");
  };
  
  const exportPDF = () => {
    if (!selectedProj || !selectedPract || !selectedActivity || attendanceRecords.length === 0) {
      alert("Please select an activity with attendance records.");
      return;
    }
  
    const doc = new jsPDF('landscape');
  
    // Optional: Company logo space
    doc.setFontSize(10);
    doc.text("Company Logo", 14, 10);
  
    // Project & Activity Details
    const projectDetails = [
      ["Project Title", selectedProj.title],
      ["Description", selectedProj.description],
      ["Owner", selectedProj.owner.name],
      ["Start Date", new Date(selectedProj.startDate).toLocaleDateString()],
      ["End Date", new Date(selectedProj.endDate).toLocaleDateString()],
      ["Objectives", selectedProj.objectives],
      ["Practice", selectedPract.title],
      ["Activity", activities.find((a) => a.id === selectedActivity)?.title || "Unknown Activity"],
    ];
  
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Project's Activity Attendance Records", 14, 20);
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  
    projectDetails.forEach(([label, value], index) => {
      doc.text(`${label}:`, 14, 30 + index * 6);
      doc.text(value, 60, 30 + index * 6, { maxWidth: 120 });
    });
  
    // Table headers
    const headers = [
      "Farmer Number", "Name", "Gender", "Date of Birth", "Phones",
      "Province", "District", "Sector", "Cell", "Village",
      "Attended At", "Notes"
    ];
  
    const data = filteredAttendanceRecords.map((record) => {
      const location = record.location?.[0] ?? {};
      return [
        record.farmerNumber,
        record.names,
        record.gender,
        new Date(record.dob).toLocaleDateString(),
        record.phones.join(", "),
        location.province || "",
        location.district || "",
        location.sector || "",
        location.cell || "",
        location.village || "",
        new Date(record.attendedAt).toLocaleDateString(),
        record.notes || "",
      ];
    });
  
    const tableStartY = 30 + projectDetails.length * 6 + 10;
  
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: tableStartY,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        textColor: 0,
        lineColor: 0,
        lineWidth: 0.1,
      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: [255, 255, 255],
        textColor: 0,
        lineColor: 0,
        lineWidth: 0.1,
      },
      columnStyles: {
        4: { cellWidth: 30 },
        12: { cellWidth: 50 },
      },
      theme: 'grid',
    });
    
  
    doc.save("attendance-report.pdf");
  };


  const selectedProj = Array.isArray(projects) ? projects.find((p) => p.id === selectedProject) : null;
  const selectedPract = Array.isArray(practices) ? practices.find((tp) => tp.id === selectedPractice) : null;
  const selectedCompany = Array.isArray(companies) ? companies.find((c) => c.id === selectedCompanyId) : null;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Reports</h1>

      {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search farmers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {/* Dropdown with search results */}
          {searchResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto">
              {searchResults.map((farmer) => (
                <li
                  key={farmer.id}
                  onClick={() => handleSelectFarmer(farmer.id)}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                >
                  {farmer.names}
                </li>
              ))}
            </ul>
          )}
        </div>


      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <select
          className="border rounded px-3 py-2"
          value={selectedCompanyId ?? ""}
          onChange={(e) => {
            setSelectedCompanyId(e.target.value);
            setSelectedProject(null);
            setSelectedPractice(null);
            setSelectedActivity(null);
          }}
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.user.name} ({c.tin})
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={selectedProject ?? ""}
          onChange={(e) => {
            setSelectedProject(e.target.value);
            setSelectedPractice(null);
            setSelectedActivity(null);
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
          {practices.map((tp) => (
            <option key={tp.id} value={tp.id}>
              {tp.title}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={selectedActivity ?? ""}
          onChange={(e) => setSelectedActivity(e.target.value)}
          disabled={!selectedPractice}
        >
          <option value="">Select Activity</option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <Download size={16} />
          Export Excel
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          <FileText size={16} />
          Export PDF
        </button>
      </div>

      {/* Project Details */}
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

      {/* Attendance Records List */}
      {filteredAttendanceRecords.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <h2 className="text-xl font-semibold mb-2">Attendance Records</h2>
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
                <th className="border px-4 py-2 text-left">Attended At</th>
                <th className="border px-4 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceRecords.map((record) => {
                const location = record.location?.[0] ?? {};
                // Use record.id to get the farmerId
                const farmerId = record.id;
                return (
                  <tr
                      key={farmerId}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(record)}
                    >
                      <td className="border px-4 py-2">{record.farmerNumber}</td>
                      <td className="border px-4 py-2">{record.names}</td>
                      <td className="border px-4 py-2">{record.gender}</td>
                      <td className="border px-4 py-2">{new Date(record.dob).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{record.phones.join(", ")}</td>
                      <td className="border px-4 py-2">{location.province}</td>
                      <td className="border px-4 py-2">{location.district}</td>
                      <td className="border px-4 py-2">{location.sector}</td>
                      <td className="border px-4 py-2">{location.cell}</td>
                      <td className="border px-4 py-2">{location.village}</td>
                      <td className="border px-4 py-2">{new Date(record.attendedAt).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{record.notes}</td>
                    </tr>

                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
}