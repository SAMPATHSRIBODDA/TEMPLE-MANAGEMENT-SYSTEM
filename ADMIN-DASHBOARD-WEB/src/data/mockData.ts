export const dashboardStats = {
  totalTemples: 1245,
  activeTemples: 1102,
  inactiveTemples: 143,
  totalRevenue: 28540000,
  monthlyRevenue: 2450000,
  activeSubscriptions: 845,
  expiredSubscriptions: 52,
  totalMobileAppUsers: 142000,
  totalTicketSales: 450200,
  totalDonations: 1850000,
  pendingPayments: 24
};

export const subscriptionData = [
  { name: 'Active', value: 845, fill: '#10B981' },
  { name: 'Expired', value: 52, fill: '#EF4444' },
  { name: 'Trial', value: 124, fill: '#F59E0B' }
];

export const systemHealth = [
  { name: 'API Server', status: 'Operational', uptime: '99.99%', latency: '42ms' },
  { name: 'Database', status: 'Operational', uptime: '99.99%', latency: '12ms' },
  { name: 'Payment Gateway', status: 'Degraded', uptime: '98.50%', latency: '450ms' },
  { name: 'Storage', status: 'Operational', uptime: '100%', latency: '18ms' }
];

export const systemNotifications = [
  { id: 1, title: 'Server Load Alert', time: '10 mins ago', type: 'warning' },
  { id: 2, title: 'New Temple Registered', time: '1 hour ago', type: 'success' },
  { id: 3, title: 'Payment Gateway Timeout', time: '2 hours ago', type: 'danger' },
  { id: 4, title: 'Daily Backup Completed', time: '5 hours ago', type: 'info' }
];

export const revenueData = [
  { name: 'Jan', amount: 140000 },
  { name: 'Feb', amount: 160000 },
  { name: 'Mar', amount: 150000 },
  { name: 'Apr', amount: 180000 },
  { name: 'May', amount: 210000 },
  { name: 'Jun', amount: 240000 },
  { name: 'Jul', amount: 280000 },
];

export const templeGrowthData = [
  { name: 'Jan', amount: 100 },
  { name: 'Feb', amount: 150 },
  { name: 'Mar', amount: 250 },
  { name: 'Apr', amount: 400 },
  { name: 'May', amount: 750 },
  { name: 'Jun', amount: 1000 },
  { name: 'Jul', amount: 1245 },
];

export const recentActivities = [
  { id: '1', temple: 'Sri Venkateswara Swamy', type: 'Subscription', amount: 50000, date: '2026-06-30', status: 'Completed', user: 'Ramesh K.' },
  { id: '2', temple: 'Meenakshi Amman', type: 'Payout', amount: 120000, date: '2026-06-29', status: 'Pending', user: 'System' },
  { id: '3', temple: 'Kashi Vishwanath', type: 'Subscription', amount: 75000, date: '2026-06-28', status: 'Completed', user: 'Amit S.' },
  { id: '4', temple: 'Somnath Temple', type: 'Refund', amount: 10000, date: '2026-06-28', status: 'Failed', user: 'Priya D.' },
  { id: '5', temple: 'Jagannath Temple', type: 'Subscription', amount: 50000, date: '2026-06-27', status: 'Completed', user: 'Das M.' }
];

export const loginHistory = [
  { id: '1', ip: '192.168.1.1', location: 'Hyderabad, India', device: 'MacBook Pro', browser: 'Chrome', time: '2026-06-30T10:00:00Z', status: 'Success' },
  { id: '2', ip: '192.168.1.2', location: 'Hyderabad, India', device: 'iPhone 13', browser: 'Safari', time: '2026-06-29T14:30:00Z', status: 'Success' },
  { id: '3', ip: '103.45.2.1', location: 'Unknown', device: 'Windows PC', browser: 'Firefox', time: '2026-06-28T02:15:00Z', status: 'Failed' }
];

export const activeDevices = [
  { id: '1', name: 'MacBook Pro 14"', os: 'macOS', browser: 'Chrome', location: 'Hyderabad, India', lastActive: 'Current Session', isCurrent: true },
  { id: '2', name: 'iPhone 13 Pro', os: 'iOS', browser: 'Safari', location: 'Hyderabad, India', lastActive: '2 hours ago', isCurrent: false }
];

