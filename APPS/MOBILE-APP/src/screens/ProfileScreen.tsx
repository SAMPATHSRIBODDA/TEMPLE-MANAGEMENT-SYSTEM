import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../components/Text';
import { ms, vs } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/RootNavigator';

export const ProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { logout } = useAuth();

  const MENU_ITEMS = [
    { title: 'My Family Members', icon: 'account-group-outline', route: 'FamilyMembers' },
    { title: 'Saved Addresses', icon: 'map-marker-outline', route: 'SavedAddresses' },
    { title: 'Payment History', icon: 'history', route: 'PaymentHistory' },
    { title: 'Notifications', icon: 'bell-outline', route: 'Notifications' },
    { title: 'Settings', icon: 'cog-outline', route: 'Settings' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Avatar.Icon size={ms(80)} icon="account" color="#FFF" style={{ backgroundColor: theme.colors.primary }} />
          <Text variant="h2" style={{ marginTop: vs(12) }}>John Doe</Text>
          <Text variant="body2" color={theme.colors.onSurfaceVariant}>+91 9876543210</Text>
        </View>

        {/* ADMIN TOOLS */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, marginTop: vs(16) }]}>
          <Text variant="h3" style={styles.sectionTitle}>Staff Tools</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Scanner' as never)}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '20' }]}>
              <MaterialCommunityIcons name="qrcode-scan" size={ms(24)} color={theme.colors.primary} />
            </View>
            <Text variant="body1" style={styles.menuTitle}>QR Scanner</Text>
            <MaterialCommunityIcons name="chevron-right" size={ms(24)} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={ms(24)} color={theme.colors.primary} />
              </View>
              <Text variant="body1" style={styles.menuTitle}>{item.title}</Text>
              <MaterialCommunityIcons name="chevron-right" size={ms(24)} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => logout()}
        >
          <MaterialCommunityIcons name="logout" size={ms(24)} color="#F44336" />
          <Text variant="body1" color="#F44336" style={{ marginLeft: ms(12), fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: ms(16),
    paddingBottom: vs(40),
  },
  header: {
    alignItems: 'center',
    paddingVertical: vs(24),
    backgroundColor: theme.colors.surface,
    borderRadius: ms(16),
    marginBottom: vs(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: ms(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: vs(24),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  iconBox: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(16),
  },
  menuTitle: {
    flex: 1,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(16),
    backgroundColor: '#FFEBEE',
    borderRadius: ms(12),
  }
});
