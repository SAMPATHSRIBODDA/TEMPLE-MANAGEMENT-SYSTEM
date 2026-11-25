import React, { useState, useEffect } from 'react';
import { Ticket, Edit2, Plus, Trash2, X, Check, FolderPlus } from 'lucide-react';

export default function TicketPricingDashboard() {
  const [dbData, setDbData] = useState<any[]>([]); // Array of all tickets
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/ticket-categories');
      const result = await res.json();
      if (result.success && result.data) {
        setDbData(result.data);
      }
    } catch(e) { console.error(e); }
  }

  useEffect(() => { fetchCategories(); }, []);

  const updateDataBackend = async (sectionName: string, newItems: any[]) => {
    try {
      await fetch('http://localhost:5000/api/v1/ticket-categories/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionName, items: newItems })
      });
      fetchCategories();
    } catch(e) { console.error(e); }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditingSection(item.sectionName);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAdd = (sectionName: string) => {
    setEditingItem(null);
    setEditingSection(sectionName);
    setFormData({ isActive: true, sectionName });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, sectionName: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      const currentList = dbData.filter(t => t.sectionName === sectionName);
      updateDataBackend(sectionName, currentList.filter(item => item._id !== id && item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    
    const currentList = dbData.filter(t => t.sectionName === editingSection);
    let updatedList;
    if (editingItem) {
      updatedList = currentList.map(item => (item._id === editingItem._id || item.id === editingItem.id) ? { ...formData } : item);
    } else {
      updatedList = [...currentList, { ...formData, id: Date.now().toString() }];
    }
    updateDataBackend(editingSection, updatedList);
    setIsModalOpen(false);
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    // Creating a section implicitly means we need at least one ticket to save it (or just rely on the frontend state if we had one).
    // For now, we just open the add ticket modal directly for this new section.
    setIsSectionModalOpen(false);
    handleAdd(newSectionName.trim());
    setNewSectionName('');
  }

  // Group tickets by sectionName
  const groupedSections = dbData.reduce((acc, curr) => {
    if (!acc[curr.sectionName]) acc[curr.sectionName] = [];
    acc[curr.sectionName].push(curr);
    return acc;
  }, {});

  const renderCard = (item: any, bgClass: string, textClass: string) => (
    <div key={item._id || item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-700 shadow-sm relative group overflow-hidden transition-all hover:border-gray-300 dark:hover:border-gray-500">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
          <Edit2 className="h-4 w-4" />
        </button>
        <button onClick={() => handleDelete(item._id || item.id, item.sectionName)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className={`h-12 w-12 rounded-xl mb-4 flex items-center justify-center ${bgClass} ${textClass}`}>
        <Ticket className="h-6 w-6"/>
      </div>
      
      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2">{item.name}</h3>
      <div className="flex items-end gap-2 mt-4">
        <span className="text-3xl font-black text-gray-900 dark:text-white">₹{item.price}</span>
      </div>
      {!item.isActive && (
        <span className="absolute bottom-4 right-4 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Inactive</span>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pricing & Tickets Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage the sections and tickets dynamically.</p>
        </div>
        <button onClick={() => setIsSectionModalOpen(true)} className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors shadow-sm">
          <FolderPlus className="h-4 w-4 mr-2" /> New Section
        </button>
      </div>

      {Object.keys(groupedSections).length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
          No ticket sections found. Click "New Section" to add one.
        </div>
      )}

      {Object.keys(groupedSections).map((sectionName, index) => {
        const items = groupedSections[sectionName];
        // Generate alternate colors based on index
        const colors = [
          { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', btn: 'bg-blue-600 hover:bg-blue-700', iconBg: 'bg-blue-100 text-blue-600' },
          { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', btn: 'bg-orange-600 hover:bg-orange-700', iconBg: 'bg-orange-100 text-orange-600' },
          { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', btn: 'bg-purple-600 hover:bg-purple-700', iconBg: 'bg-purple-100 text-purple-600' },
          { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', btn: 'bg-green-600 hover:bg-green-700', iconBg: 'bg-green-100 text-green-600' },
        ];
        const color = colors[index % colors.length];

        return (
          <section key={sectionName} className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color.iconBg}`}>
                  <Ticket className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{sectionName}</h2>
              </div>
              <button onClick={() => handleAdd(sectionName)} className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm ${color.btn}`}>
                <Plus className="h-4 w-4 mr-2" /> Add Ticket
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {items.map((item: any) => renderCard(item, color.bg, color.text))}
            </div>
          </section>
        );
      })}

      {/* Ticket Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Ticket' : `Add Ticket to ${editingSection}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-2xl font-bold"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active & Available in Counter
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center">
                  <Check className="h-4 w-4 mr-2" /> Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Section Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Section</h2>
              <button onClick={() => setIsSectionModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddSection} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Special Poojas"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSectionModalOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
