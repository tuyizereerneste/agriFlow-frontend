import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Farmer {
  id: string;
  names: string;
  farmerNumber: string;
  lands: Land[];
}

interface Land {
  id: string;
  size: number;
}

interface TargetPractice {
  id: string;
  title: string;
}

interface PracticeAssignment {
  targetPracticeId: string;
  landIds: string[];
}

interface EnrollFarmerPayload {
  farmerId: string;
  projectId: string;
  assignments: PracticeAssignment[];
}

interface Props {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFarmerModal({ projectId, projectTitle, onClose, onSuccess }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [farmerLands, setFarmerLands] = useState<Land[]>([]);
  const [targetPractices, setTargetPractices] = useState<TargetPractice[]>([]);
  const [assignments, setAssignments] = useState<Map<string, string[]>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Farmer[]>([]);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Search farmers
  const searchFarmers = async (query: string) => {
    try {
      const response = await axios.get<{ farmers: Farmer[] }>(`http://localhost:5000/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Log the response to check its structure
      console.log('Search response:', response.data);

      // Ensure the response data contains the farmers array
      if (response.data && Array.isArray(response.data.farmers)) {
        setSearchResults(response.data.farmers);
      } else {
        setSearchResults([]);
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('Error searching farmers:', error);
      setError('Failed to search farmers');
      setSearchResults([]);
    }
  };

  // Fetch farmer lands
  const fetchFarmerLands = async (farmerId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/farmer/farmer-land/${farmerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmerLands(response.data as Land[]);
    } catch (error) {
      console.error('Error fetching farmer lands:', error);
      setError('Failed to fetch farmer lands');
    }
  };

  // Fetch project practices
  const fetchProjectPractices = async () => {
    try {
      const response = await axios.get<{ data: TargetPractice[] }>(`http://localhost:5000/project/project-practices/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Log the response to check its structure
      console.log('Project practices response:', response.data);

      // Ensure the response data contains the data array
      if (response.data && Array.isArray(response.data.data)) {
        setTargetPractices(response.data.data);
      } else {
        setTargetPractices([]);
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching project practices:', error);
      setError('Failed to fetch project practices');
    }
  };

  // Enroll farmer
  const enrollFarmer = async () => {
    if (!selectedFarmer) return;

    const assignmentsArray = Array.from(assignments.entries()).map(([targetPracticeId, landIds]) => ({
      targetPracticeId,
      landIds
    }));

    const payload: EnrollFarmerPayload = {
      farmerId: selectedFarmer.id,
      projectId,
      assignments: assignmentsArray
    };

    try {
      setIsLoading(true);
      const response = await axios.post<{ message: string }>('http://localhost:5000/project/enroll-farmer', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      // Log the response to check its structure
      console.log('Enroll farmer response:', response.data);

      if (response.data && response.data.message === 'Farmer enrolled successfully with validated land assignments') {
        onSuccess();
        onClose();
      } else {
        throw new Error('Failed to enroll farmer');
      }
    } catch (error) {
      console.error('Error enrolling farmer:', error);
      setError('Failed to enroll farmer');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle practice assignment
  const toggleLandAssignment = (practiceId: string, landId: string) => {
    setAssignments(prev => {
      const newMap = new Map(prev);
      const currentLands = newMap.get(practiceId) || [];

      if (currentLands.includes(landId)) {
        newMap.set(practiceId, currentLands.filter(id => id !== landId));
      } else {
        newMap.set(practiceId, [...currentLands, landId]);
      }

      return newMap;
    });
  };

  useEffect(() => {
    if (selectedFarmer) {
      fetchFarmerLands(selectedFarmer.id);
      fetchProjectPractices();
    }
  }, [selectedFarmer]);

  useEffect(() => {
    if (searchTerm) {
      searchFarmers(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Add Farmer to Project</h2>
              <p className="text-sm text-gray-500 mt-1">{projectTitle}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Farmer Search */}
          {!selectedFarmer ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search farmers..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>

                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    onClick={() => navigate('/admin/create-farmer-form')}
                  >
                    + Create New Farmer
                  </button>
                </div>
              </div>


              {searchTerm && (
                <div className="mt-2 space-y-2">
                  {searchResults.map(farmer => (
                    <button
                      key={farmer.id}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border"
                      onClick={() => setSelectedFarmer(farmer)}
                    >
                      <p className="font-medium">{farmer.names}</p>
                      <p className="text-sm text-gray-500">Farmer Number: {farmer.farmerNumber}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Farmer Info */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Selected Farmer</p>
                  <p className="font-medium">{selectedFarmer.names}</p>
                  <p className="text-sm text-gray-500">Farmer Number: {selectedFarmer.farmerNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedFarmer(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Change
                </button>
              </div>

              {/* Practice Assignments */}
              <div className="space-y-4">
                <h3 className="font-medium">Assign Practices to Land</h3>
                {targetPractices.map(practice => (
                  <div key={practice.id} className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">{practice.title}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {farmerLands.map(land => (
                        <label
                          key={land.id}
                          className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={assignments.get(practice.id)?.includes(land.id) || false}
                            onChange={() => toggleLandAssignment(practice.id, land.id)}
                            className="rounded text-blue-600"
                          />
                          <span>{land.size} hectares</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-4">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={enrollFarmer}
              disabled={!selectedFarmer || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Enrolling...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Add Farmer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}