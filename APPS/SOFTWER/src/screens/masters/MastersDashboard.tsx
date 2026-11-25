import React, { useState } from 'react';
import MasterDataGrid from '../../components/masters/MasterDataGrid';
import TempleInfoSettings from './custom/TempleInfoSettings';
import TempleTimingsUI from './custom/TempleTimingsUI';
import FestivalCalendarUI from './custom/FestivalCalendarUI';
import PoojaSettingsUI from './custom/PoojaSettingsUI';
import { 
  templeInfoConfig, templeTimingsConfig, festivalCalendarConfig,
  poojaCategoriesConfig, monthlyPoojaPlansConfig, donationCategoriesConfig,
  receiptSettingsConfig, printerSettingsConfig, qrSettingsConfig, paymentSettingsConfig
} from './masterConfigs';

import { useSearchParams } from 'react-router-dom';

const modules = [
  { group: 'Core Data', configs: [templeInfoConfig, templeTimingsConfig, festivalCalendarConfig] },
  { group: 'Poojas & Donations', configs: [poojaCategoriesConfig, monthlyPoojaPlansConfig, donationCategoriesConfig] },
  { group: 'Settings', configs: [receiptSettingsConfig, printerSettingsConfig, qrSettingsConfig, paymentSettingsConfig] }
];

export default function MastersDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || modules[0].group;
  const setActiveTab = (tab: string) => setSearchParams({ tab });
  const activeTabConfigs = modules.find(t => t.group === activeTab)?.configs || modules[0].configs;
  const [activeConfig, setActiveConfig] = useState(activeTabConfigs[0]);

  return (
    <div className="flex h-full flex-col gap-6 animate-in fade-in duration-500">
      
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Master Data</h2>
        
        <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-gray-200 dark:border-gray-700 pb-px">
          {modules.map((group) => {
            const isActive = activeTab === group.group;
            return (
              <button
                key={group.group}
                onClick={() => {
                  setActiveTab(group.group);
                  setActiveConfig(group.configs[0]);
                }}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {group.group}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4">
          {activeTabConfigs.map(config => (
            <button
              key={config.id}
              onClick={() => setActiveConfig(config)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeConfig.id === config.id 
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {config.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col overflow-hidden min-h-0">
        {activeConfig.id === 'temple-info' ? (
          <TempleInfoSettings />
        ) : activeConfig.id === 'temple-timings' ? (
          <TempleTimingsUI />
        ) : activeConfig.id === 'festival-calendar' ? (
          <FestivalCalendarUI />
        ) : activeConfig.id === 'pooja-categories' ? (
          <PoojaSettingsUI />
        ) : (
          <MasterDataGrid config={activeConfig} />
        )}
      </div>
      
    </div>
  );
}
