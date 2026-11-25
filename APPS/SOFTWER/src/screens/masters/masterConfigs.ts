import type { MasterConfig } from '../../components/masters/MasterDataGrid';

export const templeInfoConfig: MasterConfig = {
  id: 'temple-info',
  title: 'Temple Information',
  description: 'Manage core details about the temple.',
  fields: [
    { key: 'name', label: 'Temple Name', type: 'text', required: true },
    { key: 'address', label: 'Address', type: 'text', required: true },
    { key: 'phone', label: 'Contact Phone', type: 'text' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', name: 'Sri Venkateswara Swamy Temple', address: 'Tirumala, Andhra Pradesh', phone: '0877-2277777', isActive: true }
  ]
};

export const templeTimingsConfig: MasterConfig = {
  id: 'temple-timings',
  title: 'Temple Timings',
  description: 'Manage opening, closing, and break timings.',
  fields: [
    { key: 'day', label: 'Day of Week', type: 'select', options: ['Everyday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
    { key: 'openTime', label: 'Opening Time', type: 'time', required: true },
    { key: 'closeTime', label: 'Closing Time', type: 'time', required: true },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', day: 'Everyday', openTime: '06:00', closeTime: '21:00', isActive: true }
  ]
};

export const festivalCalendarConfig: MasterConfig = {
  id: 'festival-calendar',
  title: 'Festival Calendar',
  description: 'Manage upcoming festivals and special events.',
  fields: [
    { key: 'name', label: 'Festival Name', type: 'text', required: true },
    { key: 'date', label: 'Date', type: 'text', required: true },
    { key: 'expectedCrowd', label: 'Expected Crowd', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', name: 'Brahmotsavam', date: '2026-09-15', expectedCrowd: 500000, isActive: true },
    { id: '2', name: 'Vaikuntha Ekadashi', date: '2026-12-28', expectedCrowd: 300000, isActive: true }
  ]
};

export const darshanTypesConfig: MasterConfig = {
  id: 'darshan-types',
  title: 'Darshan Types',
  description: 'Configure different Darshan queues and pricing.',
  fields: [
    { key: 'name', label: 'Darshan Name', type: 'text', required: true },
    { key: 'price', label: 'Ticket Price (₹)', type: 'number', required: true },
    { key: 'quota', label: 'Daily Quota', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', name: 'Free Darshan (Sarva)', price: 0, quota: 40000, isActive: true },
    { id: '2', name: 'Special Entry Darshan', price: 300, quota: 25000, isActive: true },
    { id: '3', name: 'VIP Break Darshan', price: 500, quota: 5000, isActive: true }
  ]
};

export const entryTicketTypesConfig: MasterConfig = {
  id: 'entry-ticket-types',
  title: 'Entry Ticket Types',
  description: 'Configure basic entry tickets like vehicles or standard admission.',
  fields: [
    { key: 'name', label: 'Ticket Name', type: 'text', required: true },
    { key: 'price', label: 'Price (₹)', type: 'number', required: true },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', name: 'Two-Wheeler Toll', price: 15, isActive: true },
    { id: '2', name: 'Four-Wheeler Toll', price: 50, isActive: true }
  ]
};

export const ladduTypesConfig: MasterConfig = {
  id: 'laddu-types',
  title: 'Laddu Types',
  description: 'Manage prasadam laddu sizes and pricing.',
  fields: [
    { key: 'name', label: 'Laddu Type', type: 'text', required: true },
    { key: 'price', label: 'Price (₹)', type: 'number', required: true },
    { key: 'weight', label: 'Weight (grams)', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', name: 'Small Laddu (Srivari)', price: 50, weight: 175, isActive: true },
    { id: '2', name: 'Big Laddu (Kalyanam)', price: 200, weight: 700, isActive: true }
  ]
};

export const poojaCategoriesConfig: MasterConfig = {
  id: 'pooja-categories',
  title: 'Pooja Categories',
  description: 'Setup different poojas offered by the temple.',
  fields: [
    { key: 'name', label: 'Pooja Name', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'text', required: false },
    { key: 'category', label: 'Category', type: 'select', options: ['Daily', 'Weekly', 'Festival', 'Personal'], required: true },
    { key: 'price', label: 'Price (₹)', type: 'number', required: true },
    { key: 'isMonthly', label: 'Is Monthly Subscription?', type: 'select', options: ['true', 'false'], required: false },
    { key: 'durationDays', label: 'Validity Duration (Days)', type: 'number', required: false },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true }
  ],
  initialData: [
    { id: '1', name: 'Archana', price: 100, duration: 15, isActive: true },
    { id: '2', name: 'Abhishekam', price: 500, duration: 45, isActive: true }
  ]
};

export const monthlyPoojaPlansConfig: MasterConfig = {
  id: 'monthly-pooja-plans',
  title: 'Monthly Pooja Plans',
  description: 'Manage subscription plans for recurring poojas (Saswatha Pooja).',
  fields: [
    { key: 'planName', label: 'Plan Name', type: 'text', required: true },
    { key: 'frequency', label: 'Frequency', type: 'select', options: ['Monthly', 'Yearly', 'Lifetime'], required: true },
    { key: 'price', label: 'Price (₹)', type: 'number', required: true },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', planName: 'Saswatha Nitya Annadanam', frequency: 'Lifetime', price: 100000, isActive: true }
  ]
};

export const donationCategoriesConfig: MasterConfig = {
  id: 'donation-categories',
  title: 'Donation Categories',
  description: 'Setup Hundi or specific trust donation schemes.',
  fields: [
    { key: 'schemeName', label: 'Scheme Name', type: 'text', required: true },
    { key: 'minAmount', label: 'Min Amount (₹)', type: 'number' },
    { key: 'taxExempt', label: '80G Tax Exempt', type: 'boolean' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', schemeName: 'Annadanam Trust', minAmount: 100, taxExempt: true, isActive: true },
    { id: '2', schemeName: 'Goshala Trust', minAmount: 100, taxExempt: true, isActive: true }
  ]
};

export const receiptSettingsConfig: MasterConfig = {
  id: 'receipt-settings',
  title: 'Receipt Settings',
  description: 'Configure receipt headers, footers, and templates.',
  fields: [
    { key: 'receiptType', label: 'Receipt Type', type: 'select', options: ['Entry', 'Darshan', 'Laddu', 'Donation'], required: true },
    { key: 'headerText', label: 'Header Text', type: 'text' },
    { key: 'footerText', label: 'Footer Text', type: 'text' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', receiptType: 'Darshan', headerText: 'Sri Venkateswara Swamy Temple', footerText: 'Om Namo Venkatesaya', isActive: true }
  ]
};

export const printerSettingsConfig: MasterConfig = {
  id: 'printer-settings',
  title: 'Printer Settings',
  description: 'Manage registered thermal printers and their IP addresses.',
  fields: [
    { key: 'counterId', label: 'Counter ID', type: 'text', required: true },
    { key: 'printerName', label: 'Printer Name/IP', type: 'text', required: true },
    { key: 'paperSize', label: 'Paper Size', type: 'select', options: ['58mm', '80mm'], required: true },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', counterId: 'Counter 1', printerName: '192.168.1.100', paperSize: '80mm', isActive: true }
  ]
};

export const qrSettingsConfig: MasterConfig = {
  id: 'qr-settings',
  title: 'QR Settings',
  description: 'Configure QR code generation parameters and validity.',
  fields: [
    { key: 'ticketType', label: 'Ticket Type', type: 'select', options: ['Darshan', 'Laddu'], required: true },
    { key: 'validityHours', label: 'Validity (Hours)', type: 'number', required: true },
    { key: 'encryptionMode', label: 'Encryption Mode', type: 'select', options: ['None', 'AES-256'] },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', ticketType: 'Darshan', validityHours: 24, encryptionMode: 'AES-256', isActive: true }
  ]
};

export const paymentSettingsConfig: MasterConfig = {
  id: 'payment-settings',
  title: 'Payment Settings',
  description: 'Manage payment gateways and accepted modes.',
  fields: [
    { key: 'mode', label: 'Payment Mode', type: 'text', required: true },
    { key: 'gateway', label: 'Gateway Provider', type: 'text' },
    { key: 'commission', label: 'Commission (%)', type: 'number' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ],
  initialData: [
    { id: '1', mode: 'Cash', gateway: 'N/A', commission: 0, isActive: true },
    { id: '2', mode: 'UPI', gateway: 'PhonePe', commission: 0, isActive: true },
    { id: '3', mode: 'Card', gateway: 'Razorpay', commission: 1.5, isActive: true }
  ]
};
