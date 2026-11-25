import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock adapter for offline demo mode
let mockShiftStatus = 'Closed';

api.interceptors.request.use((config) => {
  // Bypass mock adapter for online bookings to hit the real backend
  if (config.url?.includes('/online-bookings')) {
    return config;
  }

  // We can attach a custom adapter to return mock data based on URL
  config.adapter = async function (config) {
    const url = config.url || '';
    const method = config.method?.toLowerCase();
    
    let responseData: any = { success: true, message: 'Mock response' };

    if (url.includes('/accounting/summary')) {
      responseData = {
        success: true,
        data: {
          totalIncome: 1250000,
          totalExpense: 235000,
          netBalance: 1015000
        }
      };
    } else if (url.includes('/accounting/ledger')) {
      const typeParam = config?.params?.type || 'ALL';
      const searchParam = config?.params?.search?.toLowerCase() || '';
      
      let mockLedgerData = [
        { _id: '1', date: new Date().toISOString(), type: 'INCOME', category: 'Donations (Manual)', description: 'Cash donation', partyName: 'Anonymous', amount: 5000 },
        { _id: '2', date: new Date().toISOString(), type: 'EXPENSE', category: 'Electricity/Utilities', description: 'June Power Bill', partyName: 'State Board', amount: 12000, fundedBy: 'Ticket Collection' },
        { _id: '3', date: new Date().toISOString(), type: 'INCOME', category: 'Hall Rental', description: 'Marriage Booking', partyName: 'Sharma Family', amount: 25000 },
        { _id: '4', date: new Date().toISOString(), type: 'EXPENSE', category: 'Flower/Decorations', description: 'Weekly decor', partyName: 'Raju Florists', amount: 4500, fundedBy: 'Donations (Manual)' },
      ];

      if (typeParam !== 'ALL') {
        mockLedgerData = mockLedgerData.filter(item => item.type === typeParam);
      }
      
      if (searchParam) {
        mockLedgerData = mockLedgerData.filter(item => 
          (item.description && item.description.toLowerCase().includes(searchParam)) ||
          (item.category && item.category.toLowerCase().includes(searchParam)) ||
          (item.partyName && item.partyName.toLowerCase().includes(searchParam))
        );
      }

      responseData = {
        success: true,
        data: mockLedgerData,
        total: mockLedgerData.length
      };
    } else if (url.includes('/transactions/app-transactions')) {
      const section = config?.params?.section || 'All';
      
      let mockAppTxns = [
        { _id: 'a1', transactionId: 'pay_MOCK01', date: new Date().toISOString(), user: 'Ravi Kumar (9876543210)', amount: 501, method: 'UPI', status: 'captured', module: 'Poojas' },
        { _id: 'a2', transactionId: 'pay_MOCK02', date: new Date().toISOString(), user: 'Sita Devi (9123456789)', amount: 1500, method: 'Card', status: 'captured', module: 'Donations' },
        { _id: 'a3', transactionId: 'pay_MOCK03', date: new Date().toISOString(), user: 'Arjun Das (9123456789)', amount: 300, method: 'UPI', status: 'captured', module: 'VIP Darshan' },
      ];

      if (section !== 'All') {
        mockAppTxns = mockAppTxns.filter(t => t.module === section);
      }

      const upiTotal = mockAppTxns.filter(t => t.method === 'UPI').reduce((sum, t) => sum + t.amount, 0);
      const cardTotal = mockAppTxns.filter(t => t.method === 'Card').reduce((sum, t) => sum + t.amount, 0);

      responseData = {
        success: true,
        data: mockAppTxns,
        total: mockAppTxns.length,
        sectionTotals: { upi: upiTotal, card: cardTotal, total: upiTotal + cardTotal },
        page: 1,
        limit: 20
      };
    } else if (url.includes('/transactions') && method !== 'post') {
      const type = config?.params?.method || 'All';
      const section = config?.params?.section || 'All';
      const counterId = config?.params?.counterId || 'All';
      
      let mockData = [
        { _id: '1', receiptNumber: 'RCP-MOCK-001', createdAt: new Date().toISOString(), totalAmount: 120, paymentMethod: 'Card', status: 'valid', items: [{ itemType: 'Pooja', categoryName: 'Poojas', quantity: 1 }], issuedBy: { _id: 'u1', firstName: 'Counter', lastName: '1' } },
        { _id: '2', receiptNumber: 'RCP-MOCK-002', createdAt: new Date().toISOString(), totalAmount: 45, paymentMethod: 'Cash', status: 'valid', items: [{ itemType: 'LadduOrder', categoryName: 'Laddu Sales', quantity: 3 }], issuedBy: { _id: 'u2', firstName: 'Counter', lastName: '2' } },
        { _id: '3', receiptNumber: 'RCP-MOCK-003', createdAt: new Date().toISOString(), totalAmount: 200, paymentMethod: 'Card', status: 'valid', items: [{ itemType: 'Donation', categoryName: 'Donations', quantity: 1 }], issuedBy: { _id: 'u1', firstName: 'Counter', lastName: '1' } },
        { _id: '4', receiptNumber: 'RCP-MOCK-004', createdAt: new Date().toISOString(), totalAmount: 300, paymentMethod: 'UPI', status: 'valid', items: [{ itemType: 'Ticket', categoryName: 'VIP Darshan', description: 'VIP Darshan', quantity: 2 }], issuedBy: { _id: 'u2', firstName: 'Counter', lastName: '2' } }
      ];

      if (type !== 'All') {
        mockData = mockData.filter(d => d.paymentMethod === type);
      }
      if (section !== 'All') {
        mockData = mockData.filter(d => d.items.some(i => i.categoryName === section || i.itemType === section));
      }
      if (counterId && counterId !== 'All') {
        mockData = mockData.filter(d => d.issuedBy._id === counterId);
      }

      const cashTotal = mockData.filter(d => d.paymentMethod === 'Cash').reduce((sum, d) => sum + d.totalAmount, 0);
      const onlineTotal = mockData.filter(d => d.paymentMethod !== 'Cash').reduce((sum, d) => sum + d.totalAmount, 0);

      responseData = {
        success: true,
        data: mockData,
        total: mockData.length,
        sectionTotals: { cash: cashTotal, online: onlineTotal, total: cashTotal + onlineTotal },
        page: 1,
        limit: 20
      };
    } else if (url.includes('/staff')) {
      responseData = {
        success: true,
        data: [
          { _id: 'u1', firstName: 'Counter', lastName: '1', role: { name: 'Counter Staff' } },
          { _id: 'u2', firstName: 'Counter', lastName: '2', role: { name: 'Counter Staff' } }
        ]
      };
    } else if (url.includes('/accounting/income') || url.includes('/accounting/expense')) {
      responseData = { success: true };
    } else if (url.includes('/dashboard/stats')) {
      responseData = {
        success: true,
        data: {
          totalTransactions: 1542,
          totalVolume: 45230,
          pendingAmount: 1200,
          activeUsers: 5,
          recentActivity: [
            { id: 1, type: 'Sale', amount: 50, date: new Date().toISOString(), status: 'completed' },
            { id: 2, type: 'Refund', amount: -20, date: new Date().toISOString(), status: 'completed' }
          ]
        }
      };
    } else if (url.includes('/transactions/summary') || url.includes('/transactions/reports')) {
      responseData = {
        success: true,
        data: {
          totalTransactions: 120,
          totalSales: 4500,
          cashSales: 1500,
          cardSales: 3000,
          cashCollection: 1500,
          onlineCollection: 3000,
          totalRevenue: 4500,
          voids: 2,
          discounts: 50,
          byCategory: [
            { name: 'Services', amount: 2000 },
            { name: 'Products', amount: 2500 }
          ],
          hourlyVolume: [
            { hour: '9 AM', amount: 300 },
            { hour: '10 AM', amount: 450 }
          ]
        }
      };
    } else if (url.includes('/ticket-categories')) {
      responseData = {
        success: true,
        data: [
          { _id: '1', name: 'VIP Darshan', price: 300, isDynamic: true },
          { _id: '2', name: 'Special Entry', price: 150, isDynamic: true }
        ]
      };
    } else if (url.includes('/transactions') && method === 'post') {
      responseData = { success: true, data: { ...JSON.parse(config.data), _id: Math.random().toString(), date: new Date().toISOString() } };
    } else if (url.includes('/shifts/current')) {
      if (mockShiftStatus === 'Closed') {
        responseData = { success: true, data: null };
      } else if (mockShiftStatus === 'Open') {
        responseData = {
          success: true,
          data: {
            _id: 'shift_123',
            status: 'Open',
            openingBalance: 5000,
            systemCashSales: 4500,
            systemOnlineSales: 12000,
            expectedCash: 9500,
            categoryBreakdown: {
              "Poojas": { cash: 2000, online: 5000 },
              "Laddu Sales": { cash: 1000, online: 2000 },
              "VIP Darshan": { cash: 1500, online: 5000 }
            }
          }
        };
      } else {
        responseData = {
          success: true,
          data: {
            _id: 'shift_123',
            status: 'Pending Verification',
            openingBalance: 5000,
            systemCashSales: 4500,
            expectedCash: 9500
          }
        };
      }
    } else if (url.includes('/shifts/open')) {
      mockShiftStatus = 'Open';
      responseData = { success: true, data: { _id: 'shift_124', status: 'Open', openingBalance: JSON.parse(config.data).openingBalance } };
    } else if (url.includes('/shifts/close')) {
      mockShiftStatus = 'Pending Verification';
      responseData = { success: true, data: { _id: 'shift_123', status: 'Pending Verification' } };
    } else if (url.includes('/shifts/pending')) {
      responseData = {
        success: true,
        data: [
          {
            _id: 'shift_123',
            userId: { name: 'Rahul', role: 'Counter Staff' },
            status: 'Pending Verification',
            startTime: new Date(Date.now() - 8 * 3600000).toISOString(),
            endTime: new Date().toISOString(),
            openingBalance: 5000,
            systemCashSales: 4500,
            systemOnlineSales: 12000,
            physicalCashCounted: 9500,
            discrepancy: 0,
            categoryBreakdown: { "Poojas": { cash: 2000, online: 5000 }, "VIP Darshan": { cash: 2500, online: 7000 } }
          }
        ]
      };
    } else if (url.includes('/verify') && url.includes('/shifts')) {
      responseData = { success: true, data: { _id: 'shift_123', status: 'Verified' } };
    } else if (url.includes('/shifts/daily-summary')) {
      responseData = {
        success: true,
        data: [
          {
            _id: 'shift_123',
            userId: { name: 'Rahul', role: 'Counter Staff' },
            status: 'Verified',
            startTime: new Date(Date.now() - 8 * 3600000).toISOString(),
            endTime: new Date().toISOString(),
            openingBalance: 5000,
            systemCashSales: 4500,
            systemOnlineSales: 12000,
            physicalCashCounted: 9500,
            discrepancy: 0,
            categoryBreakdown: { "Poojas": { cash: 2000, online: 5000 } }
          },
          {
            _id: 'shift_122',
            userId: { name: 'Priya', role: 'Counter Staff' },
            status: 'Verified',
            startTime: new Date(Date.now() - 9 * 3600000).toISOString(),
            endTime: new Date(Date.now() - 1 * 3600000).toISOString(),
            openingBalance: 2000,
            systemCashSales: 3000,
            systemOnlineSales: 4000,
            physicalCashCounted: 4900,
            discrepancy: -100,
            categoryBreakdown: { "Laddu Sales": { cash: 3000, online: 4000 } }
          }
        ],
        summary: {
          totalShifts: 2,
          totalExpectedCash: 14500,
          totalPhysicalCash: 14400,
          totalDiscrepancy: -100,
          totalOnline: 16000
        }
      };
    } else if (url.includes('/auth/login')) {
      responseData = { success: true, token: 'mock-token-123', user: { name: 'Demo User', role: 'admin' } };
    }

    return {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      request: {}
    };
  };
  return config;
});

export default api;
