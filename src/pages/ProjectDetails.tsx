import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Users } from 'lucide-react';
import { AddFarmerModal } from '../components/ProjectEnrollment/AddFarmerModal';
import { ActivityAttendance } from '../components/Attendance/ActivityAttendance';

interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetPracticeId: string;
}

interface Land {
  id: string;
  targetPracticeId: string;
  landId: string;
  land: {
    id: string;
    size: number;
    ownership: string;
    crops: string[];
    farmerId: string;
    nearby: string[];
    locations: {
      id: string;
      landId: string;
      locationId: string;
      location: {
        id: string;
        province: string;
        district: string;
        sector: string;
        cell: string;
        village: string;
        latitude: number;
        longitude: number;
        farmerId: string | null;
      };
    }[];
  };
}

interface TargetPractice {
  id: string;
  title: string;
  initialSituation: string;
  projectId: string;
  activities: Activity[];
  lands: Land[];
}

interface Farmer {
  id: string;
  projectId: string;
  farmerId: string;
  createdAt: string;
  farmer: {
    id: string;
    names: string;
    phones: string[];
    farmerNumber: string;
  };
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

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  owner: ProjectOwner;
  startDate: string;
  endDate: string;
  objectives: string;
  createdAt: string;
  farmers: Farmer[];
  targetPractices: TargetPractice[];
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!token) {
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<{ message: string; data: ProjectDetails }>(
          `https://agriflow-backend-cw6m.onrender.com/project/get-project/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProject(response.data.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to fetch project details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, token]);

  const handleFarmerClick = (farmerId: string) => {
    navigate(`/project/${id}/farmer/${farmerId}`);
  };

  const filteredFarmers = project?.farmers
    .filter(f =>
      f.farmer.names.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.farmer.farmerNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.farmer.names.localeCompare(b.farmer.names));

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Project Info */}
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-600 mb-1"><strong>Owner:</strong> {project.owner.name}</p>
      <p className="text-gray-600 mb-1"><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-1"><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-2"><strong>Objectives:</strong> {project.objectives}</p>
      <p className="text-gray-600 mb-6">{project.description}</p>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Farmer to Project
        </button>
        <button
          onClick={() => setShowAttendanceModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Users size={20} />
          Record Attendance
        </button>
      </div>

      {/* Target Practices */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Target Practices & Activities</h2>
        {project.targetPractices.length > 0 ? (
          <div className="space-y-6">
            {project.targetPractices.map(practice => (
              <div key={practice.id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-bold">{practice.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{practice.initialSituation}</p>

                {practice.activities.length > 0 && (
                  <div className="ml-4 mt-2">
                    <p className="font-medium text-gray-700">Activities:</p>
                    <ul className="list-disc ml-6 text-sm text-gray-600">
                      {practice.activities.map(activity => (
                        <li key={activity.id}>{activity.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No target practices associated with this project.</p>
        )}
      </div>

      {/* Farmer Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search farmers by name or ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Farmer List */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Registered Farmers</h2>
        {filteredFarmers && filteredFarmers.length > 0 ? (
          <ul className="space-y-4">
            {filteredFarmers.map(farmer => (
              <li
                key={farmer.id}
                onClick={() => handleFarmerClick(farmer.farmerId)}
                className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
              >
                <p className="text-lg font-medium">{farmer.farmer.names}</p>
                <p className="text-sm text-gray-500">
                  <strong>Farmer Number:</strong> {farmer.farmer.farmerNumber}
                </p>
                <p className="text-sm text-gray-500">
                  <Phone size={14} className="inline-block mr-1" />
                  {farmer.farmer.phones.join(', ')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching farmers found.</p>
        )}
      </div>

      {/* Modals */}
      {showModal && project && (
        <AddFarmerModal
          projectId={project.id}
          projectTitle={project.title}
          onClose={() => setShowModal(false)}
          onSuccess={() => console.log('Farmer added successfully')}
        />
      )}

      {showAttendanceModal && project && (
        <ActivityAttendance
          projectId={project.id}
          projectTitle={project.title}
          onClose={() => setShowAttendanceModal(false)}
          onSuccess={record => {
            console.log('Attendance recorded:', record);
            setShowAttendanceModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetails;