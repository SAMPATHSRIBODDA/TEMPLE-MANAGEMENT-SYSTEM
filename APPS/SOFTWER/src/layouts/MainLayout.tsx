import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  History, 
  LayoutDashboard, 
  LogOut, 
  Package, 
  Printer, 
  Settings, 
  Smartphone, 
  Ticket, 
  Users, 
  Utensils, 
  Wifi, 
  WifiOff, 
  Bell, 
  RefreshCw,
  Wallet,
  FileSpreadsheet,
  Banknote,
  Settings2,
  Database,
  Heart
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSyncStore } from '../store/syncStore';
import { useSettingsStore } from '../store/settingsStore';
import { usePermissionsStore } from '../store/permissionsStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import api from '../services/api';

export default function MainLayout() {
  const { user, shift, counterNumber, logout } = useAuthStore();
  const { queue } = useSyncStore();
  const { defaultPrinter } = useSettingsStore();
  const { hasPermission } = usePermissionsStore();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [templeData, setTempleData] = useState<any>(null);
  const [hasOpenShift, setHasOpenShift] = useState<boolean | null>(null);

  // Initialize Global Keyboard Shortcuts
  useKeyboardShortcuts();

  const [dynamicSections, setDynamicSections] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (user?.role === 'Counter') {
      try {
        const res = await api.get('/shifts/current');
        if (res.data.success && res.data.data.status === 'Open') {
          alert('You must submit your closing report before logging out.');
          navigate('/shift');
          return; // Block logout
        }
      } catch (err) {
        console.error('Failed to check shift status during logout:', err);
      }
    }
    logout();
  };

  useEffect(() => {
    const checkShift = async () => {
      if (user?.role === 'Counter') {
        try {
          const res = await api.get('/shifts/current');
          if (res.data.success && res.data.data?.status === 'Open') {
            setHasOpenShift(true);
          } else {
            setHasOpenShift(false);
            if (location.pathname !== '/shift') {
              navigate('/shift');
            }
          }
        } catch (err) {
          console.error('Failed to check shift:', err);
          setHasOpenShift(false);
          if (location.pathname !== '/shift') navigate('/shift');
        }
      } else {
        setHasOpenShift(true);
      }
    };
    checkShift();

    const handleShiftUpdate = () => checkShift();
    window.addEventListener('shiftUpdated', handleShiftUpdate);
    
    return () => {
      window.removeEventListener('shiftUpdated', handleShiftUpdate);
    };
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/temple/core-data')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTempleData(data.data);
        }
      })
      .catch(console.error);

    const fetchSections = () => {
      fetch('http://localhost:5000/api/v1/ticket-categories')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const sections = Array.from(new Set(data.data.map((t:any) => t.sectionName)));
            setDynamicSections(sections as string[]);
          }
        })
        .catch(console.error);
    };

    fetchSections();

    const handleFocus = () => fetchSections();
    window.addEventListener('focus', handleFocus);
      
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [location.pathname]);

  const counterNav = useMemo(() => {
    const baseNav = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, perm: 'Dashboard' }
    ];

    dynamicSections.forEach(section => {
      if (section === 'Entry Tickets') {
        baseNav.push({ name: 'Entry Tickets', path: '/entry', icon: Ticket, perm: 'Tickets' });
      } else if (section === 'Darshan') {
        baseNav.push({ name: 'Darshan', path: '/darshan', icon: Calendar, perm: 'Poojas' });
      } else if (section === 'Laddu Sales') {
        baseNav.push({ name: 'Laddu Sales', path: '/laddu', icon: Utensils, perm: 'Laddus' });
      } else {
        baseNav.push({ name: section, path: `/pos/${encodeURIComponent(section)}`, icon: Ticket, perm: 'Tickets' });
      }
    });

    baseNav.push({ name: 'Poojas', path: '/pooja', icon: Calendar, perm: 'Poojas' });
    baseNav.push({ name: 'Donations', path: '/donations', icon: Heart, perm: 'Donations' });
    baseNav.push({ name: 'Shift & Cash', path: '/shift', icon: Wallet, perm: 'Tickets' });
    baseNav.push({ name: 'QR Scanner', path: '/scanner', icon: Smartphone, perm: 'Tickets' });
    baseNav.push({ name: 'Online Bookings', path: '/online-bookings', icon: Wifi, perm: 'Tickets' });
    return baseNav;
  }, [dynamicSections]);

  const accountantNav = [
    { name: 'Financial Dashboard', path: '/dashboard', icon: LayoutDashboard, perm: 'Dashboard' },
    { name: 'Ledgers & Expenses', path: '/expenses', icon: Wallet, perm: 'Reports' },
    { name: 'Transactions', path: '/transactions', icon: History, perm: 'Reports' },
    { name: 'Reports', path: '/reports', icon: BarChart3, perm: 'Reports' },
    { name: 'Shift Audits', path: '/reports/closing', icon: FileSpreadsheet, perm: 'Reports' },
    { name: 'Inventory', path: '/inventory', icon: Package, perm: 'Inventory' },
    { name: 'Financial Settings', path: '/accountant-settings', icon: Banknote, perm: 'Settings' },
  ];

  const adminNav = [
    { name: 'Admin Console', path: '/dashboard', icon: LayoutDashboard, perm: 'Dashboard' },
    { name: 'Ledgers & Expenses', path: '/expenses', icon: Wallet, perm: 'Reports' },
    { name: 'Transactions', path: '/transactions', icon: History, perm: 'Reports' },
    { name: 'Reports', path: '/reports', icon: BarChart3, perm: 'Reports' },
    { name: 'Pricing & Tickets', path: '/pricing', icon: Ticket, perm: 'Settings' },
    { name: 'Master Data', path: '/masters', icon: Database, perm: 'Settings' },
    { name: 'Staff Management', path: '/staff', icon: Users, perm: 'Settings' },
    { name: 'Advanced Settings', path: '/admin-settings', icon: Settings2, perm: 'Settings' },
  ];

  const getNavItems = () => {
    switch(user?.role) {
      case 'Admin': return adminNav;
      case 'Accountant': return accountantNav;
      case 'Counter':
      default: return counterNav;
    }
  };

  const navItems = useMemo(() => {
    let aclRole = 'Counter Staff';
    if (user?.role === 'Admin') aclRole = 'Temple Admin';
    if (user?.role === 'Accountant') aclRole = 'Accountant';
    
    return getNavItems().filter(item => hasPermission(aclRole, item.perm));
  }, [user, hasPermission, counterNav]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm">
        <div className="h-20 flex flex-col items-center justify-center border-b border-gray-100 bg-orange-600 px-4 py-2">
          <div className="flex items-center space-x-3">
            {templeData?.profileImage ? (
              <img src={templeData.profileImage} alt="Temple" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-700 border-2 border-white flex items-center justify-center text-white font-bold shadow-sm">T</div>
            )}
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-white tracking-wide truncate max-w-[140px] leading-tight">
                {templeData?.name || 'TMS Counter'}
              </h1>
              <span className="text-[10px] text-orange-200 font-medium">Management Panel</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {hasOpenShift === false && user?.role === 'Counter' ? (
              <div className="px-4 py-3 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg">
                <Wallet className="inline-block mr-2 w-5 h-5" />
                Please start a shift
              </div>
            ) : (
              navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path) && item.path !== '/dashboard' || (item.path === '/dashboard' && location.pathname === '/dashboard');
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            End Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            {user?.role === 'Counter' && (
              <>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>{shift} Shift</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>{counterNumber}</span>
              </>
            )}
            {user?.role !== 'Counter' && (
              <span className="flex items-center font-bold text-orange-600 dark:text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                {user?.role} Mode
              </span>
            )}
          </div>

          <div className="flex items-center space-x-5">
            {/* Status Indicators */}
            <div className="flex space-x-4 border-r border-gray-200 pr-5">
              
              <Link to="/sync" className="flex items-center group relative cursor-pointer hover:bg-gray-50 p-1 rounded">
                <div className="relative">
                  <RefreshCw className={`h-5 w-5 ${queue.length > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                  {queue.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {queue.length}
                    </span>
                  )}
                </div>
                <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Sync Queue</span>
              </Link>

              <div className="flex items-center group relative cursor-help">
                <Printer className={`h-5 w-5 ${defaultPrinter ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {defaultPrinter ? `Printer: ${defaultPrinter}` : 'No Printer Configured'}
                </span>
              </div>
              <div className="flex items-center group relative cursor-help">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500 animate-pulse" />
                )}
                <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isOnline ? 'Online (Synced)' : 'Offline Mode'}
                </span>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Bell className="h-5 w-5" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-800 dark:text-gray-200">
                    Notifications
                  </div>
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center pl-2">
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 flex items-center justify-center font-bold text-sm shadow-inner">
                {user?.name.charAt(0)}
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Main Scrolling Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
