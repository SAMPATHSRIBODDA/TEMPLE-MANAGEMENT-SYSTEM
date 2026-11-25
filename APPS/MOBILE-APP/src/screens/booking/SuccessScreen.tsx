import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SuccessScreen'>;

export const SuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { title, bookingId } = route.params;

  const handleGoHome = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <View style={styles.content}>
        
        <View style={styles.successIcon}>
          <MaterialCommunityIcons name="check-circle" size={ms(80)} color="#4CAF50" />
        </View>

        <Text variant="h1" align="center" style={styles.title}>Booking Successful!</Text>
        <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center" style={styles.subtitle}>
          Your {title} has been confirmed.
        </Text>

        <View style={styles.ticketCard}>
          <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center">Booking ID</Text>
          <Text variant="h2" align="center" style={{ marginBottom: vs(24) }}>{bookingId}</Text>
          
          <View style={styles.qrContainer}>
            {/* Generate a mock QR code image using a public API */}
            <Image 
              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}` }} 
              style={styles.qrCode}
            />
          </View>
          
          <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center" style={{ marginTop: vs(16) }}>
            Show this QR code at the entrance.
          </Text>
        </View>

      </View>

      <View style={styles.footer}>
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={handleGoHome}
          contentStyle={{ height: vs(50) }}
          style={{ width: '100%' }}
        >
          Back to Home
        </Button>
      </View>

    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: vs(16),
  },
  title: {
    marginBottom: vs(8),
  },
  subtitle: {
    marginBottom: vs(32),
  },
  ticketCard: {
    backgroundColor: theme.colors.surface,
    width: '100%',
    padding: ms(24),
    borderRadius: ms(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  qrCode: {
    width: ms(150),
    height: ms(150),
  },
  footer: {
    padding: ms(24),
  }
});
