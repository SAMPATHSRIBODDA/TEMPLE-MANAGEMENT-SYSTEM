import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { BrandingProvider, useBranding } from './src/branding/brandingContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppThemeProvider } from './src/contexts/ThemeContext';
import { NetworkProvider, useNetwork } from './src/contexts/NetworkContext';
import { OfflineBanner } from './src/components/OfflineBanner';
import { AudioProvider } from './src/contexts/AudioContext';
import { MiniPlayer } from './src/components/player/MiniPlayer';
import { FullScreenPlayer } from './src/components/player/FullScreenPlayer';
import { View, ActivityIndicator } from 'react-native';

import './src/i18n'; // Initialize i18n

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading } = useBranding();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#431282" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

const AppRoot = () => {
  const { isOffline } = useNetwork();
  return (
    <>
      <OfflineBanner isOffline={isOffline} />
      <AppContent />
      <MiniPlayer />
      <FullScreenPlayer />
    </>
  );
};

// Trigger reload
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <AuthProvider>
          <BrandingProvider>
            <AppThemeProvider>
              <AudioProvider>
                <AppRoot />
              </AudioProvider>
            </AppThemeProvider>
          </BrandingProvider>
        </AuthProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
}
