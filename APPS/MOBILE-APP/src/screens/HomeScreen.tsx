import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../components/Text';
import { Skeleton } from '../components/Skeleton';
import { useBranding } from '../branding/brandingContext';
import { ms, vs } from '../utils/responsive';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MOCK_LIVE_STREAMS } from '../data/live/mockLiveData';
import { useTranslation } from 'react-i18next';

// Mock Data
const ANNOUNCEMENTS = [
  "Special Darshan tickets for next month are now available."
];

const RECENT_BOOKINGS = [
  { id: '101', type: 'Special Darshan', date: 'Today, 4:00 PM', status: 'Upcoming' }
];

export const HomeScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // State for fetched temple core data
  const [templeData, setTempleData] = useState<any>(null);
  const [dynamicSections, setDynamicSections] = useState<string[]>([]);

  // Calculate Contextual Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('home.greeting_morning', 'Good Morning') : hour < 18 ? t('home.greeting_afternoon', 'Good Afternoon') : t('home.greeting_evening', 'Good Evening');

  const fetchTempleData = async () => {
    try {
      // Use 10.0.2.2 for Android Emulator to access localhost
      const res = await fetch('http://10.0.2.2:5000/api/v1/temple/core-data');
      const data = await res.json();
      if (data.success && data.data) {
        setTempleData(data.data);
      }
    } catch (e) {
      console.warn('Could not fetch temple core data', e);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch('http://10.0.2.2:5000/api/v1/ticket-categories');
      const result = await res.json();
      if (result.success && result.data) {
        const sections = Array.from(new Set(result.data.map((t:any) => t.sectionName)));
        setDynamicSections(sections as string[]);
      }
    } catch(e) {
      console.warn('Could not fetch dynamic sections', e);
    }
  };

  useEffect(() => {
    fetchTempleData();
    fetchSections();
    setTimeout(() => setLoading(false), 1200);

    // Live Indicator Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTempleData();
    fetchSections();
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Filter custom sections out of hardcoded ones to avoid duplicates
  const hardcodedSections = ['Darshan', 'Entry Tickets', 'Laddu Sales', 'Pooja', 'Donate'];
  const customSections = dynamicSections.filter(sec => !hardcodedSections.includes(sec));

  const DYNAMIC_ACTIONS = customSections.map(sec => ({
    id: sec,
    title: sec.substring(0, 10) + (sec.length > 10 ? '..' : ''),
    image: require('../../assets/icons/tickets.png'), // generic icon
    route: 'GenericSectionBooking' as const,
    params: { sectionName: sec }
  }));

  const QUICK_ACTIONS = [
    { id: 'darshan', title: t('home.quick_actions.darshan', 'Darshan'), image: require('../../assets/icons/darshan.png'), route: 'DarshanBooking' as const },
    { id: 'tickets', title: t('home.quick_actions.tickets', 'Tickets'), image: require('../../assets/icons/tickets.png'), route: 'EPassWallet' as const },
    { id: 'laddu', title: t('home.quick_actions.prasadam', 'Prasadam'), image: require('../../assets/icons/prasadam.png'), route: 'LadduOrder' as const },
    { id: 'pooja', title: t('home.quick_actions.pooja', 'Pooja'), image: require('../../assets/icons/pooja.png'), route: 'PoojaBooking' as const },
    { id: 'donate', title: t('home.quick_actions.donate', 'Donate'), image: require('../../assets/icons/donate.png'), route: 'Donations' as const },
    ...DYNAMIC_ACTIONS
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        
        {/* Top Header Controls (Absolute/Overlay Style handling) */}
        <SafeAreaView edges={['top']} style={styles.topSafeArea}>
          <View style={styles.topNav}>
            <View>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>{greeting}, {t('home.devotee', 'Devotee')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.iconBtn} accessible={true} accessibilityRole="button" accessibilityLabel="Notifications">
                <MaterialCommunityIcons name="bell-outline" size={ms(24)} color={theme.colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')} accessible={true} accessibilityRole="button">
                <Avatar.Icon size={ms(32)} icon="account" style={{ backgroundColor: theme.colors.surfaceVariant }} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* --- LOADING SKELETONS --- */}
        {loading ? (
          <View style={{ paddingHorizontal: ms(20) }}>
            <Skeleton height={vs(180)} borderRadius={ms(24)} style={{ marginBottom: vs(24) }} />
            <Skeleton width="40%" height={vs(20)} style={{ marginBottom: vs(16) }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(32) }}>
              {[1,2,3,4].map(i => (
                <View key={i} style={{ alignItems: 'center' }}>
                  <Skeleton width={ms(60)} height={ms(60)} borderRadius={ms(30)} style={{ marginBottom: vs(8) }} />
                  <Skeleton width={ms(40)} height={vs(12)} />
                </View>
              ))}
            </View>
            <Skeleton height={vs(100)} borderRadius={ms(16)} style={{ marginBottom: vs(24) }} />
          </View>
        ) : (
          /* --- REAL CONTENT --- */
          <View style={styles.contentPadding}>
            
            {/* Fused Hero Banner */}
            <TouchableOpacity 
              style={styles.heroContainer} 
              onPress={() => navigation.navigate('TempleInfo')}
              activeOpacity={0.9}
            >
              <Image source={{ uri: templeData?.profileImage || branding?.homeBanner || 'https://via.placeholder.com/800x400' }} style={styles.heroImage} />
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <View style={styles.heroLogoRow}>
                  {templeData?.profileImage || branding?.logo ? (
                    <Image source={{ uri: templeData?.profileImage || branding.logo }} style={styles.heroLogo} />
                  ) : (
                    <View style={[styles.heroLogo, { backgroundColor: theme.colors.primary }]} />
                  )}
                  <View style={styles.liveBadge}>
                    <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
                    <Text variant="body2" style={styles.liveText}>{t('home.wait_time', 'Wait Time: 45m')}</Text>
                  </View>
                </View>
                <Text variant="h2" style={styles.heroTitle}>{templeData?.name || branding?.name || 'Temple App'}</Text>
                <Text variant="body2" style={styles.heroSubtitle}>
                  {templeData?.timings && templeData.timings.length > 0
                    ? `Open Today: ${templeData.timings.length} Schedule Slots` 
                    : 'Tap to view temple history & details ->'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Horizontal Quick Actions */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity 
                  key={action.id} 
                  onPress={() => {
                    if ((action as any).params) {
                      navigation.navigate(action.route as any, (action as any).params);
                    } else {
                      navigation.navigate(action.route as any);
                    }
                  }}
                  style={styles.actionPill}
                  accessible={true}
                  accessibilityRole="button"
                >
                  <View style={[styles.actionIconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Image source={action.image} style={{ width: ms(44), height: ms(44), borderRadius: ms(22) }} resizeMode="cover" />
                  </View>
                  <Text variant="body2" align="center" style={styles.actionText}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Spiritual Quote of the Day */}
            <View style={styles.quoteCard}>
              <MaterialCommunityIcons name="format-quote-open" size={ms(32)} color={theme.colors.primary + '40'} style={styles.quoteIcon} />
              <Text variant="body1" style={styles.sanskritQuote}>"Om Asato Maa Sad-Gamaya"</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant} style={styles.quoteMeaning}>
                Lead us from ignorance to truth, from darkness to light.
              </Text>
            </View>

            {/* LIVE NOW SECTION */}
            <View style={styles.sectionHeaderLive}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.livePulseDot} />
                <Text variant="h3" style={{ fontWeight: 'bold' }}>Live Now</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('LiveStreamsList')}>
                <Text variant="body2" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {MOCK_LIVE_STREAMS.filter(s => s.state === 'LIVE').map(stream => (
              <TouchableOpacity 
                key={stream.id} 
                style={styles.liveCard}
                onPress={() => navigation.navigate('LiveStreamDetails', { stream })}
              >
                <Image source={{ uri: stream.thumbnailUrl }} style={styles.liveCardThumbnail} />
                <View style={styles.liveCardOverlay}>
                  <View style={styles.liveBadgeTop}>
                    <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold', fontSize: ms(10) }}>LIVE</Text>
                  </View>
                  <View style={styles.liveCardBottom}>
                    <Text variant="body1" style={{ color: '#FFF', fontWeight: 'bold' }} numberOfLines={1}>{stream.title}</Text>
                    <Text variant="body2" style={{ color: 'rgba(255,255,255,0.8)' }}><MaterialCommunityIcons name="eye" size={ms(12)} color="#FFF" /> {stream.viewerCount?.toLocaleString()} watching</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Minimal Upcoming Festivals */}
            <View style={styles.sectionHeader}>
              <Text variant="h3">{t('home.upcoming_festivals', 'Upcoming Festivals')}</Text>
            </View>
            <View style={styles.festivalsList}>
              {(templeData?.festivals || []).map((fest: any) => {
                // Parse date string manually (e.g. 2026-07-15) to avoid UTC timezone offset bugs
                let day = '??';
                let month = '???';
                if (fest.date && typeof fest.date === 'string') {
                  const parts = fest.date.split('-');
                  if (parts.length === 3) {
                    day = parts[2];
                    const monthIndex = parseInt(parts[1], 10) - 1;
                    month = new Date(2000, monthIndex).toLocaleString('default', { month: 'short' });
                  }
                }
                
                return (
                  <View key={fest.id} style={styles.festivalItem}>
                    <View style={[styles.festivalDateBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <Text variant="h3" color={theme.colors.primary}>{day}</Text>
                      <Text variant="body2" color={theme.colors.onSurfaceVariant}>{month}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: ms(16) }}>
                      <Text variant="body1" style={{ fontWeight: 'bold' }}>{fest.name}</Text>
                      <Text variant="body2" color={theme.colors.onSurfaceVariant}>{fest.type || 'Special Darshan Available'}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={ms(20)} color={theme.colors.onSurfaceVariant} />
                  </View>
                );
              })}
              {(!templeData?.festivals || templeData.festivals.length === 0) && (
                <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ fontStyle: 'italic', marginTop: vs(8) }}>No upcoming festivals right now.</Text>
              )}
            </View>

            {/* Announcements (Minimal) */}
            {ANNOUNCEMENTS.length > 0 && (
              <View style={[styles.announcementBanner, { backgroundColor: theme.colors.secondary + '10' }]}>
                <MaterialCommunityIcons name="bullhorn-outline" size={ms(20)} color={theme.colors.secondary} />
                <Text variant="body2" style={styles.announcementText}>{ANNOUNCEMENTS[0]}</Text>
              </View>
            )}
            
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    paddingBottom: vs(60),
  },
  topSafeArea: {
    backgroundColor: theme.colors.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingVertical: vs(12),
  },
  iconBtn: {
    padding: ms(8),
  },
  profileBtn: {
    marginLeft: ms(8),
  },
  contentPadding: {
    paddingHorizontal: ms(20),
  },
  heroContainer: {
    width: '100%',
    height: vs(220),
    borderRadius: ms(24),
    overflow: 'hidden',
    marginBottom: vs(32),
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark gradient simulation
  },
  heroContent: {
    flex: 1,
    padding: ms(20),
    justifyContent: 'flex-end',
  },
  heroLogoRow: {
    position: 'absolute',
    top: ms(20),
    left: ms(20),
    right: ms(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLogo: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: ms(12),
    paddingVertical: vs(6),
    borderRadius: ms(16),
  },
  liveDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#FF3B30',
    marginRight: ms(6),
  },
  liveText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: ms(11),
  },
  heroTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: vs(4),
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  quickActionsScroll: {
    marginBottom: vs(32),
    overflow: 'visible',
  },
  actionPill: {
    alignItems: 'center',
    marginRight: ms(24),
  },
  actionIconBox: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  actionText: {
    fontWeight: '500',
  },
  quoteCard: {
    backgroundColor: theme.colors.surface,
    padding: ms(24),
    borderRadius: ms(20),
    marginBottom: vs(32),
    borderWidth: 1,
    borderColor: theme.colors.outline,
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: vs(8),
  },
  sanskritQuote: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: vs(8),
    textAlign: 'center',
  },
  quoteMeaning: {
    textAlign: 'center',
    lineHeight: vs(20),
  },
  sectionHeader: {
    marginBottom: vs(16),
  },
  sectionHeaderLive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  livePulseDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: '#FF3B30',
    marginRight: ms(8),
  },
  liveCard: {
    width: '100%',
    height: vs(180),
    borderRadius: ms(20),
    overflow: 'hidden',
    marginBottom: vs(32),
  },
  liveCardThumbnail: {
    width: '100%',
    height: '100%',
  },
  liveCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: ms(16),
  },
  liveBadgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF3B30',
    paddingHorizontal: ms(8),
    paddingVertical: vs(4),
    borderRadius: ms(4),
  },
  liveCardBottom: {
    justifyContent: 'flex-end',
  },
  festivalsList: {
    marginBottom: vs(32),
  },
  festivalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  festivalDateBox: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  announcementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderRadius: ms(16),
  },
  announcementText: {
    flex: 1,
    marginLeft: ms(12),
    color: theme.colors.onSurfaceVariant,
    lineHeight: vs(20),
  }
});
