import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { ms, vs } from '../utils/responsive';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Oops! Something went wrong.',
  message = 'We encountered an error while trying to load the data. Please check your connection and try again.',
  onRetry,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name="alert-circle-outline" size={ms(60)} color={theme.colors.error} />
      <Text variant="h2" align="center" style={styles.title}>{title}</Text>
      <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center" style={styles.subtitle}>
        {message}
      </Text>
      <Button 
        mode="outlined" 
        textColor={theme.colors.primary} 
        style={{ borderColor: theme.colors.primary }}
        onPress={onRetry}
      >
        Retry
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(24),
  },
  title: {
    marginTop: vs(16),
    marginBottom: vs(8),
  },
  subtitle: {
    marginBottom: vs(24),
    lineHeight: vs(20),
  },
});
