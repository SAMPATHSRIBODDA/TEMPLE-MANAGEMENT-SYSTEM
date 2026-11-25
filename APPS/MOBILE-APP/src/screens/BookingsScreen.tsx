import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../components/Text';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ms, vs } from '../utils/responsive';
import { useBranding } from '../branding/brandingContext';
import { RootStackParamList } from '../navigation/RootNavigator';

// Mock Data
const MOCK_BOOKINGS = [
  { id: 'BK-100234', type: 'Special Darshan', date: 'March 15, 2026', time: '08:00 AM', status: 'Upcoming', persons: 2 },
  { id: 'BK-100211', type: 'Abhishekam Pooja', date: 'March 18, 2026', time: '06:00 AM', status: 'Upcoming', persons: 1 },
  { id: 'BK-098765', type: 'Laddu Order', date: 'February 20, 2026', time: 'N/A', status: 'Completed', persons: 0 },
  { id: 'BK-091122', type: 'General Entry', date: 'January 10, 2026', time: '10:00 AM', status: 'Cancelled', persons: 4 },
];

export const BookingsScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Initial load
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleTabChange = (tab: 'Upcoming' | 'Completed' | 'Cancelled') => {
    setActiveTab(tab);
    setLoading(true);
    setTimeout(() => setLoading(false), 600); // Shimmer when switching tabs for premium feel
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredBookings = MOCK_BOOKINGS.filter(b => b.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return theme.colors.primary;
      case 'Completed': return '#4CAF50';
      case 'Cancelled': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.primary}>My Bookings</Text>
      </View>

      {/* Segmented Control */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        {(['Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, isActive && { backgroundColor: theme.colors.surface, shadowColor: '#000', elevation: 2 }]}
              onPress={() => handleTabChange(tab)}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab} Bookings`}
            >
              <Text variant="body2" style={{ fontWeight: isActive ? 'bold' : 'normal' }} color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.colors.primary} 
            colors={[theme.colors.primary]}
          />
        }
      >
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Skeleton width="50%" height={vs(20)} />
                  <Skeleton width={ms(60)} height={vs(20)} borderRadius={ms(4)} />
                </View>
                <View style={styles.cardBody}>
                  <Skeleton width="40%" height={vs(16)} style={{ marginBottom: vs(8) }} />
                  <Skeleton width="30%" height={vs(16)} />
                </View>
                <View style={styles.cardFooter}>
                  <Skeleton width="30%" height={vs(16)} />
                  <Skeleton width="25%" height={vs(16)} />
                </View>
              </View>
            ))}
          </>
        ) : filteredBookings.length === 0 ? (
          <EmptyState 
            icon="ticket-outline" 
            title={`No ${activeTab.toLowerCase()} bookings`}
            subtitle="You don't have any bookings in this category right now."
            actionLabel={activeTab === 'Upcoming' ? "Book Now" : undefined}
            onAction={activeTab === 'Upcoming' ? () => navigation.navigate('DarshanBooking') : undefined}
            style={{ marginTop: vs(60) }}
          />
        ) : (
          filteredBookings.map((booking) => (
            <TouchableOpacity 
              key={booking.id} 
              style={styles.card}
              onPress={() => navigation.navigate('BookingDetails', { booking })}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${booking.type} on ${booking.date}`}
            >
              <View style={styles.cardHeader}>
                <Text variant="h3">{booking.type}</Text>
                <View style={[styles.badge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                  <Text variant="body2" color={getStatusColor(booking.status)} style={{ fontWeight: 'bold' }}>
                    {booking.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={ms(16)} color={theme.colors.onSurfaceVariant} />
                  <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginLeft: ms(6) }}>{booking.date}</Text>
                </View>
                {booking.time !== 'N/A' && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="clock-outline" size={ms(16)} color={theme.colors.onSurfaceVariant} />
                    <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginLeft: ms(6) }}>{booking.time}</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>ID: {booking.id}</Text>
                <Text variant="body2" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>View Details -></Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: ms(16),
    padding: ms(4),
    borderRadius: ms(8),
  },
  tabBtn: {
    flex: 1,
    paddingVertical: vs(8),
    alignItems: 'center',
    borderRadius: ms(6),
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingBottom: vs(40),
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  badge: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(4),
  },
  cardBody: {
    marginBottom: vs(12),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    paddingTop: vs(12),
  }
});
