import React, { useState } from 'react';
import { useDarshanStore } from '../../store/darshanStore';
import ReceiptView from '../../printer/ReceiptView';
import { ArrowLeft, Search, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

export default function DarshanHistory() {
  const navigate = useNavigate();
  const [darshanHistory, setDarshanHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/transactions', {
          params: { page: currentPage, limit: itemsPerPage, search: searchTerm }
        });
        if (data.success) {
          setDarshanHistory(data.data);
          setTotalItems(data.total);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      }
    };
    fetchHistory();
  }, [currentPage, searchTerm]);

  const handleReprint = (booking: any) => {
    // Reconstruct receipt format for ReceiptView
    setViewingReceipt({
      id: booking.id,
      timestamp: booking.timestamp,
      total: booking.total,
      cashReceived: booking.cashReceived,
      change: booking.change,
      items: [{
        ticket: { id: booking.darshanType.id, name: `${booking.darshanType.name} (${booking.date} ${booking.slot})`, price: booking.darshanType.price, color: '' },
        quantity: booking.persons
      }]
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <button 
            onClick={() => navigate('/darshan')}
            className="mr-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Darshan History</h2>
            <p className="text-gray-500 text-sm">Search and reprint darshan tickets</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
            <input
              type="text"
              className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="Search Darshan ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Darshan Info</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Persons</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {darshanHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No darshan bookings found.
                </td>
              </tr>
            ) : (
              darshanHistory.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{booking.receiptNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-bold">{booking.items.map((i: any) => i.itemType).join(', ')}</span>
                    <br/>
                    <span className="text-gray-500 text-xs">{new Date(booking.createdAt).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{booking.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setViewingReceipt(booking)}
                      className="inline-flex items-center text-orange-600 hover:text-orange-900 font-bold"
                    >
                      <Printer className="h-4 w-4 mr-1" /> Reprint
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Reused Receipt Modal */}
      <ReceiptView 
        receipt={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        isReprint={true}
      />

    </div>
  );
}
