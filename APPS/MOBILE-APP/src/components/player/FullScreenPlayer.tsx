import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, PanResponder, Modal } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudio } from '../../contexts/AudioContext';
import { Text } from '../Text';
import { ms, vs } from '../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBranding } from '../../branding/brandingContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export const FullScreenPlayer = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { branding } = useBranding();
  
  const { 
    currentTrack, isPlaying, pause, resume, next, previous, 
    progress, seek, isFullScreen, toggleFullScreen 
  } = useAudio();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isFullScreen) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isFullScreen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10; // Only capture downward swipe
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 1.5) {
          toggleFullScreen(false);
        } else {
          // Snap back
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7
          }).start();
        }
      },
    })
  ).current;

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = (progress / currentTrack.duration) * 100;

  return (
    <Modal visible={isFullScreen} transparent animationType="none">
      <Animated.View 
        style={[
          styles.container, 
          { backgroundColor: theme.colors.background, transform: [{ translateY }] }
        ]}
      >
        <View style={[styles.header, { marginTop: insets.top + vs(10) }]} {...panResponder.panHandlers}>
          <TouchableOpacity onPress={() => toggleFullScreen(false)} style={styles.iconBtn}>
            <MaterialCommunityIcons name="chevron-down" size={ms(36)} color={theme.colors.onBackground} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center">NOW PLAYING</Text>
            <Text variant="body1" style={{ fontWeight: 'bold' }} align="center">{branding?.name || 'Temple Audio'}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="dots-horizontal" size={ms(28)} color={theme.colors.onBackground} />
          </TouchableOpacity>
        </View>

        <View style={styles.artworkContainer}>
          <Image source={{ uri: currentTrack.coverUrl }} style={styles.artwork} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text variant="h2" style={{ fontWeight: 'bold' }}>{currentTrack.title}</Text>
              <Text variant="h3" color={theme.colors.primary} style={{ marginTop: vs(4) }}>{currentTrack.artist}</Text>
            </View>
            <TouchableOpacity>
              <MaterialCommunityIcons name="heart-outline" size={ms(28)} color={theme.colors.onBackground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={[styles.progressBarFill, { backgroundColor: theme.colors.primary, width: `${progressPercent}%` }]} />
            <View style={[styles.progressThumb, { backgroundColor: theme.colors.primary, left: `${progressPercent}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>{formatTime(progress)}</Text>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>{formatTime(currentTrack.duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="shuffle-variant" size={ms(28)} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={previous}>
            <MaterialCommunityIcons name="skip-previous" size={ms(48)} color={theme.colors.onBackground} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playBtn, { backgroundColor: theme.colors.primary }]}
            onPress={isPlaying ? pause : resume}
          >
            <MaterialCommunityIcons name={isPlaying ? "pause" : "play"} size={ms(40)} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={next}>
            <MaterialCommunityIcons name="skip-next" size={ms(48)} color={theme.colors.onBackground} />
          </TouchableOpacity>

          <TouchableOpacity>
            <MaterialCommunityIcons name="repeat" size={ms(28)} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(24),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(32),
  },
  iconBtn: {
    padding: ms(8),
  },
  headerTextContainer: {
    flex: 1,
  },
  artworkContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: vs(40),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: ms(24),
  },
  infoContainer: {
    marginBottom: vs(32),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    marginBottom: vs(40),
  },
  progressBarBg: {
    height: vs(6),
    borderRadius: vs(3),
    width: '100%',
    marginBottom: vs(12),
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: vs(3),
  },
  progressThumb: {
    position: 'absolute',
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    marginLeft: ms(-7), // Center thumb
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
  },
  playBtn: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }
});
