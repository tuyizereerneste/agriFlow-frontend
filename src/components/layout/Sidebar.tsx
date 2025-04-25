import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  HelpCircle, 
  Home, 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  Sprout, 
  Users, 
  BookOpen,
  Building,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, title, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
        isActive
          ? "bg-primary-50 text-primary-700"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <div className={cn(
        "mr-3 flex-shrink-0 h-5 w-5",
        isActive ? "text-primary-600" : "text-gray-500 group-hover:text-gray-600"
      )}>
        {icon}
      </div>
      {title}
    </Link>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Farmers', href: '/farmers', icon: <Users size={20} /> },
    { name: 'Voluteer Management', href: '/volunteer-management', icon: <FileText size={20} /> },
    { name: 'Analytics', href: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Project Management', href: '/projects', icon: <BookOpen size={20} /> },
    { name: 'Market Connections', href: '/market', icon: <ShoppingBag size={20} /> },
    { name: 'Partners', href: '/partners', icon: <Building size={20} /> },
    { name: 'Calendar', href: '/calendar', icon: <Calendar size={20} /> },
  ];
  
  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
    { name: 'Help', href: '/help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className={cn(
      "flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto",
      isOpen ? "block" : "hidden lg:block"
    )}>
      <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <Sprout className="h-5 w-5 text-primary-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">AgriFlow</span>
        </Link>
      </div>
      <div className="flex-grow flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              title={item.name}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>
        <div className="mt-5 px-2 space-y-1">
          {secondaryNavigation.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              title={item.name}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;