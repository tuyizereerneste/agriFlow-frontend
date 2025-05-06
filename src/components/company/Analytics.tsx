// pages/company/dashboard/Analytics.tsx
const Analytics: React.FC = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Progress Analytics</h1>
        <ul className="space-y-3">
          <li>✅ 15 Trainings Held</li>
          <li>👨‍🌾 280 Farmers Trained</li>
          <li>📷 120+ Photos Submitted</li>
          <li>🌱 12,000 Trees Planted</li>
        </ul>
        {/* Chart placeholders */}
        <div className="mt-6 bg-white p-6 rounded shadow text-gray-500 text-center">
          [ Graphs and Charts will be rendered here ]
        </div>
      </div>
    );
  }
  
  export default Analytics;