import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useBranding } from '../branding/brandingContext';
import { generateTheme } from '../branding/theme';

interface AppThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const AppThemeContext = createContext<AppThemeContextType>({} as AppThemeContextType);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const { branding } = useBranding();

  // If system changes, update theme (optional based on preference, but good default)
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const setTheme = (isDark: boolean) => setIsDarkMode(isDark);

  const currentTheme = generateTheme(branding, isDarkMode);

  return (
    <AppThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      <PaperProvider theme={currentTheme}>
        {children}
      </PaperProvider>
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(AppThemeContext);
