import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [identifier, setIdentifier] = useState('');

  const handleReset = () => {
    navigation.navigate('OTPVerification');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text variant="body1" color={theme.colors.primary}>← Back to Login</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text variant="h1" style={styles.title} color={theme.colors.primary}>
              Reset Password
            </Text>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>
              Enter your registered email or phone number to receive a verification code.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email or Phone Number"
              mode="outlined"
              value={identifier}
              onChangeText={setIdentifier}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />

            <Button 
              mode="contained" 
              buttonColor={theme.colors.primary}
              onPress={handleReset}
              style={styles.button}
              contentStyle={{ height: vs(50) }}
            >
              Send OTP
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
  },
  button: {
    borderRadius: ms(8),
  },
});
