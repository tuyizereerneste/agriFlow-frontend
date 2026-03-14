import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Location {
  id: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

interface Company {
  id: string;
  logo?: string;
  tin: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  type: string;
  role: string | null;
  company: Company | null;
  location: Location[];
}

const Settings: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<UserProfile>('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/user/change-password',
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Failed to change password.');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center text-red-500">Unable to load user data.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      <div className="mb-4">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Type:</span> {user.type}</p>
        <p><span className="font-semibold">Role:</span> {user.role || 'N/A'}</p>
      </div>

      {user.company && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Company Info</h3>
          <p><span className="font-semibold">TIN:</span> {user.company.tin}</p>
          {user.company.logo && (
            <img
              src={`http://localhost:5000/uploads/logos/${user.company.logo}`}
              alt="Company Logo"
              className="w-32 h-32 object-contain border rounded mt-2"
            />
          )}
        </div>
      )}

      {user.location?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Location(s)</h3>
          {user.location.map((loc) => (
            <div key={loc.id} className="mb-2 p-2 border rounded">
              <p><span className="font-semibold">Province:</span> {loc.province}</p>
              <p><span className="font-semibold">District:</span> {loc.district}</p>
              <p><span className="font-semibold">Sector:</span> {loc.sector}</p>
              <p><span className="font-semibold">Cell:</span> {loc.cell}</p>
              <p><span className="font-semibold">Village:</span> {loc.village}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowPasswordForm(!showPasswordForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
      </button>

      {showPasswordForm && (
        <form onSubmit={handlePasswordChange} className="mt-4">
          <div className="mb-2">
            <label className="block font-medium">Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium">Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Update Password
          </button>
        </form>
      )}

      {message && (
        <div className="mt-4 text-sm text-center text-blue-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default Settings;