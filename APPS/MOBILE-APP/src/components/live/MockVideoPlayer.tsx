import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../Text';
import { LiveStream } from '../../types/live';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';

interface MockVideoPlayerProps {
  stream: LiveStream;
}

export const MockVideoPlayer: React.FC<MockVideoPlayerProps> = ({ stream }) => {
  const theme = useTheme();
  const { branding } = useBranding();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(stream.state === 'LIVE');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isLive = stream.state === 'LIVE';

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreen]}>
      {/* Background Image / Stream Feed */}
      <Image source={{ uri: stream.thumbnailUrl }} style={styles.videoBackground} />
      <View style={styles.overlay} />

      {/* Top HUD */}
      <View style={styles.topHud}>
        <View style={styles.topLeft}>
          {branding?.logo ? (
            <Image source={{ uri: branding.logo }} style={styles.watermark} />
          ) : (
            <View style={[styles.watermark, { backgroundColor: theme.colors.primary }]} />
          )}
          
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold', fontSize: ms(10) }}>LIVE</Text>
            </View>
          )}

          {stream.viewerCount !== undefined && (
            <View style={styles.viewerBadge}>
              <MaterialCommunityIcons name="eye" size={ms(12)} color="#FFF" />
              <Text variant="body2" style={{ color: '#FFF', marginLeft: ms(4), fontSize: ms(10) }}>
                {stream.viewerCount.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="share-variant" size={ms(24)} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Center Play Button (if not live or paused) */}
      {!isPlaying && (
        <TouchableOpacity style={styles.centerPlayBtn} onPress={() => setIsPlaying(true)}>
          <MaterialCommunityIcons name="play" size={ms(48)} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* Bottom HUD */}
      <View style={styles.bottomHud}>
        <View style={{ flex: 1 }}>
          <Text variant="body1" style={{ color: '#FFF', fontWeight: 'bold' }} numberOfLines={1}>
            {stream.title}
          </Text>
        </View>
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setIsMuted(!isMuted)}>
            <MaterialCommunityIcons name={isMuted ? "volume-off" : "volume-high"} size={ms(24)} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setIsFullscreen(!isFullscreen)}>
            <MaterialCommunityIcons name={isFullscreen ? "fullscreen-exit" : "fullscreen"} size={ms(24)} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  fullscreen: {
    aspectRatio: undefined,
    height: '100%', // Mock fullscreen state
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topHud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: ms(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watermark: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    marginRight: ms(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(4),
    marginRight: ms(8),
  },
  liveDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: '#FFF',
    marginRight: ms(4),
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(4),
  },
  topRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: ms(4),
    marginLeft: ms(8),
  },
  centerPlayBtn: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomHud: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: ms(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // gradient simulation
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
