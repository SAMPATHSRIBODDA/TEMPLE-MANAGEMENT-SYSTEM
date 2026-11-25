import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#431282',
    secondary: '#FFB800',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1C1C1E',
    border: '#E5E5EA',
    success: '#34C759',
    error: '#FF3B30',
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
