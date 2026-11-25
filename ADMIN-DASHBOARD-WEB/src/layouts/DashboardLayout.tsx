import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  Users, 
  FileText, 
  Bell, 
  LifeBuoy, 
  Settings,
  Search,
  Sun,
  ChevronDown,
  Smartphone,
  Paintbrush,
  HeartHandshake,
  Package,
  Briefcase
} from 'lucide-react';

const Sidebar = () => {
  const user = useAuthStore(state => state.user);
  
  const mainNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Temple Management', path: '/temples', icon: Building2 },
    { name: 'Devotees', path: '/devotees', icon: Users },
    { name: 'Donations', path: '/donations', icon: HeartHandshake },
    { name: 'Pujas', path: '/pujas', icon: FileText },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Staff', path: '/staff', icon: Briefcase },
    { name: 'App Management', path: '/apps', icon: Smartphone },
    { name: 'White Label', path: '/white-label', icon: Paintbrush },
    { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
    { name: 'Revenue', path: '/revenue', icon: TrendingUp },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  const bottomNav = [
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
    { name: 'Support', path: '/support', icon: LifeBuoy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group ${
          isActive 
            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
          )}
          <div className="flex items-center gap-3">
            <item.icon size={18} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
            <span>{item.name}</span>
          </div>
          {item.badge && (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <aside className="w-[260px] h-screen bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-r border-white/40 dark:border-gray-800/60 flex flex-col fixed left-0 top-0 z-20 transition-colors">
      <div className="h-[70px] flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-base tracking-tight">TempleOS</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-8 custom-scrollbar">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform</p>
          {mainNav.map(item => <NavItem key={item.name} item={item} />)}
        </div>
        
        <div className="space-y-1 mt-auto">
          {bottomNav.map(item => <NavItem key={item.name} item={item} />)}
        </div>
      </div>
    </aside>
  );
};

const Header = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  
  return (
  <header className="h-[70px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-white/40 dark:border-gray-800/60 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
    <div className="flex-1 flex items-center">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search temples, users, or transactions..." 
          className="w-full h-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/40 dark:border-gray-700/50 rounded-xl pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-500"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-xs text-gray-500 font-medium border border-gray-200/50 dark:border-gray-700/50 rounded px-1.5 py-0.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">⌘K</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button 
        onClick={() => document.documentElement.classList.toggle('dark')}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Sun size={18} />
      </button>
      <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 transition-colors relative cursor-pointer">
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
      </button>
      
      <div className="h-6 w-px bg-gray-200 mx-1"></div>
      
      <button onClick={logout} className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity cursor-pointer">
        <img 
          src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=5B4BDB&color=fff`} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-gray-100"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 leading-none">{user?.firstName} {user?.lastName}</p>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
    </div>
  </header>
  );
};

export const DashboardLayout = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/splash" replace />;
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 flex font-sans">
      <Sidebar />
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen relative animate-in fade-in duration-500">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
