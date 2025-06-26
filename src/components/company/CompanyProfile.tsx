import React, { useEffect, useState } from "react";
import axios from "axios";
import CompanyChangePasswordModal from "./CompanyChangePasswordModal";

interface CompanyLocation {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

interface CompanyProfileData {
  id: string;
  name: string;
  email: string;
  type: string;
  role: string | null;
  company: {
    id: string;
    logo: string | null;
    tin: string;
    location: CompanyLocation[];
  } | null;
}

export default function CompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get<CompanyProfileData>(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-4 text-center">Loading profile...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (!profile) return <p className="p-4 text-center">No profile data available.</p>;

  const { name, email, company } = profile;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-green-700">Company Profile</h2>

          {/* Company Logo */}
          <div className="mb-6">
            {company?.logo ? (
              <img
                src={`http://localhost:5000/uploads/logos/${company.logo}`}
                alt="Company Logo"
                className="w-32 h-32 object-contain rounded-full border-4 border-green-100 p-2"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Logo</span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="w-full">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Company Name</h3>
              <p className="text-gray-600">{name}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Email</h3>
              <p className="text-gray-600">{email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-gray-700">TIN</h3>
              <p className="text-gray-600">{company?.tin ?? "N/A"}</p>
            </div>

            {/* Location Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Location</h3>
              {company?.location && company.location.length > 0 ? (
                company.location.map((loc, index) => (
                  <div key={index} className="border rounded p-4 mb-4 bg-white shadow-sm">
                    <p className="text-gray-700"><strong>Province:</strong> {loc.province}</p>
                    <p className="text-gray-700"><strong>District:</strong> {loc.district}</p>
                    <p className="text-gray-700"><strong>Sector:</strong> {loc.sector}</p>
                    <p className="text-gray-700"><strong>Cell:</strong> {loc.cell}</p>
                    <p className="text-gray-700"><strong>Village:</strong> {loc.village}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No locations available.</p>
              )}
            </div>

            {/* Change Password Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <CompanyChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}