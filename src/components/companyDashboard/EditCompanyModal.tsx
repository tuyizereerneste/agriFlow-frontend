// EditCompanyModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Location {
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
  password: string;
  role: string | null;
  type: string;
}

interface Company {
  id: string;
  logo: string;
  tin: string;
  userId: string;
  user: User;
  location: Location[];
}

interface EditCompanyModalProps {
  company: Company;
  onClose: () => void;
  onCompanyUpdated: () => void;
  onError: () => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ company, onClose, onCompanyUpdated, onError }) => {
  const [formData, setFormData] = useState<Company>(company);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setFormData(company);
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      user: {
        ...formData.user,
        [name]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogo(e.target.files[0]);
    }
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

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.user.name);
    formDataToSend.append('email', formData.user.email);
    formDataToSend.append('tin', formData.tin);
    formDataToSend.append('locations', JSON.stringify(formData.location));
    if (logo) {
      formDataToSend.append('logo', logo);
    }

    try {
      setLoading(true);
      await axios.put(`https://agriflow-backend-cw6m.onrender.com/api/company/update-company/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onCompanyUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating company:', error);
      onError();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl overflow-y-auto max-h-screen">
        <h2 className="text-2xl mb-4">Edit Company</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.user.name}
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
              value={formData.user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">TIN</label>
            <input
              type="text"
              name="tin"
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Logo</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded"
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
          <div className="flex justify-end mt-4">
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
              className={`bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyModal;