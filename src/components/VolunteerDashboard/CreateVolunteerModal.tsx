// CreateVolunteerModal.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Location {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

interface CreateVolunteerRequestBody {
  name: string;
  email: string;
  password: string;
  locations: Location[];
}

interface CreateVolunteerModalProps {
  onClose: () => void;
  onVolunteerCreated: () => void;
  onError: () => void;
}

const CreateVolunteerModal: React.FC<CreateVolunteerModalProps> = ({ onClose, onVolunteerCreated, onError }) => {
  const [formData, setFormData] = useState<CreateVolunteerRequestBody>({
    name: '',
    email: '',
    password: '',
    locations: [],
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddLocation = () => {
    setFormData({
      ...formData,
      locations: [
        ...formData.locations,
        { province: '', district: '', sector: '', cell: '', village: '' },
      ],
    });
  };

  const handleLocationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const locations = formData.locations.map((loc, i) =>
      i === index ? { ...loc, [name]: value } : loc
    );
    setFormData({
      ...formData,
      locations,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/volunteer/register-volunteer',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          locations: formData.locations,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      onVolunteerCreated();
      onClose();
    } catch (error) {
      console.error('Error creating volunteer:', error);
      onError();
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl overflow-y-auto max-h-screen">
        <h2 className="text-2xl mb-4">Create Volunteer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Locations</label>
            {formData.locations.map((loc, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  name="province"
                  value={loc.province}
                  onChange={(e) => handleLocationChange(index, e)}
                  placeholder="Province"
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="district"
                  value={loc.district}
                  onChange={(e) => handleLocationChange(index, e)}
                  placeholder="District"
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="sector"
                  value={loc.sector}
                  onChange={(e) => handleLocationChange(index, e)}
                  placeholder="Sector"
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="cell"
                  value={loc.cell}
                  onChange={(e) => handleLocationChange(index, e)}
                  placeholder="Cell"
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="village"
                  value={loc.village}
                  onChange={(e) => handleLocationChange(index, e)}
                  placeholder="Village"
                  className="w-full px-4 py-2 border rounded mb-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLocation}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Location
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Volunteer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVolunteerModal;