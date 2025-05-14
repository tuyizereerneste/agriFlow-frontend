import React from 'react';
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '../utils/cn';

const stats = [
  { 
    id: 1, 
    name: 'Total Farmers', 
    value: '543', 
    change: '+12.3%', 
    trend: 'up',
    icon: <Users size={20} className="text-blue-500" />,
    color: 'bg-blue-50'
  },
  { 
    id: 2, 
    name: 'Data Entries', 
    value: '1,765', 
    change: '+23.1%', 
    trend: 'up',
    icon: <FileText size={20} className="text-green-500" />,
    color: 'bg-green-50'
  },
  { 
    id: 3, 
    name: 'Training Sessions', 
    value: '24', 
    change: '+4.5%', 
    trend: 'up',
    icon: <Calendar size={20} className="text-purple-500" />,
    color: 'bg-purple-50'
  },
  { 
    id: 4, 
    name: 'Market Connections', 
    value: '15', 
    change: '-2.3%', 
    trend: 'down',
    icon: <ShoppingBag size={20} className="text-orange-500" />,
    color: 'bg-orange-50'
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'added a new farmer',
    subject: 'Maria Garcia',
    time: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    action: 'completed data collection for',
    subject: 'Rice Cultivation Survey',
    time: '4 hours ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    user: 'Michael Brown',
    action: 'scheduled a training session on',
    subject: 'Sustainable Farming Practices',
    time: 'Yesterday at 3:45 PM',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 4,
    user: 'Emily Wilson',
    action: 'created a new market connection with',
    subject: 'Organic Produce Co-op',
    time: 'Yesterday at 1:23 PM',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 5,
    user: 'David Lee',
    action: 'updated farmer profile for',
    subject: 'Carlos Rodriguez',
    time: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your agricultural development initiative.
        </p>
      </div>
      
      {/* Quick Links - Moved to the top */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Add New Farmer', to: '/create-farmer-form', color: 'bg-green-50 text-green-700' },
            { name: 'New Data Entry', to: '/data-collection/new', color: 'bg-blue-50 text-blue-700' },
            { name: 'Schedule Training', to: '/training/schedule', color: 'bg-purple-50 text-purple-700' },
            { name: 'Market Connections', to: '/market', color: 'bg-orange-50 text-orange-700' },
          ].map((link, index) => (
            <a
              key={index}
              href={link.to}
              className={cn(
                "group rounded-lg px-6 py-5 font-medium",
                link.color,
                "hover:bg-opacity-75 transition-colors"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={cn("flex-shrink-0 rounded-md p-3", stat.color)}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm flex items-center">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 flex-shrink-0 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 flex-shrink-0 text-red-500" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    stat.trend === 'up' ? "text-green-600" : "text-red-600"
                  )}
                >
                  {stat.change}
                </span>
                <span className="ml-2 text-gray-500">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts and Recent Activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Charts */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {/* Farmer Registration Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Farmer Registrations</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Last 6 months</span>
                  <button className="ml-2 text-gray-400 hover:text-gray-500">
                    <BarChart3 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No chart data available</h3>
                  <p className="mt-1 text-sm text-gray-500">Charts will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Collection Progress */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Data Collection Progress</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Current month</span>
                  <button className="ml-2 text-gray-400 hover:text-gray-500">
                    <TrendingUp className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No chart data available</h3>
                  <p className="mt-1 text-sm text-gray-500">Charts will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity
        <div className="bg-white rounded-lg shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="flow-root mt-4">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={activity.avatar}
                          alt={activity.user}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium">{activity.subject}</span>
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="#"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all activity
              </a>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default Dashboard;