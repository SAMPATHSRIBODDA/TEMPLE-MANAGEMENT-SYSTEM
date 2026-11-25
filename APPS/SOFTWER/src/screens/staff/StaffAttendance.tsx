import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

interface Shift {
  id: string;
  name: string;
  role: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  status: 'Clocked In' | 'Pending' | 'Absent';
  time: string;
  clockInTime?: number;
  location: string;
}

const initialMockShifts: Shift[] = [
  { id: 'EMP002', name: 'Suresh Babu', role: 'Counter Staff', shift: 'Morning', status: 'Clocked In', time: '05:45 AM', clockInTime: Date.now() - 3 * 3600000 - 15 * 60000, location: 'Counter 1' },
  { id: 'EMP003', name: 'Venkatesh Rao', role: 'Accountant', shift: 'Morning', status: 'Clocked In', time: '05:30 AM', clockInTime: Date.now() - 3 * 3600000 - 30 * 60000, location: 'Main Office' },
  { id: 'EMP006', name: 'Ravi Teja', role: 'Counter Staff', shift: 'Afternoon', status: 'Pending', time: '-', location: 'Counter 2' },
  { id: 'EMP007', name: 'Gopal K', role: 'Temple Admin', shift: 'Morning', status: 'Absent', time: '-', location: 'Main Office' },
];

const LiveCounter = ({ startTime }: { startTime: number }) => {
  const [elapsed, setElapsed] = useState(Date.now() - startTime);
  
  useEffect(() => {
    const timer = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
  const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');

  return <span className="text-orange-500 font-bold ml-2 tracking-widest text-xs bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-md">{hours}:{minutes}:{seconds}</span>;
};

export default function StaffAttendance() {
  const [shifts, setShifts] = useState<Shift[]>(initialMockShifts);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Clocked In' | 'Pending' | 'Absent'>('All');

  // Dynamic calculations based on current data
  const clockedInCount = shifts.filter(s => s.status === 'Clocked In').length;
  const pendingCount = shifts.filter(s => s.status === 'Pending').length;
  const absentCount = shifts.filter(s => s.status === 'Absent').length;

  const displayedShifts = useMemo(() => {
    if (statusFilter === 'All') return shifts;
    return shifts.filter(s => s.status === statusFilter);
  }, [shifts, statusFilter]);

  const handleAssignShift = () => {
    const newShift: Shift = {
      id: `EMP00${Math.floor(Math.random() * 90) + 10}`,
      name: `New Staff ${Math.floor(Math.random() * 100)}`,
      role: 'Counter Staff',
      shift: 'Afternoon',
      status: 'Pending',
      time: '-',
      location: 'Counter ' + (Math.floor(Math.random() * 3) + 1)
    };
    setShifts([newShift, ...shifts]);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="h-6 w-6 mr-2 text-orange-500" /> Attendance & Shifts
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage daily staff roster and track clock-ins.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
          {statusFilter !== 'All' && (
            <button 
              onClick={() => setStatusFilter('All')}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              Clear Filter
            </button>
          )}
          <button 
            onClick={handleAssignShift}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Assign Shift
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          onClick={() => setStatusFilter('Clocked In')}
          className={`p-4 rounded-xl border shadow-sm flex items-center cursor-pointer transition-all hover:-translate-y-1 ${
            statusFilter === 'Clocked In' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 ring-2 ring-green-500/20' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Clocked In</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{clockedInCount}</p>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-xl border shadow-sm flex items-center cursor-pointer transition-all hover:-translate-y-1 ${
            statusFilter === 'Pending' 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 ring-2 ring-yellow-500/20' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mr-4">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Pending Shifts</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{pendingCount}</p>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('Absent')}
          className={`p-4 rounded-xl border shadow-sm flex items-center cursor-pointer transition-all hover:-translate-y-1 ${
            statusFilter === 'Absent' 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-500 ring-2 ring-red-500/20' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Absences</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{absentCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time & Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayedShifts.length > 0 ? displayedShifts.map((s, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.role}</td>
                  <td className="px-6 py-4 text-sm font-medium">{s.shift}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{s.location}</td>
                  <td className="px-6 py-4 text-sm font-mono flex items-center pt-5">
                    {s.time}
                    {s.status === 'Clocked In' && s.clockInTime && <LiveCounter startTime={s.clockInTime} />}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.status === 'Clocked In' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                        {s.status}
                      </span>
                    )}
                    {s.status === 'Pending' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                        {s.status}
                      </span>
                    )}
                    {s.status === 'Absent' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                        {s.status}
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No staff found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
