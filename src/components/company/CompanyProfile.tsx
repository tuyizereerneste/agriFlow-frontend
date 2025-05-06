import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Camera, Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CompanyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'AgroSolve Ltd.',
    industry: 'Agricultural Technology',
    email: 'contact@agrosolve.com',
    phone: '+1 (800) 555-0199',
    location: 'Nairobi, Kenya',
    about:
      'AgroSolve is committed to empowering farmers through data-driven solutions and sustainable practices. We partner with institutions to monitor, train, and support field projects for greater impact.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save company profile changes
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Company Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your company information and preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile header */}
        <div className="relative h-40 bg-primary-600">
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <img
                className="h-24 w-24 rounded-full border-4 border-white"
                src="https://images.unsplash.com/photo-1581093588401-9b1d53c0e148?auto=format&fit=crop&w=256&q=80"
                alt="Company Logo"
              />
              {isEditing && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 rounded-full bg-primary-600 p-1 text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-sm text-gray-500">{formData.industry}</p>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    leftIcon={<Building2 size={18} />}
                  />
                  <Input
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    leftIcon={<Building2 size={18} />}
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail size={18} />}
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    leftIcon={<Phone size={18} />}
                  />
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    leftIcon={<MapPin size={18} />}
                  />
                </div>
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={formData.about}
                    onChange={handleChange}
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="mr-2 h-5 w-5 text-gray-400" />
                    {formData.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="mr-2 h-5 w-5 text-gray-400" />
                    {formData.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                    {formData.location}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">About</h3>
                  <p className="mt-1 text-sm text-gray-500">{formData.about}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Security</h3>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-500">Last changed 2 months ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          <div className="mt-6">
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;