// components/company/CompanySidebar.tsx
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Overview", path: "/company/overview" },
  { label: "Project Activities", path: "/company/activities" },
  { label: "Analytics", path: "/company/analytics" },
  { label: "Reports", path: "/company/reports" }, 
  { label: "Notifications", path: "/company/notifications" },
  // { label: "Profile", path: "/company/profile" },
];

export default function CompanySidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      <div className="px-6 py-4 text-xl font-bold">AgroSolve</div>
      <nav className="flex flex-col gap-1 px-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded hover:bg-gray-100 ${
              pathname === link.path ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}