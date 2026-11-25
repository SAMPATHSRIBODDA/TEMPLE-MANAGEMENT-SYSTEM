import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CalendarDays, Flower2, User } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { SpiritualHomeScreen } from '../screens/spiritual/SpiritualHomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';

export type TabParamList = {
  Home: undefined;
  Bookings: undefined;
  Spiritual: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: t('tabs.home', 'Home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
        options={{
          tabBarLabel: t('tabs.bookings', 'Bookings'),
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Spiritual" 
        component={SpiritualHomeScreen} 
        options={{
          tabBarLabel: t('tabs.spiritual', 'Spiritual'),
          tabBarIcon: ({ color, size }) => <Flower2 color={color} size={size} /> // You can also use Music icon here if preferred, keeping Flower2 for spiritual
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: t('tabs.profile', 'Profile'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
