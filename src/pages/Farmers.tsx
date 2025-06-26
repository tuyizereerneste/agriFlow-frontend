import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, ChevronDown, Download, Plus, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AddFarmerForm from "../components/farmers/AddFarmerForm";

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

interface Location {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  latitude?: number;
  longitude?: number;
}

interface Land {
  id: string;
  size: number;
  ownership: string;
  crops: string[];
  image: string;
  nearby: string[];
  locations: {
    location: Location;
  }[];
}

interface Farmer {
  id: string;
  names: string;
  phones: string[];
  dob: string;
  gender: string;
  createdAt: string;
  farmerNumber: string;
  location: Location;
  partner?: Partner;
  children?: Child[];
  lands?: Land[];
}


const Farmers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddFarmer, setShowAddFarmer] = useState(false);
  const [filters, setFilters] = useState({
    ownership: "",
    crops: "",
    nearby: "",
    size: "",
  });
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFarmers();
  }, [searchTerm, filters]);

  const fetchFarmers = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ farmers: Farmer[] }>("http://localhost:5000/api/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          query: searchTerm || undefined,
          ownership: filters.ownership || undefined,
          crops: filters.crops.trim() || undefined,
          nearby: filters.nearby || undefined,
          minSize: filters.size || undefined,
        },
      });

      setFarmers(response.data.farmers);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setError("Failed to fetch farmers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportFarmers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/farmers/export-excel", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data as Blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "farmers_data.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting farmers:", error);
      setError("Failed to export farmers.");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (showAddFarmer) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Add New Farmer</h1>
          <Button variant="outline" onClick={() => setShowAddFarmer(false)}>Back to List</Button>
        </div>
        <AddFarmerForm />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Farmers</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and view all registered farmers</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search farmers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" leftIcon={<Filter size={16} />} rightIcon={<ChevronDown size={16} />} onClick={() => setShowFilters(!showFilters)}>
          Filters
        </Button>
        <Button variant="outline" leftIcon={<Download size={16} />} onClick={exportFarmers}>
          Export
        </Button>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowAddFarmer(true)}>
          Add Farmer
        </Button>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="bg-white p-4 border rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Ownership</label>
              <select name="ownership" className="block w-full border rounded-md p-2" value={filters.ownership} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Crops</label>
              <Input type="text" name="crops" placeholder="Filter by crop" value={filters.crops} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-sm font-medium">Nearby</label>
              <select name="nearby" className="block w-full border rounded-md p-2" value={filters.nearby} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="River">River</option>
                <option value="Road">Road</option>
                <option value="Lake">Lake</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Size</label>
              <Input type="text" name="size" placeholder="Filter by size" value={filters.size} onChange={handleFilterChange} />
            </div>
          </div>
        </div>
      )}

      {/* Farmers List */}
      {loading ? (
        <p>Loading farmers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul>
            {farmers.length > 0 ? (
              farmers.map((farmer) => (
                <li key={farmer.id} className="border-b">
                  <Link to={`/admin/farmer-details/${farmer.id}`} className="block p-4 hover:bg-gray-50 flex items-center">
                    <div className="flex-1">
                      <p className="text-lg font-medium">{farmer.names}</p>
                      <p className="text-sm text-gray-500">
                        <strong>Farmer Number:</strong> {farmer.farmerNumber}
                      </p>
                      {farmer.location && (
                        <p className="text-sm text-gray-500">
                          <strong>Location:</strong> {farmer.location.province}, {farmer.location.district}
                        </p>
                      )}
                      <p className="text-sm text-gray-500"><Phone size={14} className="inline-block mr-1" /> {farmer.phones[0]}</p>
                    </div>
                    <MapPin size={20} className="text-gray-400" />
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-center py-6">No farmers found</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Farmers;