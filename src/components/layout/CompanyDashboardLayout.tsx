// layouts/CompanyDashboardLayout.tsx
import { Outlet } from "react-router-dom";
import CompanySidebar from "../company/CompanySidebar";
import CompanyHeader from "../company/CompanyHeader";
import CompanyOverview from "../company/Overview";

export default function CompanyDashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <CompanySidebar />
      <div className="flex flex-col flex-1">
        <CompanyHeader />
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
