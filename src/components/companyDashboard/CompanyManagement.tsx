// CompanyManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateCompanyModal from './CreateCompanyModal';
import EditCompanyModal from './EditCompanyModal';

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

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get<{ data: Company[] }>('http://localhost:5000/company/get-all-companies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(response.data.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      showMessage('error', 'Failed to fetch companies');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompanies = companies.filter(company =>
    company.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteCompany = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/company/delete-company/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showMessage('success', 'Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      showMessage('error', 'Failed to delete company');
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
      <h1 className="text-2xl mb-4">Manage Companies</h1>
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
        placeholder="Search companies..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Company
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map(company => (
          <div key={company.id} className="bg-white p-4 rounded shadow">
            <img
              src={`http://localhost:5000/uploads/logos/${company.logo}`}
              alt={company.user.name}
              className="w-full h-32 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-bold">{company.user.name}</h2>
            <p className="text-gray-600">{company.user.email}</p>
            <p className="text-gray-600">TIN: {company.tin}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Locations:</h3>
              <ul>
                {company.location.map((loc, index) => (
                  <li key={index} className="text-gray-600">
                    {loc.province}, {loc.district}, {loc.sector}, {loc.cell}, {loc.village}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedCompany(company);
                  setShowEditModal(true);
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCompany(company.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateCompanyModal
          onClose={() => setShowCreateModal(false)}
          onCompanyCreated={() => {
            fetchCompanies();
            showMessage('success', 'Company created successfully');
          }}
          onError={() => showMessage('error', 'Failed to create company')}
        />
      )}

      {showEditModal && selectedCompany && (
        <EditCompanyModal
          company={selectedCompany}
          onClose={() => setShowEditModal(false)}
          onCompanyUpdated={() => {
            fetchCompanies();
            showMessage('success', 'Company updated successfully');
          }}
          onError={() => showMessage('error', 'Failed to update company')}
        />
      )}
    </div>
  );
};

export default CompanyManagement;