import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useTheme, Button } from 'react-native-paper';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="h1" align="center" style={styles.title} color={theme.colors.primary}>
          Welcome to TempleApp
        </Text>
        <Text variant="body1" align="center" style={styles.subtitle}>
          Discover and connect with your favorite temples. Book darshans, sevas, and make donations all in one seamless experience.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={() => navigation.navigate('SelectTemple')}
          style={styles.button}
          contentStyle={{ height: vs(50) }}
        >
          Select Your Temple
        </Button>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(24),
  },
  title: {
    marginBottom: vs(16),
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    paddingHorizontal: ms(20),
  },
  footer: {
    padding: ms(24),
    paddingBottom: vs(32),
  },
  button: {
    borderRadius: ms(25),
  },
});
