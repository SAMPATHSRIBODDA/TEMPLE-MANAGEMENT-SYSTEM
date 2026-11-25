import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Download, Calendar, Filter, Printer,
  BarChart3, PieChart as PieChartIcon, TrendingUp, DollarSign
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const reportCategories = [
  {
    group: 'Revenue Reports',
    reports: ['Daily Revenue', 'Monthly Revenue', 'Yearly Revenue']
  },
  {
    group: 'Module Reports',
    reports: ['Darshan Revenue', 'Entry Ticket Revenue', 'Laddu Revenue', 'Donation Report']
  },
  {
    group: 'Financial Reports',
    reports: ['Collection Summary', 'Refund Report', 'Tax Report']
  }
];

// Mock data generator for charts and tables
const getMockData = (type: string) => {
  if (type.includes('Revenue') && !type.includes('Report')) {
    return {
      chartType: 'area',
      chartData: [
        { name: 'Mon', value: 45000 }, { name: 'Tue', value: 52000 },
        { name: 'Wed', value: 38000 }, { name: 'Thu', value: 65000 },
        { name: 'Fri', value: 85000 }, { name: 'Sat', value: 120000 },
        { name: 'Sun', value: 150000 },
      ],
      tableData: [
        { Date: '2026-06-26', Cash: 45000, Online: 20000, Total: 65000 },
        { Date: '2026-06-25', Cash: 50000, Online: 35000, Total: 85000 },
      ]
    };
  } else if (type === 'Collection Summary') {
    return {
      chartType: 'pie',
      chartData: [
        { name: 'Cash', value: 400000, color: '#10b981' },
        { name: 'UPI', value: 250000, color: '#3b82f6' },
        { name: 'Card', value: 150000, color: '#f59e0b' },
      ],
      tableData: [
        { Method: 'Cash', Amount: 400000, Percentage: '50%' },
        { Method: 'UPI', Amount: 250000, Percentage: '31.25%' },
        { Method: 'Card', Amount: 150000, Percentage: '18.75%' },
      ]
    };
  } else {
    return {
      chartType: 'bar',
      chartData: [
        { name: 'VIP', value: 85000 }, { name: 'Special', value: 45000 },
        { name: 'Free', value: 0 },
      ],
      tableData: [
        { Category: 'VIP Break', Count: 170, Revenue: 85000 },
        { Category: 'Special Entry', Count: 150, Revenue: 45000 },
      ]
    };
  }
};

import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function ReportsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeReport = searchParams.get('report') || 'Daily Revenue';
  const setActiveReport = (report: string) => setSearchParams({ report });
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPeriod = (report: string) => {
    if (report.includes('Monthly')) return 'monthly';
    if (report.includes('Yearly')) return 'yearly';
    return 'daily';
  };

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/transactions/reports', {
          params: { period: getPeriod(activeReport) }
        });
        if (res.data.success) setReportData(res.data.data);
      } catch {
        setReportData(getMockData(activeReport).chartData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [activeReport]);

  const chartData = reportData.length > 0
    ? reportData.map((d: any) => ({ name: d._id || d.name, value: d.total || d.value || 0, cash: d.cash || 0, online: d.online || 0 }))
    : getMockData(activeReport).chartData;
  const tableData = chartData;
  const chartType = activeReport.includes('Collection') ? 'pie' : 'area';


  const handleExport = (format: 'csv' | 'pdf' | 'print') => {
    if (format === 'csv') {
      const filename = `${activeReport.replace(/\s+/g, '_')}_${fromDate}`;
      exportToCSV(filename, tableData);
    } else {
      alert(`Generating ${format.toUpperCase()} for ${activeReport}...`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      
      {/* Horizontal Report Navigation */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Financial Reports</h2>
        
        <div className="flex overflow-x-auto hide-scrollbar pb-2">
          <div className="flex space-x-6">
            {reportCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 pl-2">
                  {cat.group}
                </span>
                <div className="flex space-x-2">
                  {cat.reports.map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveReport(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                        activeReport === type 
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md' 
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Report Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col overflow-hidden min-h-0">
        
        {/* Toolbar & Filters */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeReport}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Financial metrics based on selected date range.</p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 w-full xl:w-auto">
            {/* Date Picker Group */}
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm w-full sm:w-auto">
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="date" 
                  value={fromDate} 
                  onChange={e => setFromDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm bg-transparent outline-none text-gray-700 dark:text-gray-300 font-medium"
                />
              </div>
              <span className="text-gray-400 font-bold">to</span>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="date" 
                  value={toDate} 
                  onChange={e => setToDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm bg-transparent outline-none text-gray-700 dark:text-gray-300 font-medium"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:border-l sm:pl-3 border-gray-200 dark:border-gray-700 w-full sm:w-auto">
              <button onClick={() => handleExport('print')} className="flex-1 sm:flex-none flex justify-center p-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-600" title="Print">
                <Printer className="h-5 w-5" />
              </button>
              <button onClick={() => handleExport('csv')} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-bold transition-colors border border-green-200 dark:border-green-800">
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
              </button>
              <button onClick={() => handleExport('pdf')} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-bold transition-colors border border-red-200 dark:border-red-800">
                <Download className="h-4 w-4 mr-2" /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-gray-50/50 dark:bg-gray-900/20">
          
          {/* Chart Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              {chartType === 'area' ? <TrendingUp className="w-5 h-5 mr-2 text-blue-500" /> : 
               chartType === 'pie' ? <PieChartIcon className="w-5 h-5 mr-2 text-green-500" /> : 
               <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />}
              Visual Analytics
            </h3>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} tickFormatter={(val) => `₹${val/1000}k`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <Tooltip formatter={(value: any) => [`₹${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fill="url(#colorVal)" />
                  </AreaChart>
                ) : chartType === 'pie' ? (
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} tickFormatter={(val) => `₹${val/1000}k`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <Tooltip formatter={(value: any) => [`₹${value}`, 'Revenue']} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Grid Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex-1">
             <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
               <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                 <FileSpreadsheet className="w-5 h-5 mr-2 text-gray-400" /> Detailed Records
               </h3>
               <div className="relative">
                 <input 
                  type="text" 
                  placeholder="Filter rows..." 
                  className="pl-8 pr-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                 />
                 <Filter className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
               </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left whitespace-nowrap min-w-max">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                      {Object.keys(tableData[0]).map(header => (
                        <th key={header} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {tableData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        {Object.entries(row).map(([key, val]: [string, any], vIdx) => (
                          <td key={vIdx} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                            {typeof val === 'number' && (key.includes('Total') || key.includes('Cash') || key.includes('Online') || key.includes('Revenue') || key.includes('Amount'))
                              ? <span className="font-bold text-gray-900 dark:text-white">₹{val.toLocaleString()}</span>
                              : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
