import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useAppTheme } from '../../contexts/ThemeContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { isDarkMode, setTheme } = useAppTheme();
  const { isOffline, setOfflineMode } = useNetwork();
  const { t } = useTranslation();
  
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>{t('settings.title', 'Settings')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.card}>
          <Text variant="h3" style={styles.sectionTitle}>{t('settings.preferences', 'Preferences')}</Text>

          <TouchableOpacity 
            style={[styles.row, { marginBottom: vs(16) }]}
            onPress={() => navigation.navigate('Language')}
          >
            <View style={{ flex: 1 }}>
              <Text variant="body1">{t('settings.language', 'Language')}</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>{t('settings.language_desc', 'Change application language')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={ms(24)} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
          
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.colors.outline, paddingTop: vs(16) }]}>
            <View style={{ flex: 1 }}>
              <Text variant="body1">{t('settings.push', 'Push Notifications')}</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>{t('settings.push_desc', 'Receive alerts for bookings and festivals')}</Text>
            </View>
            <Switch 
              value={pushEnabled} 
              onValueChange={setPushEnabled} 
              trackColor={{ true: theme.colors.primary, false: '#CCC' }}
            />
          </View>
          
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.colors.outline, marginTop: vs(16), paddingTop: vs(16) }]}>
            <View style={{ flex: 1 }}>
              <Text variant="body1">{t('settings.dark_theme', 'Dark Theme')}</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>{t('settings.theme_desc', 'Toggle application theme')}</Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={setTheme} 
              trackColor={{ true: theme.colors.primary, false: '#CCC' }}
            />
          </View>

          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.colors.outline, marginTop: vs(16), paddingTop: vs(16) }]}>
            <View style={{ flex: 1 }}>
              <Text variant="body1">{t('settings.offline', 'Simulate Offline Mode')}</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>{t('settings.offline_desc', 'Test the global offline banner')}</Text>
            </View>
            <Switch 
              value={isOffline} 
              onValueChange={setOfflineMode} 
              trackColor={{ true: theme.colors.error, false: '#CCC' }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text variant="h3" style={styles.sectionTitle}>{t('settings.about', 'About')}</Text>
          <TouchableOpacity style={styles.linkRow}>
            <Text variant="body1">{t('settings.privacy', 'Privacy Policy')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={ms(24)} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text variant="body1">{t('settings.terms', 'Terms of Service')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={ms(24)} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkRow, { borderBottomWidth: 0 }]}>
            <Text variant="body1">{t('settings.version', 'App Version')}</Text>
            <Text variant="body2" color="#999">1.0.0</Text>
          </TouchableOpacity>
        </View>

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
    padding: ms(16),
    borderRadius: ms(12),
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: vs(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  }
});
