import React, { createContext, useContext, useState } from 'react';

interface NetworkContextType {
  isOffline: boolean;
  setOfflineMode: (offline: boolean) => void;
}

const NetworkContext = createContext<NetworkContextType>({} as NetworkContextType);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <NetworkContext.Provider value={{ isOffline, setOfflineMode: setIsOffline }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
