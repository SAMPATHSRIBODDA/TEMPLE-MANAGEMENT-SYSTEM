import React, { useState } from 'react';
import { useLadduStore } from '../../store/ladduStore';
import ReceiptView from '../../printer/ReceiptView';
import { ArrowLeft, Search, Printer, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

export default function LadduHistory() {
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  const [totalItems, setTotalItems] = useState(0);

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
          setOrderHistory(data.data);
          setTotalItems(data.total);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      }
    };
    fetchHistory();
  }, [currentPage, searchTerm]);

  const handleReprint = (order: any) => {
    setViewingReceipt(order);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <button 
            onClick={() => navigate('/laddu')}
            className="mr-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Laddu Orders & Collection</h2>
            <p className="text-gray-500 text-sm">Verify tokens and mark prasadam as collected</p>
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
              placeholder="Scan / Search Token ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              autoFocus
            />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Token ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items Ordered</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orderHistory.map((order) => (
                <tr key={order._id} className={`transition-colors hover:bg-orange-50`}>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{order.receiptNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {order.items.map((i: any, idx: number) => (
                      <div key={idx} className="flex items-center">
                        <Package className="h-4 w-4 mr-1 text-orange-500" />
                        {i.quantity || 1}x {i.itemType}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                      {order.status || 'valid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => handleReprint(order)}
                        className="inline-flex items-center text-orange-600 hover:text-orange-900 font-bold p-1.5 border border-transparent hover:border-orange-200 rounded-lg transition-colors"
                        title="Reprint Token"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
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

      {/* Reused Receipt Modal for Token Printing */}
      <ReceiptView 
        receipt={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        isReprint={true}
      />

    </div>
  );
}
