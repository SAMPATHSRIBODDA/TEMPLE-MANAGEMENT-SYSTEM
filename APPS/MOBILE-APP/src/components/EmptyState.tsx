import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { ms, vs } from '../utils/responsive';

interface EmptyStateProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <MaterialCommunityIcons name={icon} size={ms(60)} color={theme.colors.onSurfaceVariant} />
      </View>
      <Text variant="h2" align="center" style={styles.title}>{title}</Text>
      {subtitle && (
        <Text variant="body2" color={theme.colors.onSurfaceVariant} align="center" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary} 
          onPress={onAction}
          style={styles.actionBtn}
        >
          {actionLabel}
        </Button>
      )}
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
  iconContainer: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(24),
  },
  title: {
    marginBottom: vs(8),
  },
  subtitle: {
    marginBottom: vs(24),
    lineHeight: vs(20),
  },
  actionBtn: {
    paddingHorizontal: ms(16),
  }
});
