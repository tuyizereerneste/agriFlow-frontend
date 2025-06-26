// VolunteerManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateVolunteerModal from './CreateVolunteerModal';
import EditVolunteerModal from './EditVolunteerModal';

interface Location {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  role: string;
  type: string;
  location: Location[];
}

const VolunteerManagement: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const token = localStorage.getItem('token'); // Replace with your actual token

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get<Volunteer[]>('https://agriflow-backend-cw6m.onrender.com/api/volunteer/get-all-volunteers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      showMessage('error', 'Failed to fetch volunteers');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteVolunteer = async (id: string) => {
    try {
      await axios.delete(`https://agriflow-backend-cw6m.onrender.com/api/volunteer/delete-volunteer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showMessage('success', 'Volunteer deleted successfully');
      fetchVolunteers();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      showMessage('error', 'Failed to delete volunteer');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessageType(type);
    setMessage(text);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Manage Volunteers</h1>
      {message && (
        <div
          className={`p-4 mb-4 text-white rounded fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${
            messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message}
        </div>
      )}
      <input
        type="text"
        placeholder="Search volunteers..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Volunteer
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVolunteers.map(volunteer => (
          <div key={volunteer.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">{volunteer.name}</h2>
            <p className="text-gray-600">{volunteer.email}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Locations:</h3>
              <ul>
                {volunteer.location.map((loc, index) => (
                  <li key={index} className="text-gray-600">
                    {loc.province}, {loc.district}, {loc.sector}, {loc.cell}, {loc.village}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedVolunteer(volunteer);
                  setShowEditModal(true);
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteVolunteer(volunteer.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateVolunteerModal
          onClose={() => setShowCreateModal(false)}
          onVolunteerCreated={() => {
            fetchVolunteers();
            showMessage('success', 'Volunteer created successfully');
          }}
          onError={() => showMessage('error', 'Failed to create volunteer')}
        />
      )}

      {showEditModal && selectedVolunteer && (
        <EditVolunteerModal
          volunteer={selectedVolunteer}
          onClose={() => setShowEditModal(false)}
          onVolunteerUpdated={() => {
            fetchVolunteers();
            showMessage('success', 'Volunteer updated successfully');
          }}
          onError={() => showMessage('error', 'Failed to update volunteer')}
        />
      )}
    </div>
  );
};

export default VolunteerManagement;