export const securityLogs = [
  { id: '1', action: 'Login Success', details: 'Successful login from trusted IP', time: '2026-06-30T10:00:00Z' },
  { id: '2', action: 'Password Changed', details: 'Password was updated successfully', time: '2026-06-15T09:00:00Z' },
  { id: '3', action: 'Failed Login', details: 'Invalid credentials from 103.45.2.1', time: '2026-06-28T02:15:00Z' }
];

export const templesList = [
  {
    id: '1',
    name: 'Sri Venkateswara Swamy Temple',
    address: 'Tirumala, Tirupati, Andhra Pradesh 517504',
    contact: '+91 877 223 3333',
    admin: { name: 'A. Rao', email: 'admin@tirumala.org', phone: '+91 9988776655' },
    plan: 'Enterprise',
    domain: 'tirumala.org',
    appStatus: 'Live',
    softwareStatus: 'Active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Meenakshi Amman Temple',
    address: 'Madurai Main, Madurai, Tamil Nadu 625001',
    contact: '+91 452 234 4360',
    admin: { name: 'S. Iyer', email: 'admin@meenakshi.org', phone: '+91 9988774433' },
    plan: 'Premium',
    domain: 'meenakshitemple.org',
    appStatus: 'In Review',
    softwareStatus: 'Active',
    createdAt: '2024-03-22T14:30:00Z'
  },
  {
    id: '3',
    name: 'Kashi Vishwanath Temple',
    address: 'Lahori Tola, Varanasi, Uttar Pradesh 221001',
    contact: '+91 542 239 2629',
    admin: { name: 'V. Sharma', email: 'admin@kashivishwanath.in', phone: '+91 9911223344' },
    plan: 'Enterprise',
    domain: 'kashivishwanath.in',
    appStatus: 'Live',
    softwareStatus: 'Active',
    createdAt: '2023-11-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Somnath Temple',
    address: 'Prabhas Patan, Gujarat 362268',
    contact: '+91 2876 231 200',
    admin: { name: 'M. Patel', email: 'admin@somnath.org', phone: '+91 9988772211' },
    plan: 'Basic',
    domain: 'somnath.org',
    appStatus: 'Not Started',
    softwareStatus: 'Suspended',
    createdAt: '2025-05-05T11:45:00Z'
  },
  {
    id: '5',
    name: 'Jagannath Temple',
    address: 'Puri, Odisha 752001',
    contact: '+91 6752 222 002',
    admin: { name: 'D. Das', email: 'admin@jagannath.org', phone: '+91 9988665544' },
    plan: 'Premium',
    domain: 'jagannathpuri.in',
    appStatus: 'Live',
    softwareStatus: 'Active',
    createdAt: '2024-08-18T16:20:00Z'
  }
];

export const subscriptionPlans = [
  {
    id: 'plan_1',
    name: 'Starter',
    description: 'Perfect for small temples just getting started.',
    monthlyPrice: 2999,
    annualPrice: 29990,
    trialDays: 14,
    maxLicenses: 1,
    features: [
      'Basic Temple Profile',
      'Donation Management',
      'Up to 500 Devotees',
      'Email Support'
    ]
  },
  {
    id: 'plan_2',
    name: 'Standard',
    description: 'Advanced features for growing temples.',
    monthlyPrice: 5999,
    annualPrice: 59990,
    trialDays: 14,
    maxLicenses: 3,
    features: [
      'Everything in Starter',
      'Ticketing System',
      'Up to 5,000 Devotees',
      'Priority Email Support',
      'Custom Domain'
    ]
  },
  {
    id: 'plan_3',
    name: 'Premium',
    description: 'Comprehensive suite for large temples.',
    monthlyPrice: 12999,
    annualPrice: 129990,
    trialDays: 30,
    maxLicenses: 10,
    features: [
      'Everything in Standard',
      'Mobile App (Android)',
      'Unlimited Devotees',
      '24/7 Phone Support',
      'Inventory Management'
    ]
  },
  {
    id: 'plan_4',
    name: 'Enterprise',
    description: 'Custom solutions for mega temple complexes.',
    monthlyPrice: 24999,
    annualPrice: 249990,
    trialDays: 30,
    maxLicenses: 50,
    features: [
      'Everything in Premium',
      'Mobile App (iOS & Android)',
      'Dedicated Account Manager',
      'Custom API Access',
      'On-premise Deployment Option'
    ]
  }
];

