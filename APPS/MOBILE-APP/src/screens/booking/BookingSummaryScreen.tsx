import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingSummary'>;

export const BookingSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const { title, date, slot, quantity, totalPrice, isMonthly, durationDays } = route.params as any;

  const handlePay = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate Razorpay Gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call backend API
      const res = await fetch('http://10.0.2.2:5000/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'UPI',
          totalAmount: totalPrice,
          items: [{
            type: 'Ticket',
            name: title,
            price: totalPrice / quantity,
            quantity: quantity
          }]
        })
      });
      
      const result = await res.json();
      setIsProcessing(false);
      
      if (result.success) {
        navigation.navigate('SuccessScreen', {
          title,
          date,
          slot,
          quantity,
          bookingId: result.data.receiptNumber
        });
      } else {
        alert('Payment failed: ' + result.error);
      }
    } catch (err) {
      setIsProcessing(false);
      alert('Network error during checkout');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Booking Summary</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.invoiceCard}>
          <Text variant="h3" style={{ marginBottom: vs(16) }}>Invoice Details</Text>
          
          <View style={styles.row}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Service</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }}>{title}</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.row}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Date</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }}>{date}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Slot</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }}>{slot}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Quantity/Persons</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }}>{quantity}</Text>
          </View>
          
        </View>

        <View style={[styles.invoiceCard, { backgroundColor: theme.colors.secondary + '10' }]}>
          <View style={styles.row}>
            <Text variant="body1" style={{ fontWeight: 'bold' }} color={theme.colors.secondary}>Total Payable</Text>
            <Text variant="h2" color={theme.colors.secondary}>₹{totalPrice}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={handlePay}
          disabled={isProcessing}
          contentStyle={{ height: vs(50) }}
          style={{ width: '100%' }}
        >
          {isProcessing ? 'Processing Payment...' : 'Pay with Razorpay'}
        </Button>
      </View>

      {/* Razorpay Loading Overlay Mock */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="h3" style={{ marginTop: vs(16) }}>Razorpay</Text>
            <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginTop: vs(8) }}>Processing your secure payment...</Text>
          </View>
        </View>
      )}
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
  invoiceCard: {
    backgroundColor: theme.colors.surface,
    padding: ms(16),
    borderRadius: ms(12),
    marginBottom: vs(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: vs(12),
    backgroundColor: theme.colors.surfaceVariant,
  },
  footer: {
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    width: '80%',
  }
});
