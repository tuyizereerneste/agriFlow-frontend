import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Download, Plus, User, MapPin, Phone, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AddFarmerForm from '../components/farmers/AddFarmerForm';

interface Farmer {
  id: number;
  name: string;
  location: string;
  phone: string;
  email: string;
  crops: string[];
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
}

const sampleFarmers: Farmer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    location: 'San Jose, Costa Rica',
    phone: '+506 8765 4321',
    email: 'maria.garcia@example.com',
    crops: ['Coffee', 'Bananas'],
    registrationDate: '2024-03-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'John Mwangi',
    location: 'Nakuru, Kenya',
    phone: '+254 712 345678',
    email: 'john.mwangi@example.com',
    crops: ['Maize', 'Beans'],
    registrationDate: '2024-02-28',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    location: 'Gujarat, India',
    phone: '+91 98765 43210',
    email: 'aisha.patel@example.com',
    crops: ['Cotton', 'Rice'],
    registrationDate: '2024-01-10',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 4,
    name: 'Carlos Rodriguez',
    location: 'Medellin, Colombia',
    phone: '+57 321 456 7890',
    email: 'carlos.rodriguez@example.com',
    crops: ['Coffee', 'Avocados'],
    registrationDate: '2023-12-05',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 5,
    name: 'Fatima Nkosi',
    location: 'Durban, South Africa',
    phone: '+27 82 123 4567',
    email: 'fatima.nkosi@example.com',
    crops: ['Sugarcane', 'Vegetables'],
    registrationDate: '2023-11-20',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const Farmers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddFarmer, setShowAddFarmer] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    location: '',
    crop: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredFarmers = sampleFarmers.filter(farmer => {
    // Search filter
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          farmer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || farmer.status === filters.status;
    
    // Location filter
    const matchesLocation = !filters.location || 
                            farmer.location.toLowerCase().includes(filters.location.toLowerCase());
    
    // Crop filter
    const matchesCrop = !filters.crop || 
                        farmer.crops.some(crop => crop.toLowerCase().includes(filters.crop.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesLocation && matchesCrop;
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  if (showAddFarmer) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Farmer</h1>
            <p className="mt-1 text-sm text-gray-500">
              Register a new farmer in the system
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAddFarmer(false)}
          >
            Back to List
          </Button>
        </div>
        <AddFarmerForm />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Farmers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view all registered farmers in the system
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search farmers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              leftIcon={<Filter size={16} />}
              rightIcon={<ChevronDown size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button 
              variant="outline" 
              leftIcon={<Download size={16} />}
            >
              Export
            </Button>
            <Button 
              variant="primary" 
              leftIcon={<Plus size={16} />}
              onClick={() => setShowAddFarmer(true)}
            >
              Add Farmer
            </Button>
          </div>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Filter by location"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-1">
                  Crop
                </label>
                <input
                  type="text"
                  id="crop"
                  name="crop"
                  placeholder="Filter by crop"
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={filters.crop}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilters({ status: 'all', location: '', crop: '' })}
              >
                Clear Filters
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Farmers List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredFarmers.length > 0 ? (
            filteredFarmers.map((farmer) => (
              <li key={farmer.id}>
                <a href={`/farmers/${farmer.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img className="h-12 w-12 rounded-full" src={farmer.avatar} alt={farmer.name} />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-primary-600 truncate">{farmer.name}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[farmer.status]}`}>
                              {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="truncate">{farmer.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="truncate">{farmer.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="truncate">{farmer.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="truncate">Registered on {new Date(farmer.registrationDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {farmer.crops.map((crop, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))
          ) : (
            <li className="px-4 py-12">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No farmers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
                <div className="mt-6">
                  <Button variant="primary" leftIcon={<Plus size={16} />}>
                    Add New Farmer
                  </Button>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Farmers;