export const activeSubscriptions = [
  {
    id: 'sub_1',
    templeId: '1',
    templeName: 'Sri Venkateswara Swamy Temple',
    planId: 'plan_4',
    planName: 'Enterprise',
    status: 'Active',
    billingCycle: 'Annual',
    startDate: '2025-01-15T00:00:00Z',
    expiryDate: '2026-01-15T00:00:00Z',
    remainingDays: 199,
    paymentStatus: 'Paid',
    amount: 249990
  },
  {
    id: 'sub_2',
    templeId: '2',
    templeName: 'Meenakshi Amman Temple',
    planId: 'plan_3',
    planName: 'Premium',
    status: 'Active',
    billingCycle: 'Monthly',
    startDate: '2026-06-01T00:00:00Z',
    expiryDate: '2026-07-01T00:00:00Z',
    remainingDays: 1,
    paymentStatus: 'Pending',
    amount: 12999
  },
  {
    id: 'sub_3',
    templeId: '4',
    templeName: 'Somnath Temple',
    planId: 'plan_1',
    planName: 'Starter',
    status: 'Suspended',
    billingCycle: 'Monthly',
    startDate: '2026-04-05T00:00:00Z',
    expiryDate: '2026-05-05T00:00:00Z',
    remainingDays: 0,
    paymentStatus: 'Overdue',
    amount: 2999
  },
  {
    id: 'sub_4',
    templeId: '5',
    templeName: 'Jagannath Temple',
    planId: 'plan_3',
    planName: 'Premium',
    status: 'Trial',
    billingCycle: 'Annual',
    startDate: '2026-06-25T00:00:00Z',
    expiryDate: '2026-07-09T00:00:00Z',
    remainingDays: 9,
    paymentStatus: 'N/A',
    amount: 0
  }
];

export const revenueChartData = [
  { month: 'Jan', subscriptions: 400000, setup: 120000, commissions: 50000, refunds: 10000 },
  { month: 'Feb', subscriptions: 420000, setup: 90000, commissions: 55000, refunds: 5000 },
  { month: 'Mar', subscriptions: 450000, setup: 150000, commissions: 60000, refunds: 15000 },
  { month: 'Apr', subscriptions: 480000, setup: 100000, commissions: 75000, refunds: 8000 },
  { month: 'May', subscriptions: 520000, setup: 180000, commissions: 90000, refunds: 12000 },
  { month: 'Jun', subscriptions: 550000, setup: 140000, commissions: 110000, refunds: 5000 },
];

export const revenueByPlan = [
  { name: 'Enterprise', value: 45 },
  { name: 'Premium', value: 30 },
  { name: 'Standard', value: 15 },
  { name: 'Starter', value: 10 },
];

export const revenueByTemple = [
  { id: '1', name: 'Sri Venkateswara Swamy', revenue: 1250000, trend: '+12%' },
  { id: '2', name: 'Meenakshi Amman', revenue: 850000, trend: '+8%' },
  { id: '3', name: 'Kashi Vishwanath', revenue: 620000, trend: '-2%' },
  { id: '4', name: 'Somnath Temple', revenue: 450000, trend: '+15%' },
  { id: '5', name: 'Jagannath Temple', revenue: 380000, trend: '+5%' },
];

