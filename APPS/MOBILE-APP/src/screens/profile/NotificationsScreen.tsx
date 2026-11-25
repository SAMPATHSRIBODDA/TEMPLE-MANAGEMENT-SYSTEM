import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const NOTIFICATIONS = [
  { id: '1', title: 'Upcoming Darshan', body: 'Your special darshan is scheduled for tomorrow at 08:00 AM. Please arrive 30 mins early.', time: '2 hours ago', icon: 'eye-outline' },
  { id: '2', title: 'Payment Successful', body: 'Your donation of ₹1001 was received successfully. Thank you!', time: '1 day ago', icon: 'check-circle-outline' },
  { id: '3', title: 'Maha Shivaratri', body: 'Join us for the special festivities starting this week.', time: '3 days ago', icon: 'party-popper' },
];

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {NOTIFICATIONS.map(notif => (
          <View key={notif.id} style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
              <MaterialCommunityIcons name={notif.icon as any} size={ms(24)} color={theme.colors.primary} />
            </View>
            <View style={styles.info}>
              <Text variant="body1" style={{ fontWeight: 'bold' }}>{notif.title}</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginVertical: vs(4) }}>{notif.body}</Text>
              <Text variant="body2" color="#999" style={{ fontSize: ms(10) }}>{notif.time}</Text>
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
    flexDirection: 'row',
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
  iconBox: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(16),
  },
  info: { flex: 1 }
});
