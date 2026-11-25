import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LadduOrder'>;

export const LadduOrderScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [ladduTypes, setLadduTypes] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  React.useEffect(() => {
    fetch('http://10.0.2.2:5000/api/v1/ticket-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const tickets = data.data.filter((t:any) => t.sectionName === 'Laddu Sales' && t.isActive);
          setLadduTypes(tickets);
          const initQty: Record<string, number> = {};
          tickets.forEach((t:any) => initQty[t.id || t._id] = 0);
          setQuantities(initQty);
        }
      })
      .catch(console.error);
  }, []);

  const totalAmount = ladduTypes.reduce((acc, t) => {
    const qty = quantities[t.id || t._id] || 0;
    return acc + (qty * t.price);
  }, 0);
  
  const totalQuantity = ladduTypes.reduce((acc, t) => acc + (quantities[t.id || t._id] || 0), 0);

  const handleProceed = () => {
    if (totalAmount === 0) return;
    navigation.navigate('BookingSummary', {
      title: 'Laddu Prasad',
      date: new Date().toISOString().split('T')[0], // Today's date
      slot: 'N/A',
      quantity: totalQuantity,
      totalPrice: totalAmount
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(50, (prev[id] || 0) + delta))
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Order Laddu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {ladduTypes.map((laddu, index) => {
          const id = laddu.id || laddu._id;
          const qty = quantities[id] || 0;
          return (
            <View key={id} style={styles.itemCard}>
              <View style={[styles.iconContainer, { backgroundColor: index % 2 === 0 ? theme.colors.secondary + '20' : theme.colors.primary + '20' }]}>
                <MaterialCommunityIcons name={index % 2 === 0 ? "food-apple-outline" : "food-apple"} size={ms(32)} color={index % 2 === 0 ? theme.colors.secondary : theme.colors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text variant="h3">{laddu.name}</Text>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>₹{laddu.price} / piece</Text>
              </View>
              <View style={styles.stepper}>
                <IconButton 
                  icon="minus" size={ms(20)} iconColor={theme.colors.primary} mode="outlined"
                  onPress={() => updateQuantity(id, -1)} 
                />
                <Text variant="h3" style={{ marginHorizontal: ms(8) }}>{qty}</Text>
                <IconButton 
                  icon="plus" size={ms(20)} iconColor={theme.colors.primary} mode="contained" containerColor={theme.colors.primary + '20'}
                  onPress={() => updateQuantity(id, 1)} 
                />
              </View>
            </View>
          );
        })}

        <View style={[styles.infoBox, { backgroundColor: theme.colors.secondary + '10', borderColor: theme.colors.secondary }]}>
          <MaterialCommunityIcons name="information-outline" size={ms(20)} color={theme.colors.secondary} />
          <Text variant="body2" style={styles.infoText}>
            Laddus ordered online must be collected from the Prasad counter within 24 hours.
          </Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text variant="body2" color={theme.colors.onSurfaceVariant}>Total Amount</Text>
          <Text variant="h2" color={theme.colors.primary}>₹{totalAmount}</Text>
        </View>
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={handleProceed}
          disabled={totalAmount === 0}
          contentStyle={{ height: vs(45), paddingHorizontal: ms(24) }}
        >
          Proceed
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    backgroundColor: theme.colors.surface,
    borderRadius: ms(12),
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(16),
  },
  itemInfo: {
    flex: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    padding: ms(12),
    borderRadius: ms(8),
    borderWidth: 1,
    marginTop: vs(16),
  },
  infoText: {
    flex: 1,
    marginLeft: ms(8),
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
