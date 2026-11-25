import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Star, MapPin, Save, X } from 'lucide-react';

export default function FestivalCalendarUI() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [festivals, setFestivals] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFest, setNewFest] = useState({ name: '', date: '', duration: '', type: 'Major Festival', location: '', expectedCrowd: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/temple/core-data')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.festivals) {
          setFestivals(data.data.festivals);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('festivals', JSON.stringify(festivals));

      const response = await fetch('http://localhost:5000/api/v1/temple/core-data', {
        method: 'POST',
        body: fd
      });
      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Failed to save: " + result.message);
      }
    } catch (e) {
      console.error(e);
      alert("Error saving festivals");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFest = () => {
    const fest = {
      id: Date.now().toString(),
      ...newFest
    };
    setFestivals([...festivals, fest]);
    setIsModalOpen(false);
    setNewFest({ name: '', date: '', duration: '', type: 'Major Festival', location: '', expectedCrowd: '' });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentMonth, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    return (
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 flex flex-col">
        {/* Simple Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-4 mb-4 text-center font-bold text-gray-400 text-sm uppercase tracking-wider">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        
        {/* Calendar Body */}
        <div className="flex-1 grid grid-cols-7 gap-4">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-3"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayFestivals = festivals.filter(f => f.date === dateStr);
            const hasFest = dayFestivals.length > 0;

            return (
              <div 
                key={i} 
                className={`border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex flex-col transition-colors min-h-[80px] ${
                  hasFest ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                <span className={`font-bold text-lg mb-1 ${hasFest ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {dayNum}
                </span>
                
                {dayFestivals.map(fest => (
                  <div key={fest.id} className="mt-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded truncate shadow-sm" title={fest.name}>
                    {fest.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col relative">
      
      {/* Header */}
      <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Festival Calendar</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Plan and manage upcoming temple festivals, crowd estimates, and events.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Plus className="w-5 h-5 mr-2" /> Add Festival
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-sm active:scale-95 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Calendar</>}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center animate-in slide-in-from-top-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          Festivals updated securely on the backend.
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Single Month Calendar Grid */}
        <div className="flex-1 border-r border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {monthNames[currentMonth]}
              </h3>
              <select 
                value={currentYear} 
                onChange={handleYearChange}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg px-3 py-1 outline-none"
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const yr = new Date().getFullYear() - 2 + i;
                  return <option key={yr} value={yr}>{yr}</option>;
                })}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button onClick={nextMonth} className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {renderCalendar()}
        </div>

        {/* Right Side: Upcoming Events List */}
        <div className="w-96 bg-white dark:bg-gray-800 overflow-y-auto p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm flex items-center">
            <Star className="w-4 h-4 mr-2 text-orange-500" /> All Festivals
          </h3>

          <div className="space-y-4">
            {festivals.map(fest => (
              <div key={fest.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-300 transition-colors group relative">
                <button 
                  onClick={() => setFestivals(festivals.filter(f => f.id !== fest.id))}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-800 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-start mb-2 pr-6">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-orange-600 transition-colors">{fest.name}</h4>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1.5 opacity-70" /> {fest.date}
                  </div>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-bold">{fest.duration}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {fest.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2.5"></span> Crowd: {fest.expectedCrowd}
                  </div>
                </div>
              </div>
            ))}
            {festivals.length === 0 && (
              <p className="text-gray-500 italic text-center mt-10">No festivals scheduled yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* Add Festival Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">Add New Festival</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Festival Name</label>
                <input 
                  type="text" 
                  value={newFest.name} 
                  onChange={e => setNewFest({...newFest, name: e.target.value})} 
                  placeholder="e.g. Vaikuntha Ekadashi"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newFest.date} 
                    onChange={e => setNewFest({...newFest, date: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
                  <input 
                    type="text" 
                    value={newFest.duration} 
                    onChange={e => setNewFest({...newFest, duration: e.target.value})} 
                    placeholder="e.g. 1 Day"
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location / Venue</label>
                <input 
                  type="text" 
                  value={newFest.location} 
                  onChange={e => setNewFest({...newFest, location: e.target.value})} 
                  placeholder="e.g. Main Temple"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Expected Crowd</label>
                  <input 
                    type="text" 
                    value={newFest.expectedCrowd} 
                    onChange={e => setNewFest({...newFest, expectedCrowd: e.target.value})} 
                    placeholder="e.g. 100,000+"
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                  <select 
                    value={newFest.type} 
                    onChange={e => setNewFest({...newFest, type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl bg-white"
                  >
                    <option value="Major Festival">Major Festival</option>
                    <option value="Annual Event">Annual Event</option>
                    <option value="Minor Ritual">Minor Ritual</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={handleAddFest} className="flex-1 px-4 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700">Add Festival</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
