import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Activity {
  id: string;
  title: string;
}

interface Practice {
  id: string;
  title: string;
  activities: Activity[];
}

interface Farmer {
  id: string;
  names: string;
}

interface ActivityAttendanceProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onSuccess: (record: any) => void;
}

export const ActivityAttendance: React.FC<ActivityAttendanceProps> = ({ projectId, projectTitle, onClose, onSuccess }) => {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [farmerQuery, setFarmerQuery] = useState<string>('');
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null);
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => localStorage.getItem('token'), []);
  console.log('Token:', token); // Debugging statement

  useEffect(() => {
    const fetchProjectPractices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ data: Practice[] }>(`https://agriflow-backend-cw6m.onrender.com/project/project-practices/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPractices(response.data.data);
      } catch (error) {
        console.error('Error fetching project practices:', error);
        setError('Failed to fetch project practices. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectPractices();
  }, [projectId, token]);

  useEffect(() => {
    if (selectedPractice) {
      const fetchPracticeActivities = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<{ data: Activity[] }>(`https://agriflow-backend-cw6m.onrender.com/project/practice-activities/${selectedPractice}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setActivities(response.data.data);
        } catch (error) {
          console.error('Error fetching practice activities:', error);
          setError('Failed to fetch practice activities. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchPracticeActivities();
    }
  }, [selectedPractice, token]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length > 0) {
        setLoading(true);
        setError(null);
        try {
          console.log('Searching farmers with query:', query); // Debugging statement
          const response = await axios.get<{ farmers: Farmer[] }>(`https://agriflow-backend-cw6m.onrender.com/search?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Full search response:', response); // Log the entire response
          console.log('Search results:', response.data.farmers); // Adjusted to log the correct part of the response
          setFarmers(response.data.farmers); // Adjusted to set the correct part of the response
        } catch (error) {
          console.error('Error searching farmers:', error);
          setError('Failed to search farmers. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setFarmers([]);
      }
    }, 300),
    [token]
  );

  const handleFarmerQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFarmerQuery(query);
    debouncedSearch(query);
  };

  const handleScanQRCode = () => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10 }, false);
    scanner.render(async (qrCodeMessage) => {
      console.log(`QR code scanned: ${qrCodeMessage}`);
      setSelectedFarmer(qrCodeMessage);

      // Optional: Make an API call to retrieve additional farmer information
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<{ farmer: Farmer }>(`https://agriflow-backend-cw6m.onrender.com/farmers/${qrCodeMessage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmerQuery(response.data.farmer.names); // Update the farmer query with the farmer's name
      } catch (error) {
        console.error('Error retrieving farmer information:', error);
        setError('Failed to retrieve farmer information. Please try again.');
      } finally {
        setLoading(false);
        scanner.clear().catch(error => {
          console.error('Failed to clear scanner:', error);
        });
      }
    }, errorMessage => {
      console.error('QR code scan error:', errorMessage);
      setError('Failed to scan QR code. Please try again.');
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedActivity || !selectedFarmer) {
      setError('Please select an activity and a farmer.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('activityId', selectedActivity);
    formData.append('farmerId', selectedFarmer);
    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
    }
    formData.append('notes', notes);

    console.log('Request payload:', Object.fromEntries(formData.entries())); // Log the request payload

    try {
      const response = await axios.post('https://agriflow-backend-cw6m.onrender.com/project/attendance', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error recording attendance:', error);
      setError('Failed to record attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-4">Record Attendance for {projectTitle}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Select Practice</label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedPractice || ''}
              onChange={(e) => setSelectedPractice(e.target.value)}
              required
            >
              <option value="" disabled>Select a practice</option>
              {practices.map((practice) => (
                <option key={practice.id} value={practice.id}>
                  {practice.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select Activity</label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedActivity || ''}
              onChange={(e) => setSelectedActivity(e.target.value)}
              required
              disabled={!selectedPractice}
            >
              <option value="" disabled>Select an activity</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Search Farmer</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={farmerQuery}
              onChange={handleFarmerQueryChange}
              placeholder="Enter farmer name"
            />
            {farmers && farmers.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                {farmers.map((farmer) => (
                  <li
                    key={farmer.id}
                    className="p-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFarmer(farmer.id);
                      setFarmerQuery(farmer.names);
                      setFarmers([]);
                    }}
                  >
                    {farmer.names}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <button
              type="button"
              className="w-full p-2 bg-blue-500 text-white rounded-md"
              onClick={handleScanQRCode}
            >
              Scan QR Code
            </button>
            <div id="qr-reader" style={{ width: '300px' }}></div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Photos</label>
            <input
              type="file"
              className="w-full p-2 border rounded-md"
              multiple
              onChange={(e) => setPhotos(e.target.files)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};