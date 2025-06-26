import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import QRScanner from './QRScanner';
import ImageCaptureModal from './ImageCapture';

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
  const [images, setImages] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);

  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    const fetchProjectPractices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ data: Practice[] }>(`http://localhost:5000/api/project/project-practices/${projectId}`, {
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
          const response = await axios.get<{ data: Activity[] }>(`http://localhost:5000/api/project/practice-activities/${selectedPractice}`, {
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
          const response = await axios.get<{ farmers: Farmer[] }>(`http://localhost:5000/api/search?query=${query}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFarmers(response.data.farmers);
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
    setScanning(true);
  };

  const handleCancelScan = () => {
    setScanning(false);
  };

  const handleScan = (qrCodeData: { id: string; names: string }) => {
    setSelectedFarmer(qrCodeData.id);
    setFarmerQuery(qrCodeData.names);
    setFarmers([]);
    setScanning(false);
  };
  
  
  
const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    setImages([...images, ...Array.from(event.target.files)]);
  }
};

const handleRemoveImage = (indexToRemove: number) => {
  setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
};

const handleCapture = (capturedFile: File) => {
  setImages([...images, capturedFile]);
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
    images.forEach((file) => {
      formData.append("photos", file);
    });
    formData.append('notes', notes);

    try {
      const response = await axios.post('http://localhost:5000/api/project/attendance', formData, {
        headers: {
	      "Content-Type": "multipart/form-data",
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
          {/* Practice Selection */}
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
                <option key={practice.id} value={practice.id}>{practice.title}</option>
              ))}
            </select>
          </div>

          {/* Activity Selection */}
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
                <option key={activity.id} value={activity.id}>{activity.title}</option>
              ))}
            </select>
          </div>

          {/* Farmer Search */}
          <div className="mb-4">
            <label className="block text-gray-700">Search Farmer</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={farmerQuery}
              onChange={handleFarmerQueryChange}
              placeholder="Enter farmer name"
              disabled={scanning}
            />
            {farmers.length > 0 && (
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

          {/* QR Code Scan Button */}
          <div className="mb-4">
            <button
              type="button"
              className="w-full p-2 bg-blue-500 text-white rounded-md"
              onClick={handleScanQRCode}
              disabled={scanning}
            >
              Scan QR Code
            </button>
          </div>

          {/* QR Scanner Modal */}
          {scanning && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-4 rounded-md">
                <QRScanner onScan={handleScan} />
                <button
                  type="button"
                  className="mt-2 w-full p-2 bg-red-500 text-white rounded-md"
                  onClick={handleCancelScan}
                >
                  Cancel Scan
                </button>
              </div>
            </div>
          )}

          {/* Photos & Notes */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Upload Photos</label>

            {/* Upload from device */}
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg mb-2"
              onChange={handleImageChange}
            />

            {/* Button to open the ImageCapture modal */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Take a Photo
            </button>

            {/* ImageCapture Modal */}
            <ImageCaptureModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onCapture={handleCapture}
            />

            {/* Show selected images with preview and delete */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div key={index} className="relative border rounded p-2 bg-gray-100 shadow">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                    >
                      ✕
                    </button>
                    <p className="text-xs mt-1 break-words text-center">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
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

          {/* Submit */}
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