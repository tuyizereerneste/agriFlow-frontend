// EditVolunteerModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

interface EditVolunteerModalProps {
  volunteer: Volunteer;
  onClose: () => void;
  onVolunteerUpdated: () => void;
  onError: () => void;
}

const EditVolunteerModal: React.FC<EditVolunteerModalProps> = ({ volunteer, onClose, onVolunteerUpdated, onError }) => {
  const [formData, setFormData] = useState<Volunteer>(volunteer);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setFormData(volunteer);
  }, [volunteer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const locations = formData.location.map((loc, i) =>
      i === index ? { ...loc, [name]: value } : loc
    );
    setFormData({
      ...formData,
      location: locations,
    });
  };

  const handleAddLocation = () => {
    setFormData({
      ...formData,
      location: [
        ...formData.location,
        { province: '', district: '', sector: '', cell: '', village: '' },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.put(
        `https://agriflow-backend-cw6m.onrender.com/api/volunteer/update-volunteer/${formData.id}`,
        {
          name: formData.name,
          email: formData.email,
          locations: formData.location,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onVolunteerUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating volunteer:', error);
      onError();
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl overflow-y-auto max-h-screen">
        <h2 className="text-2xl mb-4">Edit Volunteer</h2>
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
            <label className="block text-gray-700">Locations</label>
            {formData.location.map((loc, index) => (
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
          <div className="flex justify-end mt-4 items-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`bg-gray-500 text-white px-4 py-2 rounded ml-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            {loading && (
              <div className="ml-2">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditVolunteerModal;