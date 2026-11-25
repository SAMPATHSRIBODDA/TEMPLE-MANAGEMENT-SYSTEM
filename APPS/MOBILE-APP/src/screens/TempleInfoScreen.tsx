import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../components/Text';
import { ms, vs } from '../utils/responsive';
import { useBranding } from '../branding/brandingContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'TempleInfo'>;

export const TempleInfoScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  const [templeData, setTempleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:5000/api/v1/temple/core-data')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTempleData(data.data);
        }
      })
      .catch(err => console.error('Error fetching temple info:', err))
      .finally(() => setLoading(false));
  }, []);

  if (!branding && !templeData) return <View style={styles.container}><ActivityIndicator style={{marginTop: 50}} /></View>;

  const handleOpenLink = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const name = templeData?.name || branding?.name || 'Temple Information';
  const logoUrl = templeData?.profileImage || branding?.logo;
  const description = templeData?.taxId ? `Tax ID: ${templeData.taxId}` : branding?.description || 'Historic and spiritually significant temple.';
  
  const phone = templeData?.phone || branding?.contact?.phone || 'Not Available';
  const email = templeData?.email || branding?.contact?.email || 'Not Available';
  const address = templeData?.address || branding?.contact?.address || 'Not Available';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Temple Information</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{marginTop: 50}} size="large" color={theme.colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Banner */}
          {(templeData?.profileImage || branding?.homeBanner) && (
            <Image source={{ uri: templeData?.profileImage || branding?.homeBanner }} style={styles.banner} />
          )}

          <View style={styles.infoCard}>
            <View style={styles.logoRow}>
              {logoUrl ? (
                <Image source={{ uri: logoUrl }} style={styles.logo} />
              ) : (
                <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]} />
              )}
              <View style={{ flex: 1, marginLeft: ms(16) }}>
                <Text variant="h2" color={theme.colors.primary}>{name}</Text>
              </View>
            </View>
            
            <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginTop: vs(16), lineHeight: vs(22) }}>
              {description}
            </Text>
          </View>

          <Text variant="h3" style={styles.sectionTitle}>Contact Details</Text>
          
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink(`tel:${phone}`)}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                <MaterialCommunityIcons name="phone" size={ms(20)} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Phone</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{phone}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.contactRow} onPress={() => handleOpenLink(`mailto:${email}`)}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.secondary + '15' }]}>
                <MaterialCommunityIcons name="email-outline" size={ms(20)} color={theme.colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Email</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{email}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.contactRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '15' }]}>
                <MaterialCommunityIcons name="map-marker-outline" size={ms(20)} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Address</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{address}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {branding?.social?.website && (
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => handleOpenLink(branding.social?.website)}
            >
              <MaterialCommunityIcons name="web" size={ms(24)} color={theme.colors.primary} />
              <Text variant="body1" style={{ marginLeft: ms(12), fontWeight: 'bold' }}>Visit Official Website</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
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
  content: { padding: ms(16), paddingBottom: vs(40) },
  banner: {
    width: '100%',
    height: vs(180),
    borderRadius: ms(16),
    marginBottom: vs(16),
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    padding: ms(20),
    borderRadius: ms(16),
    marginBottom: vs(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
  },
  logoPlaceholder: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
  },
  sectionTitle: {
    marginBottom: vs(12),
  },
  contactCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: vs(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  iconBox: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(16),
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginVertical: vs(8),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: theme.colors.outline,
  }
});
