import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Donations'>;

const PRESET_AMOUNTS = [101, 501, 1001, 5001];

export const DonationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  
  const [amount, setAmount] = useState('501');

  const handleProceed = () => {
    const numAmount = parseInt(amount) || 0;
    if (numAmount === 0) return;

    navigation.navigate('BookingSummary', {
      title: 'E-Hundi Donation',
      date: new Date().toISOString().split('T')[0],
      slot: 'N/A',
      quantity: 1,
      totalPrice: numAmount
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Donations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroBox}>
          <MaterialCommunityIcons name="hand-heart" size={ms(60)} color={theme.colors.secondary} />
          <Text variant="h3" style={{ marginVertical: vs(12) }}>Donate to {branding?.name}</Text>
          <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center">
            Your generous contributions help us maintain the temple and serve the community.
          </Text>
        </View>

        <Text variant="h3" style={styles.sectionTitle}>Select Amount</Text>
        <View style={styles.presetGrid}>
          {PRESET_AMOUNTS.map((amt) => {
            const isSelected = amount === amt.toString();
            return (
              <TouchableOpacity 
                key={amt}
                onPress={() => setAmount(amt.toString())}
                style={[
                  styles.presetItem, 
                  isSelected ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary } : { borderColor: theme.colors.outline }
                ]}
              >
                <Text variant="h3" color={isSelected ? '#FFF' : theme.colors.primary}>₹{amt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          label="Enter Custom Amount"
          mode="outlined"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor={theme.colors.primary}
          left={<TextInput.Affix text="₹ " />}
        />

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={handleProceed}
          contentStyle={{ height: vs(50) }}
          style={{ width: '100%' }}
        >
          Donate ₹{amount || 0}
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
  heroBox: {
    alignItems: 'center',
    padding: ms(24),
    backgroundColor: theme.colors.surface,
    borderRadius: ms(16),
    marginBottom: vs(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: vs(16),
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: vs(24),
  },
  presetItem: {
    width: '48%',
    paddingVertical: vs(16),
    borderRadius: ms(12),
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: vs(16),
  },
  input: {
    backgroundColor: theme.colors.surface,
    marginBottom: vs(24),
  },
  footer: {
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  }
});
