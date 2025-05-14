import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CreateProjectForm from '../components/projects/createProjectForm';
import { Plus, Filter, Download, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetPracticeId: string;
}

interface TargetPractice {
  id: string;
  title: string;
  initialSituation: string;
  projectId: string;
  activities: Activity[];
}

interface ProjectOwner {
  id: string;
  name: string;
  email: string;
  type: string;
  company: {
    id: string;
    logo: string;
    tin: string;
  };
}

interface Project {
  id: string;
  title: string;
  owner: ProjectOwner;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  targetPractices: TargetPractice[];
}


interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    owner: "",
    startDate: "",
    endDate: "",
    objectives: "",
    targetPractice: "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, filters]);

  const fetchProjects = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ data: Project[]; pagination: Pagination }>("https://agriflow-backend-cw6m.onrender.com/project/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          query: searchTerm || undefined,
          owner: filters.owner || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          objectives: filters.objectives || undefined,
          targetPractice: filters.targetPractice || undefined,
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      setProjects(response.data.data || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportProjects = async () => {
    try {
      const response = await axios.get("https://agriflow-backend-cw6m.onrender.com/projects/export-excel", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data as Blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "projects_data.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting projects:", error);
      setError("Failed to export projects.");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreated = () => {
    setShowCreateForm(false);
    fetchProjects();
  };

  if (showCreateForm) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Add New Project</h1>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>Back to List</Button>
        </div>
        <CreateProjectForm onSuccess={handleCreated} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and view all registered projects</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" leftIcon={<Filter size={16} />} rightIcon={<ChevronDown size={16} />} onClick={() => setShowFilters(!showFilters)}>
          Filters
        </Button>
        <Button variant="outline" leftIcon={<Download size={16} />} onClick={exportProjects}>
          Export
        </Button>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowCreateForm(true)}>
          Create Project
        </Button>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="bg-white p-4 border rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Owner</label>
              <Input type="text" name="owner" placeholder="Filter by owner" value={filters.owner} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-sm font-medium">Objectives</label>
              <Input type="text" name="objectives" placeholder="Filter by objectives" value={filters.objectives} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-sm font-medium">Target Practice</label>
              <Input type="text" name="targetPractice" placeholder="Filter by target practice" value={filters.targetPractice} onChange={handleFilterChange} />
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul>
  {Array.isArray(projects) && projects.length > 0 ? (
    projects.map((project) => (
      <li key={project.id} className="border-b">
        <Link to={`/project-details/${project.id}`} className="block p-4 hover:bg-gray-50 flex items-center">
          <div className="flex-1">
            <p className="text-lg font-medium">{project.title}</p>
            <p className="text-sm text-gray-500">
              <strong>Owner:</strong> {project.owner?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Objectives:</strong> {project.objectives}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Target Practices:</strong> {project.targetPractices.map(practice => practice.title).join(', ')}
            </p>
          </div>
        </Link>
      </li>
    ))
  ) : (
    <p className="text-center py-6">No projects found</p>
  )}
</ul>

        </div>
      )}
    </div>
  );
};

export default ProjectsPage;