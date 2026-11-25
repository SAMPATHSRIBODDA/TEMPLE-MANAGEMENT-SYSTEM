import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { DarshanBookingScreen } from '../screens/booking/DarshanBookingScreen';
import { EntryTicketScreen } from '../screens/booking/EntryTicketScreen';
import { LadduOrderScreen } from '../screens/booking/LadduOrderScreen';
import { PoojaBookingScreen } from '../screens/booking/PoojaBookingScreen';
import { DonationScreen } from '../screens/booking/DonationScreen';
import { BookingSummaryScreen } from '../screens/booking/BookingSummaryScreen';
import { SuccessScreen } from '../screens/booking/SuccessScreen';
import { BookingDetailsScreen } from '../screens/booking/BookingDetailsScreen';
import { GenericSectionBookingScreen } from '../screens/booking/GenericSectionBookingScreen';
import { FamilyMembersScreen } from '../screens/profile/FamilyMembersScreen';
import { SavedAddressesScreen } from '../screens/profile/SavedAddressesScreen';
import { PaymentHistoryScreen } from '../screens/profile/PaymentHistoryScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { TempleInfoScreen } from '../screens/TempleInfoScreen';
import { AudioDetailsScreen } from '../screens/spiritual/AudioDetailsScreen';
import { LanguageScreen } from '../screens/profile/LanguageScreen';
import { LiveStreamsListScreen } from '../screens/live/LiveStreamsListScreen';
import { LiveStreamDetailsScreen } from '../screens/live/LiveStreamDetailsScreen';
import { EPassWalletScreen } from '../screens/tickets/EPassWalletScreen';
import { TicketDetailsScreen } from '../screens/tickets/TicketDetailsScreen';
import { ScannerScreen } from '../screens/tickets/ScannerScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  DarshanBooking: undefined;
  EntryTickets: undefined;
  LadduOrder: undefined;
  PoojaBooking: undefined;
  Donations: undefined;
  BookingSummary: {
    title: string;
    date: string;
    slot: string;
    quantity: number;
    totalPrice: number;
  };
  SuccessScreen: {
    title: string;
    date?: string;
    slot?: string;
    quantity?: number;
    bookingId: string;
  };
  BookingDetails: { booking: any };
  FamilyMembers: undefined;
  SavedAddresses: undefined;
  PaymentHistory: undefined;
  Notifications: undefined;
  Settings: undefined;
  TempleInfo: undefined;
  ScanQR: undefined;
  AudioDetails: { playlist: any };
  LiveStreamsList: undefined;
  LiveStreamDetails: { stream: any };
  Language: undefined;
  EPassWallet: undefined;
  TicketDetails: { ticket: any };
  Scanner: undefined;
  GenericSectionBooking: { sectionName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="DarshanBooking" component={DarshanBookingScreen} />
      <Stack.Screen name="EntryTickets" component={EntryTicketScreen} />
      <Stack.Screen name="LadduOrder" component={LadduOrderScreen} />
      <Stack.Screen name="PoojaBooking" component={PoojaBookingScreen} />
      <Stack.Screen name="Donations" component={DonationScreen} />
      <Stack.Screen name="GenericSectionBooking" component={GenericSectionBookingScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="FamilyMembers" component={FamilyMembersScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TempleInfo" component={TempleInfoScreen} />
      <Stack.Screen name="AudioDetails" component={AudioDetailsScreen} />
      <Stack.Screen name="LiveStreamsList" component={LiveStreamsListScreen} />
      <Stack.Screen name="LiveStreamDetails" component={LiveStreamDetailsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="EPassWallet" component={EPassWalletScreen} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
};
