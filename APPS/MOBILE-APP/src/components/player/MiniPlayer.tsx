import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudio } from '../../contexts/AudioContext';
import { Text } from '../Text';
import { ms, vs } from '../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const MiniPlayer = () => {
  const theme = useTheme();
  const { currentTrack, isPlaying, pause, resume, progress, toggleFullScreen } = useAudio();
  const insets = useSafeAreaInsets();
  
  // Animation value for slide up
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (currentTrack) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  const progressPercent = (progress / currentTrack.duration) * 100;

  // The mini player sits directly above the bottom tab bar.
  // In React Navigation, tab bar height is roughly 60 + insets.bottom
  const TAB_BAR_HEIGHT = 65 + insets.bottom;

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface, 
        transform: [{ translateY: slideAnim }],
        bottom: TAB_BAR_HEIGHT 
      }
    ]}>
      {/* Progress Bar Top Edge */}
      <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={[styles.progressBarFill, { backgroundColor: theme.colors.primary, width: `${progressPercent}%` }]} />
      </View>

      <TouchableOpacity 
        style={styles.innerContainer}
        activeOpacity={0.9}
        onPress={() => toggleFullScreen(true)}
      >
        <Image source={{ uri: currentTrack.coverUrl }} style={styles.cover} />
        
        <View style={styles.textContainer}>
          <Text variant="body1" style={{ fontWeight: 'bold' }} numberOfLines={1}>{currentTrack.title}</Text>
          <Text variant="body2" color={theme.colors.onSurfaceVariant} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>

        <TouchableOpacity style={styles.controlBtn} onPress={() => {/* like */}}>
          <MaterialCommunityIcons name="heart-outline" size={ms(24)} color={theme.colors.onSurface} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlBtn} 
          onPress={isPlaying ? pause : resume}
        >
          <MaterialCommunityIcons name={isPlaying ? "pause" : "play"} size={ms(28)} color={theme.colors.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: ms(8),
    right: ms(8),
    borderRadius: ms(8),
    height: vs(56),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  progressBarBg: {
    height: 2,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  progressBarFill: {
    height: '100%',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8),
  },
  cover: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(4),
    backgroundColor: '#CCC',
  },
  textContainer: {
    flex: 1,
    marginLeft: ms(12),
    justifyContent: 'center',
  },
  controlBtn: {
    padding: ms(8),
  }
});
