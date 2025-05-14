// pages/company/dashboard/Reports.tsx
const Reports: React.FC = function () {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Downloadable Reports</h1>
        <ul className="list-disc pl-6 space-y-2">
          <li>📄 Farmer Attendance Logs</li>
          <li>🖼️ Field Photos</li>
          <li>📊 Project Progress Summaries</li>
          <li>🌍 Land Usage Reports</li>
        </ul>
        <div className="mt-6 text-gray-500">[ Export buttons will appear here ]</div>
      </div>
    );
  }

  export default Reports;
  