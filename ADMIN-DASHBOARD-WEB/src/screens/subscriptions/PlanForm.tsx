import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import { subscriptionPlans } from '../../data/mockData';

export const PlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const existingPlan = isEditing ? subscriptionPlans.find(p => p.id === id) : null;
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(existingPlan?.features || ['']);

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index: number, val: string) => {
    const newF = [...features];
    newF[index] = val;
    setFeatures(newF);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => navigate('/subscriptions'), 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-3xl">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/subscriptions" className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {isEditing ? 'Edit Subscription Plan' : 'Create New Plan'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Configure pricing and features for this subscription tier.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-white/20 dark:border-gray-800/50">Plan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="input-label">Plan Name</label>
              <input type="text" required defaultValue={existingPlan?.name} className="input-field" placeholder="e.g. Starter Plan" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="input-label">Description</label>
              <input type="text" required defaultValue={existingPlan?.description} className="input-field" placeholder="Brief description of who this plan is for" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-white/20 dark:border-gray-800/50 mt-8">Pricing & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="input-label">Monthly Price (₹)</label>
              <input type="number" required defaultValue={existingPlan?.monthlyPrice} className="input-field" placeholder="2999" />
            </div>
            <div className="space-y-1">
              <label className="input-label">Annual Price (₹)</label>
              <input type="number" required defaultValue={existingPlan?.annualPrice} className="input-field" placeholder="29990" />
            </div>
            <div className="space-y-1">
              <label className="input-label">Trial Period (Days)</label>
              <input type="number" required defaultValue={existingPlan?.trialDays || 14} className="input-field" />
            </div>
            <div className="space-y-1">
              <label className="input-label">Maximum Licenses</label>
              <input type="number" required defaultValue={existingPlan?.maxLicenses || 1} className="input-field" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/20 dark:border-gray-800/50 mt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Included Features</h3>
            <button type="button" onClick={addFeature} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer">
              <Plus size={16} /> Add Feature
            </button>
          </div>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <input 
                  type="text" 
                  required 
                  value={feature} 
                  onChange={(e) => updateFeature(index, e.target.value)} 
                  className="input-field flex-1" 
                  placeholder={`Feature ${index + 1}`} 
                />
                <button 
                  type="button" 
                  onClick={() => removeFeature(index)}
                  disabled={features.length === 1}
                  className="p-3 text-gray-400 dark:text-gray-500 hover:text-danger hover:bg-danger/5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/20 dark:border-gray-800/50">
          <Link to="/subscriptions" className="px-5 py-2.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors shadow-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEditing ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};