export const transactionsList = [
  { id: 'TRX-9901', templeName: 'Sri Venkateswara Swamy', type: 'Subscription Renewal', amount: 249990, date: '2026-06-30', status: 'Completed' },
  { id: 'TRX-9902', templeName: 'Meenakshi Amman', type: 'Donation Commission', amount: 12500, date: '2026-06-29', status: 'Completed' },
  { id: 'TRX-9903', templeName: 'Kashi Vishwanath', type: 'Setup Charge', amount: 50000, date: '2026-06-29', status: 'Pending' },
  { id: 'TRX-9904', templeName: 'Somnath Temple', type: 'Refund', amount: -2999, date: '2026-06-28', status: 'Completed' },
  { id: 'TRX-9905', templeName: 'Jagannath Temple', type: 'Subscription Upgrade', amount: 12999, date: '2026-06-27', status: 'Pending' },
];

export const appConfigurations = [
  {
    templeId: '1',
    templeName: 'Sri Venkateswara Swamy Temple',
    coreAccess: { mobileApp: true, desktopSoftware: true },
    modules: { darshan: true, laddu: true, pooja: true, donation: true, inventory: true },
    versioning: {
      currentVersion: 'v2.4.1',
      availableUpdate: 'v2.5.0',
      lastUpdated: '2026-06-15T10:00:00Z',
      history: [
        { version: 'v2.4.1', date: '2026-06-15T10:00:00Z', type: 'Security Patch' },
        { version: 'v2.4.0', date: '2026-05-01T10:00:00Z', type: 'Major Release' },
      ]
    }
  },
  {
    templeId: '2',
    templeName: 'Meenakshi Amman Temple',
    coreAccess: { mobileApp: false, desktopSoftware: true },
    modules: { darshan: true, laddu: false, pooja: true, donation: true, inventory: false },
    versioning: {
      currentVersion: 'v2.5.0',
      availableUpdate: null,
      lastUpdated: '2026-06-28T14:30:00Z',
      history: [
        { version: 'v2.5.0', date: '2026-06-28T14:30:00Z', type: 'Major Release' },
        { version: 'v2.4.1', date: '2026-05-10T10:00:00Z', type: 'Security Patch' },
      ]
    }
  },
  {
    templeId: '3',
    templeName: 'Kashi Vishwanath Temple',
    coreAccess: { mobileApp: true, desktopSoftware: true },
    modules: { darshan: true, laddu: false, pooja: true, donation: true, inventory: true },
    versioning: {
      currentVersion: 'v2.3.9',
      availableUpdate: 'v2.5.0',
      lastUpdated: '2026-01-15T10:00:00Z',
      history: [
        { version: 'v2.3.9', date: '2026-01-15T10:00:00Z', type: 'Bug Fixes' },
      ]
    }
  },
  {
    templeId: '4',
    templeName: 'Somnath Temple',
    coreAccess: { mobileApp: false, desktopSoftware: false },
    modules: { darshan: false, laddu: false, pooja: false, donation: true, inventory: false },
    versioning: {
      currentVersion: 'v2.4.1',
      availableUpdate: 'v2.5.0',
      lastUpdated: '2026-05-20T10:00:00Z',
      history: [
        { version: 'v2.4.1', date: '2026-05-20T10:00:00Z', type: 'Security Patch' },
      ]
    }
  },
  {
    templeId: '5',
    templeName: 'Jagannath Temple',
    coreAccess: { mobileApp: true, desktopSoftware: true },
    modules: { darshan: true, laddu: true, pooja: true, donation: true, inventory: false },
    versioning: {
      currentVersion: 'v2.5.0',
      availableUpdate: null,
      lastUpdated: '2026-06-29T09:00:00Z',
      history: [
        { version: 'v2.5.0', date: '2026-06-29T09:00:00Z', type: 'Major Release' },
      ]
    }
  }
];

