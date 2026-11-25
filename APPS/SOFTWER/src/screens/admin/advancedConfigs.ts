import type { AdminModuleConfig } from '../../components/admin/AdminDataView';

export const auditLogsConfig: AdminModuleConfig = {
  id: 'audit-logs',
  title: 'Audit Logs',
  description: 'View chronological system changes and user actions.',
  canAdd: false,
  canEdit: false,
  canDelete: false,
  columns: [
    { key: 'timestamp', label: 'Date & Time' },
    { key: 'user', label: 'User' },
    { key: 'action', label: 'Action Taken' },
    { key: 'module', label: 'Module' },
    { key: 'ipAddress', label: 'IP Address' }
  ],
  mockData: Array.from({ length: 25 }, (_, i) => ({
    id: `AL-${i}`,
    timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
    user: i % 3 === 0 ? 'Admin (EMP001)' : 'Counter 2 (EMP003)',
    action: i % 2 === 0 ? 'Updated Settings' : 'Deleted Record',
    module: i % 4 === 0 ? 'Inventory' : 'Masters',
    ipAddress: `192.168.1.${10 + i}`
  }))
};

export const bannersConfig: AdminModuleConfig = {
  id: 'banners',
  title: 'Banner Management',
  description: 'Manage homepage and display banners.',
  columns: [
    { key: 'title', label: 'Banner Title' },
    { key: 'targetAudience', label: 'Target Audience' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  mockData: [
    { id: '1', title: 'Brahmotsavam Special', targetAudience: 'All Visitors', startDate: '2026-09-01', endDate: '2026-09-20', isActive: true },
    { id: '2', title: 'New VIP Darshan Timings', targetAudience: 'VIPs', startDate: '2026-06-01', endDate: '2026-12-31', isActive: true },
    { id: '3', title: 'COVID Guidelines', targetAudience: 'All', startDate: '2020-03-01', endDate: '2022-12-31', isActive: false },
  ]
};

export const announcementsConfig: AdminModuleConfig = {
  id: 'announcements',
  title: 'Announcements',
  description: 'Manage scrolling ticker text and push notifications.',
  columns: [
    { key: 'message', label: 'Message Content' },
    { key: 'priority', label: 'Priority' },
    { key: 'expiresOn', label: 'Expires On' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  mockData: [
    { id: '1', message: 'Darshan queue is moving slow. Expect 4 hour delay.', priority: 'High', expiresOn: '2026-06-26 23:59', isActive: true },
    { id: '2', title: 'Laddu counters will be closed from 2PM to 3PM.', priority: 'Medium', expiresOn: '2026-06-26 15:00', isActive: true },
  ]
};

export const subscriptionsConfig: AdminModuleConfig = {
  id: 'subscriptions',
  title: 'Monthly Subscriptions',
  description: 'Manage recurring donor plans (Nitya Annadanam, etc).',
  columns: [
    { key: 'subscriberName', label: 'Subscriber' },
    { key: 'plan', label: 'Plan' },
    { key: 'amount', label: 'Amount (₹)' },
    { key: 'status', label: 'Status' }
  ],
  mockData: [
    { id: 'SUB01', subscriberName: 'Rahul K', plan: 'Nitya Annadanam', amount: 5000, status: 'Active' },
    { id: 'SUB02', subscriberName: 'Anjali P', plan: 'Saswatha Pooja', amount: 10000, status: 'Active' },
    { id: 'SUB03', subscriberName: 'Kiran M', plan: 'Goshala Donation', amount: 2000, status: 'Failed' },
  ]
};
