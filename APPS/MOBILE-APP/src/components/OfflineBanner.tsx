import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, SafeAreaView, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { ms, vs } from '../utils/responsive';
import { useTheme } from 'react-native-paper';

interface OfflineBannerProps {
  isOffline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  const theme = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOffline ? 0 : -100,
      useNativeDriver: true,
      bounciness: 0,
      speed: 12,
    }).start();
  }, [isOffline, translateY]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.error,
          transform: [{ translateY }]
        }
      ]}
      pointerEvents="none" // So it doesn't block touches if it's animating
    >
      <SafeAreaView edges={['top']}>
        <View style={styles.content}>
          <MaterialCommunityIcons name="wifi-off" size={ms(16)} color="#FFF" />
          <Text variant="body2" color="#FFF" style={styles.text}>
            No Internet Connection
          </Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999, // Ensure it sits above navigation headers
    elevation: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(8),
  },
  text: {
    marginLeft: ms(8),
    fontWeight: 'bold',
  }
});
