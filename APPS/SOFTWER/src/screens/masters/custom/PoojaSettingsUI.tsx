import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Activity } from 'lucide-react';

export default function PoojaSettingsUI() {
  const [poojas, setPoojas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Daily');
  const [price, setPrice] = useState(100);
  const [isMonthly, setIsMonthly] = useState('false');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);

  const fetchPoojas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/poojas');
      const data = await res.json();
      if (data.success) {
        setPoojas(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch poojas', e);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  const filteredData = poojas.filter((item) => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setCategory('Daily');
    setPrice(100);
    setIsMonthly('false');
    setStartDate('');
    setEndDate('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name || '');
    setDescription(item.description || '');
    setCategory(item.category || 'Daily');
    setPrice(item.price || 100);
    setIsMonthly(item.isMonthly ? 'true' : 'false');
    setStartDate(item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '');
    setEndDate(item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '');
    setStatus(item.status || 'active');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pooja?')) {
      try {
        await fetch(`http://localhost:5000/api/v1/poojas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'inactive' })
        });
        fetchPoojas();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name,
      description,
      category,
      price: Number(price),
      isMonthly: isMonthly === 'true',
      startDate: isMonthly === 'true' ? startDate : undefined,
      endDate: isMonthly === 'true' ? endDate : undefined,
      status,
      templeId: '66a123456789012345678901' // Assume temple ID is available from auth in real app
    };

    try {
      if (editingItem) {
        await fetch(`http://localhost:5000/api/v1/poojas/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('http://localhost:5000/api/v1/poojas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      await fetchPoojas();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Error saving Pooja');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pooja Categories</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage poojas, donations, and monthly subscriptions offered by the temple.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input
               type="text"
               placeholder="Search poojas..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-64 pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm dark:text-white"
             />
           </div>
           <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold shadow-sm">
             <Plus className="h-4 w-4 mr-2" /> Add Pooja
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map(item => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate pr-2">{item.name}</h3>
                  <div className="flex bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                    ₹{item.price}
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 h-10">{item.description || 'No description provided.'}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs">
                    {item.category}
                  </span>
                  {item.isMonthly && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded text-xs flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      Monthly ({item.startDate ? new Date(item.startDate).toLocaleDateString() : '?'} - {item.endDate ? new Date(item.endDate).toLocaleDateString() : '?'})
                    </span>
                  )}
                  {item.status === 'active' ? (
                     <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs">Active</span>
                  ) : (
                     <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs">Inactive</span>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/80 px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg shadow-2xl flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between">
              <h3 className="text-xl font-bold">{editingItem ? 'Edit Pooja' : 'Add Pooja'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Category *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Festival</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Price (₹) *</label>
                  <input required type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Is Subscription?</label>
                  <select value={isMonthly} onChange={e => setIsMonthly(e.target.value)} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                {isMonthly === 'true' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-1">Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">End Date</label>
                      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800" />
                    </div>
                  </>
                )}
              </div>
              <div>
                 <label className="block text-sm font-bold mb-1">Status</label>
                 <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border rounded-lg p-2 bg-white dark:bg-gray-800">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                 </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-600 text-white rounded-lg">{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
