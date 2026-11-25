import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Coming Soon)' },
];

export const LanguageScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    if (lng === 'ta') return; // Mock disable for un-supported
    i18n.changeLanguage(lng);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text variant="h2" style={{ fontWeight: 'bold' }}>{t('settings.language', 'Language')}</Text>
        <View style={{ width: ms(40) }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <TouchableOpacity 
              key={lang.code}
              style={[
                styles.languageCard, 
                { backgroundColor: theme.colors.surface },
                isActive && { borderColor: theme.colors.primary, borderWidth: 2 }
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <View style={styles.textContainer}>
                <Text variant="h3" style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{lang.nativeName}</Text>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>{lang.name}</Text>
              </View>
              {isActive && (
                <MaterialCommunityIcons name="check-circle" size={ms(24)} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: vs(16),
  },
  backBtn: {
    padding: ms(8),
    marginLeft: ms(-8),
  },
  content: {
    padding: ms(20),
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ms(20),
    borderRadius: ms(16),
    marginBottom: vs(16),
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  }
});
