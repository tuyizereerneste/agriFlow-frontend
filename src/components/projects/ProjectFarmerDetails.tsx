import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

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

interface Location {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    latitude?: number;
    longitude?: number;
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
    dob: string;
    gender: string;
    location: Location[];
  };
}

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  owner: string;
  startDate: string;
  endDate: string;
  objectives: string;
  createdAt: string;
  farmers: Farmer[];
  targetPractices: TargetPractice[];
}

const ProjectFarmerDetails: React.FC = () => {
  const { projectId, farmerId } = useParams<{ projectId: string; farmerId: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const response = await axios.get<{ message: string; data: ProjectDetails }>(`https://agriflow-backend-cw6m.onrender.com/api/project/get-project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProject(response.data.data);
        const farmerData = response.data.data.farmers.find((f: Farmer) => f.farmerId === farmerId);
        setFarmer(farmerData || null);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to fetch project details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, farmerId, token]);

  if (loading) {
    return <p>Loading farmer details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!project || !farmer) {
    return <p>Farmer not found.</p>;
  }

  const farmerPractices = project.targetPractices.filter((practice) =>
    practice.lands.some((land) => land.land.farmerId === farmerId)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Farmer Details</h2>
        <p className="text-lg font-medium">{farmer.farmer.names}</p>
        <p className="text-sm text-gray-500">
          <strong>Farmer Number:</strong> {farmer.farmer.farmerNumber}
        </p>
        <p className="text-sm text-gray-500">
          <Phone size={14} className="inline-block mr-1" /> {farmer.farmer.phones.join(', ')}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Date of Birth:</strong> {new Date(farmer.farmer.dob).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Gender:</strong> {farmer.farmer.gender}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Location:</strong> {farmer.farmer.location.map((loc) => `${loc.province}, ${loc.district}, ${loc.sector}, ${loc.cell}, ${loc.village}`).join(', ')}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Practices</h2>
        {farmerPractices.length > 0 ? (
          <ul className="space-y-4">
            {farmerPractices.map((practice) => (
              <li key={practice.id} className="border p-4 rounded-md shadow">
                <p className="text-lg font-medium">{practice.title}</p>
                <p className="text-sm text-gray-500">{practice.initialSituation}</p>
                <div className="mt-2">
                  <h3 className="text-xl font-semibold mb-2">Activities</h3>
                  {practice.activities.length > 0 ? (
                    <ul className="space-y-2">
                      {practice.activities.map((activity) => (
                        <li key={activity.id} className="border p-2 rounded-md shadow">
                          <p className="text-md font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            <strong>Start Date:</strong> {new Date(activity.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>End Date:</strong> {new Date(activity.endDate).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No activities associated with this practice.</p>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-xl font-semibold mb-2">Lands</h3>
                  {practice.lands.length > 0 ? (
                    <ul className="space-y-2">
                      {practice.lands.map((land) => (
                        <li key={land.id} className="border p-2 rounded-md shadow">
                          <p className="text-md font-medium">Size: {land.land.size} ha</p>
                          <p className="text-sm text-gray-500">Ownership: {land.land.ownership}</p>
                          <p className="text-sm text-gray-500">Crops: {land.land.crops.join(', ')}</p>
                          <p className="text-sm text-gray-500">Nearby: {land.land.nearby.join(', ')}</p>
                          <div className="mt-2">
                            <h4 className="text-lg font-semibold mb-2">Locations</h4>
                            {land.land.locations.length > 0 ? (
                              <ul className="space-y-2">
                                {land.land.locations.map((location) => (
                                  <li key={location.id} className="border p-2 rounded-md shadow">
                                    <p className="text-md font-medium">
                                      {location.location.province}, {location.location.district}, {location.location.sector}, {location.location.cell}, {location.location.village}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      <MapPin size={14} className="inline-block mr-1" /> Lat: {location.location.latitude}, Lon: {location.location.longitude}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No locations associated with this land.</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No lands associated with this practice.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No practices associated with this farmer.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectFarmerDetails;