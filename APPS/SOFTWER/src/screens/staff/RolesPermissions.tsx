import React, { useState } from 'react';
import { ShieldCheck, Save, Check, X } from 'lucide-react';
import { usePermissionsStore, ALL_ROLES as roles, ALL_PERMISSIONS as permissions } from '../../store/permissionsStore';

export default function RolesPermissions() {
  const { matrix, togglePermission } = usePermissionsStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Since Zustand persist is used, it saves automatically. Just show a fake loader for UX.
    setTimeout(() => {
      setIsSaving(false);
      alert('Access Control List updated successfully.');
    }, 800);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <ShieldCheck className="h-6 w-6 mr-2 text-orange-500" /> Roles & Permissions
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage module access levels for each staff role.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap shadow-sm disabled:opacity-70"
        >
          {isSaving ? (
             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
          ) : (
             <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save ACL Rules'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900 z-10 border-r border-gray-200 dark:border-gray-700">
                Staff Role
              </th>
              {permissions.map(perm => (
                <th key={perm} className="px-4 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                  {perm}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {roles.map((role) => (
              <tr key={role} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10">
                  {role}
                </td>
                {permissions.map(perm => {
                  const hasAccess = matrix[role]?.[perm];
                  return (
                    <td key={`${role}-${perm}`} className="px-4 py-4 text-center">
                      <button
                        onClick={() => togglePermission(role, perm)}
                        className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${
                          hasAccess 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-600'
                        }`}
                      >
                        {hasAccess ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-300">
        <strong>Note:</strong> Changes to permissions will take effect on the user's next login.
      </div>
    </div>
  );
}
