import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';
import { MOCK_TRACKS, MOCK_PLAYLISTS, AUDIO_CATEGORIES } from '../../data/audio/mockData';
import { AudioCard } from '../../components/audio/AudioCard';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useAudio } from '../../contexts/AudioContext';

export const SpiritualHomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  const { currentTrack } = useAudio();
  
  const [templeData, setTempleData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('http://10.0.2.2:5000/api/v1/temple/core-data')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTempleData(data.data);
        }
      })
      .catch(err => console.warn('Could not fetch temple core data', err));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning 🌸' : hour < 18 ? 'Good Afternoon 🌸' : 'Good Evening 🌸';

  // Extract padding for mini player if active
  const paddingBottom = currentTrack ? vs(140) : vs(40);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom }]} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {templeData?.profileImage || branding?.logo ? (
              <Image source={{ uri: templeData?.profileImage || branding.logo }} style={styles.logo} />
            ) : (
              <View style={[styles.logo, { backgroundColor: theme.colors.primary }]} />
            )}
            <View>
              <Text variant="h2" style={{ fontWeight: 'bold' }}>{greeting}</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>Listen to today's spiritual chants.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <MaterialCommunityIcons name="magnify" size={ms(28)} color={theme.colors.onBackground} />
          </TouchableOpacity>
        </View>

        {/* Featured Banner */}
        <View style={[styles.featuredBanner, { backgroundColor: theme.colors.primary }]}>
          <Text variant="h3" color="#FFF" style={{ marginBottom: vs(8) }}>Today's Aarti</Text>
          <Text variant="body2" color="rgba(255,255,255,0.8)" style={{ marginBottom: vs(16) }}>
            Join the morning rituals of {templeData?.name || branding?.name || 'the Temple'}.
          </Text>
          <TouchableOpacity style={styles.playBtnBanner}>
            <MaterialCommunityIcons name="play" size={ms(24)} color={theme.colors.primary} />
            <Text variant="body2" style={{ fontWeight: 'bold', marginLeft: ms(4) }} color={theme.colors.primary}>Play Now</Text>
          </TouchableOpacity>
        </View>

        {/* Categories (Chips) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {AUDIO_CATEGORIES.map((cat, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[
                styles.categoryChip, 
                { backgroundColor: idx === 0 ? theme.colors.primary : theme.colors.surfaceVariant }
              ]}
            >
              <Text variant="body2" color={idx === 0 ? '#FFF' : theme.colors.onSurfaceVariant} style={{ fontWeight: idx === 0 ? 'bold' : 'normal' }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Playlists: Recommended For You */}
        <Text variant="h2" style={styles.sectionTitle}>Recommended For You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {MOCK_PLAYLISTS.map((playlist) => (
            <TouchableOpacity 
              key={playlist.id} 
              style={styles.playlistCard} 
              onPress={() => navigation.navigate('AudioDetails', { playlist })}
            >
              <Image source={{ uri: playlist.coverUrl }} style={styles.playlistCover} />
              <Text variant="body1" style={{ fontWeight: 'bold', marginTop: vs(12), marginBottom: vs(4) }} numberOfLines={1}>
                {playlist.title}
              </Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant} numberOfLines={2}>
                {playlist.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tracks: Recently Played */}
        <Text variant="h2" style={styles.sectionTitle}>Continue Listening</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {MOCK_TRACKS.map((track) => (
            <AudioCard key={track.id} track={track} queue={MOCK_TRACKS} horizontal />
          ))}
        </ScrollView>

        {/* Tracks: Popular Chants (Vertical List) */}
        <Text variant="h2" style={styles.sectionTitle}>Popular Chants</Text>
        <View style={styles.verticalList}>
          {MOCK_TRACKS.slice().reverse().map((track) => (
            <AudioCard key={`pop-${track.id}`} track={track} queue={MOCK_TRACKS.slice().reverse()} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingTop: vs(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(32),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    marginRight: ms(16),
  },
  searchBtn: {
    padding: ms(8),
  },
  featuredBanner: {
    padding: ms(24),
    borderRadius: ms(20),
    marginBottom: vs(32),
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  playBtnBanner: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
  },
  categoriesScroll: {
    marginBottom: vs(32),
    overflow: 'visible',
  },
  categoryChip: {
    paddingHorizontal: ms(20),
    paddingVertical: vs(10),
    borderRadius: ms(20),
    marginRight: ms(12),
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: vs(20),
  },
  horizontalScroll: {
    marginBottom: vs(32),
    overflow: 'visible',
  },
  playlistCard: {
    width: ms(160),
    marginRight: ms(20),
  },
  playlistCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: ms(16),
    backgroundColor: '#CCC',
  },
  verticalList: {
    marginBottom: vs(20),
  }
});
