import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';
import { AudioCard } from '../../components/audio/AudioCard';
import { useAudio } from '../../contexts/AudioContext';

export const AudioDetailsScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  const { currentTrack, playTrack } = useAudio();
  
  const { playlist } = route.params;

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const paddingBottom = currentTrack ? vs(140) : vs(40);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom }} showsVerticalScrollIndicator={false}>
        
        {/* Cover Section */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: playlist.coverUrl }} style={styles.coverImage} blurRadius={10} />
          <View style={styles.overlay} />
          
          {/* Back Button */}
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={ms(28)} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Center Art */}
          <View style={styles.centerArtContainer}>
            <Image source={{ uri: playlist.coverUrl }} style={styles.centerArt} />
          </View>
        </View>

        {/* Info & Controls */}
        <View style={styles.infoSection}>
          <Text variant="h1" style={{ fontWeight: 'bold', marginBottom: vs(8) }}>{playlist.title}</Text>
          <Text variant="body1" color={theme.colors.onSurfaceVariant} style={{ marginBottom: vs(8) }}>
            {branding?.name || 'Temple Audio'}
          </Text>
          <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginBottom: vs(24) }}>
            {playlist.description}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons name="heart-outline" size={ms(28)} color={theme.colors.onBackground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons name="share-variant-outline" size={ms(28)} color={theme.colors.onBackground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons name="download-outline" size={ms(28)} color={theme.colors.onBackground} />
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity 
              style={[styles.playBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handlePlayAll}
            >
              <MaterialCommunityIcons name="play" size={ms(32)} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tracks List */}
        <View style={styles.tracksSection}>
          {playlist.tracks.map((track: any) => (
            <AudioCard key={track.id} track={track} queue={playlist.tracks} />
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    width: '100%',
    height: vs(350),
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  topNav: {
    position: 'absolute',
    top: vs(50), // rough safe area
    left: ms(16),
  },
  backBtn: {
    padding: ms(8),
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: ms(20),
  },
  centerArtContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: vs(40),
  },
  centerArt: {
    width: ms(200),
    height: ms(200),
    borderRadius: ms(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  infoSection: {
    paddingHorizontal: ms(20),
    paddingTop: vs(24),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(32),
  },
  iconBtn: {
    marginRight: ms(20),
  },
  playBtn: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tracksSection: {
    paddingHorizontal: ms(20),
  }
});
