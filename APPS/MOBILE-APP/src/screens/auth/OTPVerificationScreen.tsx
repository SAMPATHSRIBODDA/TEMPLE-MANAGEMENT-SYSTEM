import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    // In a real app, verify OTP then go to reset password or profile completion
    navigation.navigate('ProfileCompletion');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text variant="body1" color={theme.colors.primary}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text variant="h1" style={styles.title} color={theme.colors.primary}>
              Verify OTP
            </Text>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>
              Enter the 4-digit code sent to your registered contact.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="OTP Code"
              mode="outlined"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />

            <Button 
              mode="contained" 
              buttonColor={theme.colors.primary}
              onPress={handleVerify}
              style={styles.button}
              contentStyle={{ height: vs(50) }}
            >
              Verify & Proceed
            </Button>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: ms(24),
  },
  backButton: {
    marginBottom: vs(24),
    marginTop: vs(8),
  },
  header: {
    marginBottom: vs(32),
  },
  title: {
    marginBottom: vs(8),
  },
  form: {
    marginBottom: vs(24),
  },
  input: {
    marginBottom: vs(24),
    backgroundColor: theme.colors.surface,
    textAlign: 'center',
    fontSize: ms(24),
    letterSpacing: 10,
  },
  button: {
    borderRadius: ms(8),
  },
});
