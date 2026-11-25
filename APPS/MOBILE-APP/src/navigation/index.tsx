import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AuthNavigator } from './AuthNavigator';
import { useBranding } from '../branding/brandingContext';
import { useAuth } from '../contexts/AuthContext';

export const AppNavigator = () => {
  const { branding } = useBranding();
  const { isAuthenticated } = useAuth();

  const renderNavigator = () => {
    if (!branding) return <OnboardingNavigator />;
    if (!isAuthenticated) return <AuthNavigator />;
    return <RootNavigator />;
  };

  return (
    <NavigationContainer>
      {renderNavigator()}
    </NavigationContainer>
  );
};
