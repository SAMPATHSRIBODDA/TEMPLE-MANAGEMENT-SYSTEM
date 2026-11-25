import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetails'>;

export const BookingDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { booking } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Booking Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.qrCard}>
          <Text variant="h3" align="center" style={{ marginBottom: vs(16) }}>{booking.type}</Text>
          <View style={styles.qrWrapper}>
            <Image 
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.id}` }} 
              style={styles.qrCode}
            />
          </View>
          <Text variant="h2" align="center" style={{ marginTop: vs(16) }}>{booking.id}</Text>
          <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center">Scan at the entrance</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text variant="h3" style={{ marginBottom: vs(16) }}>Details</Text>
          
          <View style={styles.row}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Status</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }} color={booking.status === 'Upcoming' ? theme.colors.primary : '#333'}>{booking.status}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Date</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }}>{booking.date}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Time</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }}>{booking.time}</Text>
          </View>
          {booking.persons > 0 && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.row}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Persons</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{booking.persons}</Text>
              </View>
            </>
          )}
        </View>

      </ScrollView>

      {booking.status === 'Upcoming' && (
        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            textColor="#F44336"
            style={{ borderColor: '#F44336', flex: 1, marginRight: ms(8) }}
            onPress={() => alert('Cancel Booking logic')}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            buttonColor={theme.colors.primary}
            style={{ flex: 1, marginLeft: ms(8) }}
            onPress={() => alert('Download Ticket')}
          >
            Download
          </Button>
        </View>
      )}

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
  qrCard: {
    backgroundColor: theme.colors.surface,
    padding: ms(24),
    borderRadius: ms(16),
    alignItems: 'center',
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  qrWrapper: {
    padding: ms(16),
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    borderRadius: ms(12),
  },
  qrCode: {
    width: ms(200),
    height: ms(200),
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    padding: ms(16),
    borderRadius: ms(16),
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
    flexDirection: 'row',
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  }
});
