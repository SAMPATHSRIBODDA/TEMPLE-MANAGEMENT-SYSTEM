import React, { createContext, useContext, useState } from 'react';
import { TempleBranding, fetchTempleBranding } from './brandingService';

interface BrandingContextType {
  branding: TempleBranding | null;
  isLoading: boolean;
  selectTemple: (id: string) => Promise<void>;
  clearTemple: () => void;
}

const BrandingContext = createContext<BrandingContextType>({
  branding: null,
  isLoading: false,
  selectTemple: async () => {},
  clearTemple: () => {},
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<TempleBranding | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectTemple = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await fetchTempleBranding(id);
      setBranding(data);
    } catch (error) {
      console.error("Failed to load branding", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTemple = () => {
    setBranding(null);
  };

  return (
    <BrandingContext.Provider value={{ branding, isLoading, selectTemple, clearTemple }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
