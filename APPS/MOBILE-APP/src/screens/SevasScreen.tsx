import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../components/Text';
import { Skeleton } from '../components/Skeleton';
import { ms, vs } from '../utils/responsive';
import { useBranding } from '../branding/brandingContext';
import { RootStackParamList } from '../navigation/RootNavigator';

const MOCK_SEVAS = [
  { id: '1', title: 'Kalyanam', description: 'Sacred marriage ceremony of the deities.', price: '₹ 1000', duration: '2 Hours' },
  { id: '2', title: 'Suprabhata Seva', description: 'Early morning awakening ritual.', price: '₹ 250', duration: '30 Mins' },
  { id: '3', title: 'Abhishekam', description: 'Holy bath offered to the main deity.', price: '₹ 500', duration: '1 Hour' },
  { id: '4', title: 'Sahasranamarchana', description: 'Chanting of 1000 holy names.', price: '₹ 200', duration: '45 Mins' },
  { id: '5', title: 'Vastralankarana', description: 'Offering of new vastram (clothes) to the deity.', price: '₹ 2000', duration: 'N/A' },
];

export const SevasScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Initial load simulation
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="h2" color={theme.colors.primary}>Temple Sevas</Text>
        <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginTop: vs(4) }}>
          Book sacred rituals at {branding?.name || 'the temple'}
        </Text>
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
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Skeleton width="60%" height={vs(24)} />
                  <Skeleton width="20%" height={vs(24)} borderRadius={ms(4)} />
                </View>
                <Skeleton width="100%" height={vs(16)} style={{ marginBottom: vs(8) }} />
                <Skeleton width="80%" height={vs(16)} style={{ marginBottom: vs(16) }} />
                <View style={styles.cardFooter}>
                  <Skeleton width="30%" height={vs(20)} />
                  <Skeleton width="40%" height={vs(36)} borderRadius={ms(18)} />
                </View>
              </View>
            ))}
          </>
        ) : (
          MOCK_SEVAS.map((seva) => (
            <View key={seva.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text variant="h3" style={{ flex: 1, marginRight: ms(16) }}>{seva.title}</Text>
                <Text variant="h3" color={theme.colors.primary}>{seva.price}</Text>
              </View>
              
              <Text variant="body2" color={theme.colors.onSurfaceVariant} style={styles.description}>
                {seva.description}
              </Text>
              
              <View style={styles.cardFooter}>
                <View style={styles.durationRow}>
                  <MaterialCommunityIcons name="clock-outline" size={ms(16)} color={theme.colors.onSurfaceVariant} />
                  <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginLeft: ms(6) }}>
                    {seva.duration}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[styles.bookBtn, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('PoojaBooking')}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Book ${seva.title}`}
                >
                  <Text variant="body1" color="#FFF" style={{ fontWeight: 'bold' }}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: vs(16),
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
    alignItems: 'flex-start',
    marginBottom: vs(8),
  },
  description: {
    marginBottom: vs(16),
    lineHeight: vs(20),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    paddingTop: vs(16),
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookBtn: {
    paddingHorizontal: ms(20),
    paddingVertical: vs(8),
    borderRadius: ms(20),
  }
});
