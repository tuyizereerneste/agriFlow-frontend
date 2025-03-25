import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Phone, ArrowLeft, Edit, Trash } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  phones: string[];
  dob: string;
  gender: string;
}

interface Child {
  id: string;
  name: string;
  dob: string;
  gender: string;
}

interface Land {
  id: string;
  size: number;
  latitude: number;
  longitude: number;
  ownership: string;
  crops: string[];
  image: string;
  nearby: string[];
}

interface Farmer {
  id: string;
  names: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  phones: string[];
  dob: string;
  gender: string;
  createdAt: string;
  partner?: Partner;
  children?: Child[];
  lands?: Land[];
}

const FarmerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Farmer>(
          `https://agriflow-backend-cw6m.onrender.com/farmer/get-farmer/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFarmer(response.data);
      } catch (error) {
        console.error("❌ Error fetching farmer details:", error);
        setError("Failed to load farmer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [id, token]);

  const handleDelete = async () => {
    if (!token || !farmer) return;

    try {
      await axios.delete(`https://agriflow-backend-cw6m.onrender.com/farmer/delete-farmer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/farmers");
    } catch (error) {
      console.error("❌ Error deleting farmer:", error);
      setError("Failed to delete farmer.");
    }
  };

  const handleUpdate = () => {
    // Navigate to the update page or open a modal for updating
    console.log("Update farmer:", farmer);
  };

  if (loading) return <p>Loading farmer details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!farmer) return <p className="text-gray-500">Farmer not found.</p>;

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <div className="mb-6 flex items-center">
        <Link to="/farmers" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="mr-2" size={18} />
          Back to Farmers
        </Link>
      </div>

      <div className="bg-white shadow rounded-md p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-center mb-4">Farmer Details</h1>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 form-field">
            <label className="text-gray-600 font-medium">Names:</label>
            <p className="text-gray-800">{farmer.names}</p>
          </div>

          <div className="flex items-center space-x-4 form-field ">
            <label className="text-gray-600 font-medium">Gender:</label>
            <p className="text-gray-800">{farmer.gender}</p>
          </div>

          <div className="form-field flex items-center space-x-4">
            <label className="text-gray-600 font-medium">Date of Birth:</label>
            <p className="text-gray-800">{new Date(farmer.dob).toDateString()}</p>
          </div>

          <div className="form-field flex items-center space-x-4">
            <label className="text-gray-600 font-medium">Province:</label>
            <p className="text-gray-800">{farmer.province}</p>
          </div>

          <div className="form-field flex items-center space-x-4">
            <label className="text-gray-600 font-medium">District:</label>
            <p className="text-gray-800">{farmer.district}</p>
          </div>

          <div className="form-field flex items-center space-x-4">
            <label className="text-gray-600 font-medium">Sector:</label>
            <p className="text-gray-800">{farmer.sector}</p>
          </div>

          <div className="form-field flex items-center space-x-4">
            <label className="text-gray-600 font-medium">Cell:</label>
            <p className="text-gray-800">{farmer.cell}</p>
          </div>

          <div className="form-field flex items-center space-x-4">
            <label className="text-gray-600 font-medium">Village:</label>
            <p className="text-gray-800">{farmer.village}</p>
          </div>

          <div className="form-field flex items-center space-x-4">
            <label className="text-gray-600 font-medium">Phone Numbers:</label>
            <p className="text-gray-800">
              <Phone className="inline-block mr-1" size={16} />
              {farmer.phones.join(", ")}
            </p>
          </div>
        </div>

        {/* Partner Details */}
        {farmer.partner && (
          <div className="bg-white p-4 rounded-md mt-4">
            <h2 className="text-xl font-semibold mb-2">Partner</h2>
            <div className="space-y-2">
              <div className="form-field flex items-center space-x-4">
                <label className="text-gray-600 font-medium">Name:</label>
                <p className="text-gray-800">{farmer.partner.name}</p>
              </div>
              <div className="form-field flex items-center space-x-4">
                <label className="text-gray-600 font-medium">Gender:</label>
                <p className="text-gray-800">{farmer.partner.gender}</p>
              </div>
              <div className="form-field flex items-center space-x-4">
                <label className="text-gray-600 font-medium">Date of Birth:</label>
                <p className="text-gray-800">{new Date(farmer.partner.dob).toDateString()}</p>
              </div>
              <div className="form-field flex items-center space-x-4">
                <label className="text-gray-600 font-medium">Phone Numbers:</label>
                <p className="text-gray-800">
                  <Phone className="inline-block mr-1" size={16} />
                  {farmer.partner.phones.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Children */}
        {farmer.children && farmer.children.length > 0 && (
          <div className="bg-white p-4 rounded-md mt-4">
            <h2 className="text-xl font-semibold mb-2">Children</h2>
            {farmer.children.map((child) => (
              <div key={child.id} className="space-y-2 mt-4 border-t pt-4">
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Name:</label>
                  <p className="text-gray-800">{child.name}</p>
                </div>
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Gender:</label>
                  <p className="text-gray-800">{child.gender}</p>
                </div>
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Date of Birth:</label>
                  <p className="text-gray-800">{new Date(child.dob).toDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lands */}
        {farmer.lands && farmer.lands.length > 0 && (
          <div className="bg-white p-4 rounded-md mt-4">
            <h2 className="text-xl font-semibold mb-2">Lands</h2>
            {farmer.lands.map((land) => (
              <div key={land.id} className="space-y-2 mt-4 border-t pt-4">
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Size:</label>
                  <p className="text-gray-800">{land.size} sqm</p>
                </div>
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Ownership:</label>
                  <p className="text-gray-800">{land.ownership}</p>
                </div>
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Latitude:</label>
                  <p className="text-gray-800">{land.latitude}</p>
                </div>
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Longitude:</label>
                  <p className="text-gray-800">{land.longitude}</p>
                </div>
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Nearby:</label>
                  <p className="text-gray-800">{land.nearby.join(", ")}</p>
                </div>
                <div className="form-field flex items-center space-x-4">
                  <label className="text-gray-600 font-medium">Crops:</label>
                  <p className="text-gray-800">{land.crops.join(", ")}</p>
                </div>
                {land.image && (
                  <div className="form-field mt-2">
                    <img src={land.image} alt="Land" className="rounded-md shadow-md w-64" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Update and Delete Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            onClick={handleUpdate}
          >
            <Edit className="mr-2" size={16} />
            Update
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
            onClick={handleDelete}
          >
            <Trash className="mr-2" size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetails;