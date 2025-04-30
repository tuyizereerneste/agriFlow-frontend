import React, { useState } from "react";
import axios from "axios";

const FarmerToProject: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  interface Farmer {
    id: string;
    names: string;
  }

  interface SearchResponse {
    farmers: Farmer[];
  }

  const handleSearch = async () => {
    if (!searchTerm) return; // Avoid empty searches

    try {
      const response = await axios.get<SearchResponse>("http://localhost:5000/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: searchTerm },
      });
      setFarmers(response.data.farmers); // Update state with search results
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch farmers.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Search Farmers</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white">
          Search
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {farmers.length > 0 ? (
          <ul>
            {farmers.map((farmer) => (
              <li key={farmer.id}>{farmer.names}</li>
            ))}
          </ul>
        ) : (
          <p>No farmers found</p>
        )}
      </div>
    </div>
  );
};

export default FarmerToProject;