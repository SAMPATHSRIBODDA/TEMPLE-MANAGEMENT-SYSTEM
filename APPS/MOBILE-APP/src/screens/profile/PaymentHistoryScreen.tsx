import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

const PAYMENTS = [
  { id: 'TXN-001', title: 'Special Darshan', date: 'March 10, 2026', amount: 200, status: 'Success' },
  { id: 'TXN-002', title: 'E-Hundi Donation', date: 'February 28, 2026', amount: 1001, status: 'Success' },
  { id: 'TXN-003', title: 'Laddu Order', date: 'January 15, 2026', amount: 100, status: 'Refunded' },
];

export const PaymentHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Payment History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {PAYMENTS.map(payment => (
          <View key={payment.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text variant="h3">{payment.title}</Text>
              <Text variant="h3" color={theme.colors.primary}>₹{payment.amount}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>{payment.date} • {payment.id}</Text>
              <Text 
                variant="body2" 
                style={{ fontWeight: 'bold' }} 
                color={payment.status === 'Success' ? '#4CAF50' : '#FF9800'}
              >
                {payment.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  },
  backButton: { marginRight: ms(16) },
  content: { padding: ms(16) },
  card: {
    backgroundColor: theme.colors.surface,
    padding: ms(16),
    borderRadius: ms(12),
    marginBottom: vs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
