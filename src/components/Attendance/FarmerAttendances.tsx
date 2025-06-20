import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "react-modal";

interface Project {
  title: string;
  description: string;
  objectives: string;
  startDate: string;
  endDate: string;
  owner: {
    name: string;
  };
}

interface TargetPractice {
  title: string;
  initialSituation: string;
  project: Project;
}

interface Activity {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetPractice: TargetPractice;
}

interface Farmer {
  names: string;
  farmerNumber: string;
}

interface AttendanceRecord {
  id: string;
  notes: string;
  createdAt: string;
  photos: string[];
  farmer: Farmer;
  activity: Activity;
}

interface ApiResponse {
  message: string;
  data: AttendanceRecord[];
}

const FarmerAttendances: React.FC = () => {
  const { farmerId } = useParams<{ farmerId: string }>();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!farmerId) return;
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<ApiResponse>(
          `http://localhost:5000/api/project/farmer-attendance/${farmerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecords(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmerId]);

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (records.length === 0) return <div className="p-6 text-center">No attendance records found.</div>;

  const farmer = records[0].farmer;
  const project = records[0].activity.targetPractice.project;

  // Group records by practice
  const practicesMap = new Map<string, { practice: TargetPractice; activities: AttendanceRecord[] }>();

  records.forEach((record) => {
    const practiceTitle = record.activity.targetPractice.title;
    if (!practicesMap.has(practiceTitle)) {
      practicesMap.set(practiceTitle, {
        practice: record.activity.targetPractice,
        activities: [],
      });
    }
    practicesMap.get(practiceTitle)?.activities.push(record);
  });

  const practices = Array.from(practicesMap.values());

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-1">Attendance for: {farmer.names}</h1>
        <p className="text-gray-600">Farmer Number: {farmer.farmerNumber}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Project Details</h2>
        <p className="mb-2"><strong className="text-gray-700">Title:</strong> {project.title}</p>
        <p className="mb-2"><strong className="text-gray-700">Description:</strong> {project.description}</p>
        <p className="mb-2"><strong className="text-gray-700">Objectives:</strong> {project.objectives}</p>
        <p className="mb-2"><strong className="text-gray-700">Duration:</strong> {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</p>
        <p className="mb-2"><strong className="text-gray-700">Owner:</strong> {project.owner.name}</p>
      </div>

      {practices.map(({ practice, activities }) => (
        <div key={practice.title} className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Practice: {practice.title}</h2>
          <p className="text-gray-600 mb-4">{practice.initialSituation}</p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Activities Attended</h3>
            <div className="space-y-4">
              {activities.map((record) => {
                const activity = record.activity;
                return (
                  <div key={record.id} className="p-4 border rounded-lg bg-white">
                    <h4 className="text-lg font-bold text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      <strong>Date:</strong> {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 text-sm">
                      <p><strong>Notes:</strong> {record.notes}</p>
                      <p><strong>Attended At:</strong> {new Date(record.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {record.photos.map((photo, idx) => {
                        const photoUrl = `http://localhost:5000/api/uploads/attendance/${photo}`;
                        return (
                          <div key={idx} className="relative group cursor-pointer">
                            <img
                              src={photoUrl}
                              alt={`Attendance ${idx}`}
                              className="w-full h-48 object-cover rounded-lg"
                              onClick={() => setSelectedImage(photoUrl)}
                            />
                            <a
                              href={photoUrl}
                              download
                              className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded-lg shadow hover:bg-gray-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Download
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      {selectedImage && (
        <Modal
          isOpen={true}
          onRequestClose={() => setSelectedImage(null)}
          contentLabel="Image Preview"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4"
          overlayClassName="fixed inset-0"
        >
          <div className="relative bg-white rounded-lg p-4 max-w-3xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
            >
              ✕
            </button>
            <img src={selectedImage} alt="Full view" className="w-full h-auto rounded-lg" />
            <a
              href={selectedImage}
              download
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Download Image
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FarmerAttendances;