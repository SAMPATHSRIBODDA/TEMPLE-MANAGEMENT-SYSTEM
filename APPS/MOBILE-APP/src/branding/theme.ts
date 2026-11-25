import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { TempleBranding } from './brandingService';

const fontConfig = {
  fontFamily: 'System', // Fallback to system font if no custom font is loaded
};

export const generateTheme = (branding: TempleBranding | null, isDark: boolean = false) => {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  
  return {
    ...baseTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...baseTheme.colors,
      primary: branding?.primaryColor || (isDark ? '#BB86FC' : '#431282'),
      secondary: branding?.secondaryColor || (isDark ? '#FFD54F' : '#FFB800'),
      background: isDark ? '#121212' : '#F8F9FA',
      surface: isDark ? '#1E1E1E' : '#FFFFFF',
      surfaceVariant: isDark ? '#2C2C2C' : '#F0F0F0',
      onSurface: isDark ? '#FFFFFF' : '#1C1C1E',
      onSurfaceVariant: isDark ? '#AAAAAA' : '#666666',
      outline: isDark ? '#444444' : '#E5E5EA',
      success: isDark ? '#81C784' : '#34C759',
      error: isDark ? '#E57373' : '#FF3B30',
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 48,
    },
  };
};
