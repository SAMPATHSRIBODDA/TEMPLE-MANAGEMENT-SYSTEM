import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Text } from '../Text';
import { Track } from '../../types/audio';
import { ms, vs } from '../../utils/responsive';
import { useAudio } from '../../contexts/AudioContext';

interface AudioCardProps {
  track: Track;
  queue: Track[];
  horizontal?: boolean;
}

export const AudioCard: React.FC<AudioCardProps> = ({ track, queue, horizontal = false }) => {
  const theme = useTheme();
  const { playTrack, currentTrack, isPlaying } = useAudio();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    playTrack(track, queue);
  };

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.hCard} onPress={handlePlay} activeOpacity={0.8}>
        <Image source={{ uri: track.coverUrl }} style={styles.hCover} />
        <Text variant="body1" style={{ fontWeight: 'bold', marginTop: vs(12), marginBottom: vs(4) }} numberOfLines={1}>
          {track.title}
        </Text>
        <Text variant="body2" color={theme.colors.onSurfaceVariant} numberOfLines={1}>
          {track.artist}
        </Text>
      </TouchableOpacity>
    );
  }

  // Vertical list style (default)
  return (
    <TouchableOpacity style={styles.vCard} onPress={handlePlay} activeOpacity={0.8}>
      <Image source={{ uri: track.coverUrl }} style={styles.vCover} />
      <View style={styles.vInfo}>
        <Text variant="body1" style={{ fontWeight: isCurrentTrack ? 'bold' : 'normal' }} color={isCurrentTrack ? theme.colors.primary : theme.colors.onBackground} numberOfLines={1}>
          {track.title}
        </Text>
        <Text variant="body2" color={theme.colors.onSurfaceVariant} numberOfLines={1}>
          {track.artist} • {track.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hCard: {
    width: ms(140),
    marginRight: ms(16),
  },
  hCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: ms(12),
    backgroundColor: '#CCC',
  },
  vCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  vCover: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(8),
    backgroundColor: '#CCC',
  },
  vInfo: {
    flex: 1,
    marginLeft: ms(16),
    justifyContent: 'center',
  }
});
