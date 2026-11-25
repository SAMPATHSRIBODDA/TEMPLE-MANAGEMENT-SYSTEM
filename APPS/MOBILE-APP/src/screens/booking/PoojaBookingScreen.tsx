import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PoojaBooking'>;

// Removed hardcoded POOJAS array

export const PoojaBookingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [poojas, setPoojas] = useState<any[]>([]);
  const [selectedPooja, setSelectedPooja] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('http://10.0.2.2:5000/api/v1/poojas')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const activePoojas = data.data.filter((p: any) => p.status !== 'inactive');
          setPoojas(activePoojas);
          setSelectedPooja(activePoojas[0]);
        }
      })
      .catch(err => console.error('Error fetching poojas:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleProceed = () => {
    if (!selectedPooja) return;
    navigation.navigate('BookingSummary', {
      title: selectedPooja.name,
      date: new Date().toISOString().split('T')[0],
      slot: selectedPooja.isMonthly 
        ? `${selectedPooja.startDate ? new Date(selectedPooja.startDate).toLocaleDateString() : '?'} - ${selectedPooja.endDate ? new Date(selectedPooja.endDate).toLocaleDateString() : '?'}` 
        : 'Morning',
      quantity: 1,
      totalPrice: selectedPooja.price,
      isMonthly: selectedPooja.isMonthly,
      startDate: selectedPooja.startDate,
      endDate: selectedPooja.endDate
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Pooja Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text variant="h3" style={styles.sectionTitle}>Select a Pooja</Text>
        
        {loading ? (
          <Text variant="body1">Loading Poojas...</Text>
        ) : poojas.length === 0 ? (
          <Text variant="body1">No Poojas available right now.</Text>
        ) : (
          poojas.map((pooja) => {
            const isSelected = selectedPooja?._id === pooja._id;
            return (
              <TouchableOpacity 
                key={pooja._id}
                onPress={() => setSelectedPooja(pooja)}
                style={[
                  styles.poojaCard,
                  isSelected ? { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' } : { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text variant="h3" color={isSelected ? theme.colors.primary : '#333'}>{pooja.name}</Text>
                  <Text variant="h3" color={theme.colors.secondary}>₹{pooja.price}</Text>
                </View>
                {pooja.description ? (
                  <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginTop: vs(8) }}>{pooja.description}</Text>
                ) : null}
                {pooja.isMonthly && (
                  <Text variant="body2" color={theme.colors.primary} style={{ marginTop: vs(4), fontWeight: 'bold' }}>
                    Monthly Subscription ({pooja.startDate ? new Date(pooja.startDate).toLocaleDateString() : '?'} - {pooja.endDate ? new Date(pooja.endDate).toLocaleDateString() : '?'})
                  </Text>
                )}
              </TouchableOpacity>
            );
          })
        )}

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text variant="body2" color={theme.colors.onSurfaceVariant}>Total Amount</Text>
          <Text variant="h2" color={theme.colors.primary}>₹{selectedPooja?.price || 0}</Text>
        </View>
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={handleProceed}
          contentStyle={{ height: vs(45), paddingHorizontal: ms(24) }}
        >
          Book Now
        </Button>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  backButton: {
    marginRight: ms(16),
  },
  scrollContent: {
    padding: ms(16),
    paddingBottom: vs(40),
  },
  sectionTitle: {
    marginBottom: vs(16),
  },
  poojaCard: {
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 2,
    marginBottom: vs(16),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  }
});
