// components/company/CompanyHeader.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CompanyHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    // Clear token or session logic here
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1 className="text-xl font-bold text-green-700">Company Dashboard</h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
        >
          <span className="text-sm font-medium text-gray-700">Company Admin</span>
          <img
            src="/profile.png"
            alt="Profile"
            className="w-8 h-8 rounded-full border"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
            <Link
              to="/company-profile"
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
    </header>
  );
}