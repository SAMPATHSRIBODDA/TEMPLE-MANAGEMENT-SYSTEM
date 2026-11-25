import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ms } from '../utils/responsive';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';
  color?: string;
  weight?: 'normal' | 'bold' | '600' | '500';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  style,
  variant = 'body1',
  color,
  weight = 'normal',
  align = 'left',
  children,
  ...props
}) => {
  const theme = useTheme<any>();
  const finalColor = color || theme.colors.onSurface;

  return (
    <RNText
      allowFontScaling={false}
      style={[
        styles[variant],
        { color: finalColor, fontWeight: weight, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: ms(24),
    lineHeight: ms(32),
    fontWeight: 'bold',
  },
  h2: {
    fontSize: ms(20),
    lineHeight: ms(28),
    fontWeight: 'bold',
  },
  h3: {
    fontSize: ms(18),
    lineHeight: ms(24),
    fontWeight: '600',
  },
  body1: {
    fontSize: ms(16),
    lineHeight: ms(22),
  },
  body2: {
    fontSize: ms(14),
    lineHeight: ms(20),
  },
  caption: {
    fontSize: ms(12),
    lineHeight: ms(16),
  },
});
