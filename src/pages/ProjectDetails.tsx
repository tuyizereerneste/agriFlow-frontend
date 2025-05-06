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
        const response = await axios.get<{ message: string; data: ProjectDetails }>(`http://localhost:5000/project/get-project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  if (loading) {
    return <p>Loading project details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-2"><strong>Owner:</strong> {project.owner.name}</p>
      <p className="text-gray-600 mb-2"><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-2"><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-4"><strong>Objectives:</strong> {project.objectives}</p>
      <p className="text-gray-600 mb-4">{project.description}</p>

      {/* Target Practices Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Target Practices</h2>
        {project.targetPractices.length > 0 ? (
          <ul className="space-y-4">
            {project.targetPractices.map((practice) => (
              <li key={practice.id} className="border p-4 rounded-md shadow">
                <p className="text-lg font-medium">{practice.title}</p>
                <p className="text-sm text-gray-500">{practice.initialSituation}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No target practices associated with this project.</p>
        )}
      </div>

      {/* Farmers Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Farmers</h2>
        {project.farmers.length > 0 ? (
          <ul className="space-y-4">
            {project.farmers.map((farmer) => (
              <li
                key={farmer.id}
                className="border p-4 rounded-md shadow cursor-pointer"
                onClick={() => handleFarmerClick(farmer.farmerId)}
              >
                <p className="text-lg font-medium">{farmer.farmer.names}</p>
                <p className="text-sm text-gray-500">
                  <strong>Farmer Number:</strong> {farmer.farmer.farmerNumber}
                </p>
                <p className="text-sm text-gray-500">
                  <Phone size={14} className="inline-block mr-1" /> {farmer.farmer.phones.join(', ')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No farmers associated with this project.</p>
        )}
      </div>

      {/* Add Farmer Button */}
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-2"
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

          {showModal && project && (
            <AddFarmerModal
              projectId={project.id}
              projectTitle={project.title}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                console.log('Farmer added successfully');
              }}
            />
          )}
          {showAttendanceModal && project && (
            <ActivityAttendance
              projectId={project.id}
              projectTitle={project.title}
              onClose={() => setShowAttendanceModal(false)}
              onSuccess={(record) => {
                console.log('Attendance recorded:', record);
                setShowAttendanceModal(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;