export const brandingConfigurations = [
  {
    templeId: '1',
    templeName: 'Sri Venkateswara Swamy Temple',
    appName: 'Tirumala Darshan',
    primaryColor: '#F59E0B',
    secondaryColor: '#B45309',
    hasLogo: true,
    hasSplash: true,
    hasCustomIcons: true,
    notificationSms: 'Om Namo Venkatesaya! Your booking {booking_id} is confirmed.',
    notificationEmail: 'Welcome to Tirumala...'
  },
  {
    templeId: '2',
    templeName: 'Meenakshi Amman Temple',
    appName: 'Madurai Meenakshi',
    primaryColor: '#10B981',
    secondaryColor: '#047857',
    hasLogo: true,
    hasSplash: false,
    hasCustomIcons: false,
    notificationSms: 'Your visit to Meenakshi Amman temple is scheduled.',
    notificationEmail: 'Welcome...'
  },
  {
    templeId: '3',
    templeName: 'Kashi Vishwanath Temple',
    appName: 'Kashi Yatra',
    primaryColor: '#EF4444',
    secondaryColor: '#B91C1C',
    hasLogo: true,
    hasSplash: true,
    hasCustomIcons: true,
    notificationSms: 'Har Har Mahadev. Booking confirmed.',
    notificationEmail: 'Welcome...'
  }
];

export const healthMetrics = {
  activeUsers: 14205,
  onlineTemples: 342,
  apiUptime: 99.99,
  softwareUptime: 99.95,
  appUptime: 99.98,
  activeTraffic: [
    { time: '10:00', users: 12000 },
    { time: '10:15', users: 13500 },
    { time: '10:30', users: 14200 },
    { time: '10:45', users: 13800 },
    { time: '11:00', users: 14205 },
  ]
};

export const systemLogs = [
  { id: 'ERR-001', timestamp: '2026-07-01T10:05:22Z', level: 'ERROR', source: 'Payment Gateway', message: 'Connection timeout while processing refund for TRX-9904' },
  { id: 'WRN-002', timestamp: '2026-07-01T09:45:10Z', level: 'WARN', source: 'Auth Service', message: 'High volume of failed login attempts from IP 192.168.1.45' },
  { id: 'INF-003', timestamp: '2026-07-01T09:30:00Z', level: 'INFO', source: 'Sync Engine', message: 'Successfully synced 1,450 records for Sri Venkateswara Swamy Temple' },
  { id: 'ERR-004', timestamp: '2026-07-01T08:15:44Z', level: 'ERROR', source: 'Database', message: 'Deadlock detected in transaction #450912' },
];

export const securityEvents = [
  { id: 'SEC-001', timestamp: '2026-07-01T10:10:00Z', user: 'admin@tirumala.org', action: 'Login Success', device: 'MacBook Pro - Chrome', ip: '117.200.45.12' },
  { id: 'SEC-002', timestamp: '2026-07-01T09:55:12Z', user: 'superadmin@templeos.com', action: 'Subscription Modified', target: 'Jagannath Temple', device: 'Windows PC - Edge', ip: '14.139.220.11' },
  { id: 'SEC-003', timestamp: '2026-07-01T09:44:05Z', user: 'unknown', action: 'Login Failed', device: 'Unknown Device', ip: '192.168.1.45' },
];

export const systemBackups = [
  { id: 'BAK-001', date: '2026-07-01T02:00:00Z', size: '14.2 GB', type: 'Automated Daily', status: 'Completed' },
  { id: 'BAK-002', date: '2026-06-30T02:00:00Z', size: '14.1 GB', type: 'Automated Daily', status: 'Completed' },
  { id: 'BAK-003', date: '2026-06-25T15:30:00Z', size: '13.8 GB', type: 'Manual Trigger', status: 'Completed' },
];

export const activeCoupons = [
  { code: 'SUMMER2026', discount: '15%', type: 'Percentage', validUntil: '2026-08-31', usageLimit: 100, used: 45, status: 'Active' },
  { code: 'SETUPFREE', discount: '₹50,000', type: 'Fixed Amount', validUntil: '2026-12-31', usageLimit: 50, used: 50, status: 'Depleted' },
  { code: 'FESTIVAL50', discount: '50%', type: 'Percentage', validUntil: '2026-10-15', usageLimit: 200, used: 120, status: 'Active' },
];

export const systemRoles = [
  { id: 'R1', name: 'Super Admin', users: 2, permissions: ['All Access'] },
  { id: 'R2', name: 'Support Lead', users: 5, permissions: ['View Temples', 'Manage Tickets', 'View Logs'] },
  { id: 'R3', name: 'Finance Admin', users: 3, permissions: ['View Revenue', 'Manage Subscriptions', 'Process Refunds'] },
];
