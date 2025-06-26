import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  type: string;
  role?: string | null;
  company?: {
    id: string;
    logo?: string;
    tin: string;
  } | null;
  location?: any[];
}

export default function CompanyHeader() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch company profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<UserProfile>(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <p>Loading...</p>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1 className="text-xl font-bold text-green-700">Company Dashboard</h1>

      {profile && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            {/* Company Name */}
            <span className="text-sm font-medium text-gray-700">
              {profile.name}
            </span>

            {/* Company Logo */}
            {profile.company?.logo ? (
              <img
                src={`http://localhost:5000/uploads/logos/${profile.company.logo}`}
                alt="Company Logo"
                className="w-8 h-8 rounded-full border object-cover"
              />
            ) : (
              <img
                src="/profile.png"
                alt="Default Profile"
                className="w-8 h-8 rounded-full border"
              />
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
              <Link
                to="/company/company-profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}