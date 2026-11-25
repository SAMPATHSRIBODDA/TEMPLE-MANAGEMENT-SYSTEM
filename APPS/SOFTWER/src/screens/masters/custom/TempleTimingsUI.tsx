import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Coffee, Settings2, Plus, Save, X } from 'lucide-react';

const DEFAULT_TIMINGS = [
  { id: '1', name: 'Suprabhatam (Morning Wakeup)', startTime: '04:00 AM', endTime: '05:00 AM', type: 'Pooja', isActive: true },
  { id: '2', name: 'Morning Darshan', startTime: '06:00 AM', endTime: '12:00 PM', type: 'Darshan', isActive: true },
  { id: '3', name: 'Temple Cleaning (Break)', startTime: '12:00 PM', endTime: '02:00 PM', type: 'Break', isActive: true },
  { id: '4', name: 'Afternoon Darshan', startTime: '02:00 PM', endTime: '06:00 PM', type: 'Darshan', isActive: true },
  { id: '5', name: 'Ekantha Seva (Closing)', startTime: '09:00 PM', endTime: '10:00 PM', type: 'Pooja', isActive: true },
];

export default function TempleTimingsUI() {
  const [timings, setTimings] = useState<any[]>(DEFAULT_TIMINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ name: '', startTime: '', endTime: '', type: 'Darshan' });

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/temple/core-data')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.timings && data.data.timings.length > 0) {
          setTimings(data.data.timings);
        }
      })
      .catch(err => console.error("Error fetching temple data:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('timings', JSON.stringify(timings));

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
      alert("Error saving schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSlot = () => {
    const slot = {
      id: Date.now().toString(),
      ...newSlot,
      isActive: true
    };
    setTimings([...timings, slot]);
    setIsModalOpen(false);
    setNewSlot({ name: '', startTime: '', endTime: '', type: 'Darshan' });
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Darshan': return <Sun className="h-5 w-5 text-orange-500" />;
      case 'Pooja': return <Moon className="h-5 w-5 text-purple-500" />;
      case 'Break': return <Coffee className="h-5 w-5 text-gray-500" />;
      default: return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'Darshan': return 'bg-orange-50 border-orange-200';
      case 'Pooja': return 'bg-purple-50 border-purple-200';
      case 'Break': return 'bg-gray-100 border-gray-300 opacity-80';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-y-auto animate-in fade-in zoom-in-95 duration-300 flex flex-col relative">
      
      <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Temple Timings Schedule</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage the daily schedule of the temple, including breaks and poojas.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Plus className="w-5 h-5 mr-2" /> Add Slot
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-sm active:scale-95 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Schedule</>}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center animate-in slide-in-from-top-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          Schedule updated securely on the backend.
        </div>
      )}

      <div className="p-8 flex-1">
        
        <div className="max-w-4xl space-y-4">
          {timings.map((slot, index) => (
            <div key={slot.id} className="flex items-center">
              {/* Timeline dot */}
              <div className="flex flex-col items-center mr-6 h-full min-h-[5rem]">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mt-6 z-10 relative shadow-sm ring-4 ring-white dark:ring-gray-800"></div>
                {index !== timings.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 -mt-2"></div>
                )}
              </div>
              
              {/* Card */}
              <div className={`flex-1 border rounded-xl p-5 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md ${getBg(slot.type)}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/80 rounded-lg shadow-sm">
                    {getIcon(slot.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{slot.name}</h3>
                    <div className="flex items-center text-sm font-medium text-gray-600 mt-1">
                      <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                      {slot.startTime} <span className="mx-2 opacity-50">→</span> {slot.endTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-white/60 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm text-gray-700">
                    {slot.type}
                  </span>
                  <button 
                    onClick={() => setTimings(timings.filter(t => t.id !== slot.id))}
                    className="p-2 text-red-400 hover:text-red-700 bg-white/50 rounded-lg hover:bg-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">Add New Slot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Slot Name</label>
                <input 
                  type="text" 
                  value={newSlot.name} 
                  onChange={e => setNewSlot({...newSlot, name: e.target.value})} 
                  placeholder="e.g. Morning Darshan"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Start Time</label>
                  <input 
                    type="text" 
                    value={newSlot.startTime} 
                    onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} 
                    placeholder="e.g. 06:00 AM"
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">End Time</label>
                  <input 
                    type="text" 
                    value={newSlot.endTime} 
                    onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} 
                    placeholder="e.g. 12:00 PM"
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <select 
                  value={newSlot.type} 
                  onChange={e => setNewSlot({...newSlot, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl bg-white"
                >
                  <option value="Darshan">Darshan</option>
                  <option value="Pooja">Pooja</option>
                  <option value="Break">Break</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
              <button onClick={handleAddSlot} className="flex-1 px-4 py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700">Add Slot</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
