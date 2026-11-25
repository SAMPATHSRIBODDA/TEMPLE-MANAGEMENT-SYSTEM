import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedAddresses'>;

const ADDRESSES = [
  { id: '1', type: 'Home', address: '123 Main Street, Apt 4B, City, State, 123456' },
  { id: '2', type: 'Office', address: '456 Business Blvd, Floor 9, City, State, 654321' }
];

export const SavedAddressesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Saved Addresses</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {ADDRESSES.map(addr => (
          <View key={addr.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons 
                name={addr.type === 'Home' ? 'home-outline' : 'office-building'} 
                size={ms(24)} 
                color={theme.colors.primary} 
              />
              <Text variant="h3" style={{ marginLeft: ms(8), flex: 1 }}>{addr.type}</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="pencil-outline" size={ms(20)} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
            <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginTop: vs(8) }}>{addr.address}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="contained" buttonColor={theme.colors.primary} contentStyle={{ height: vs(50) }}>
          + Add New Address
        </Button>
      </View>
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
    alignItems: 'center',
  },
  footer: { padding: ms(16), backgroundColor: theme.colors.surface }
});
