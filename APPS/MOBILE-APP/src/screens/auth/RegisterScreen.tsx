import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    navigation.navigate('OTPVerification');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text variant="h1" style={styles.title} color={theme.colors.primary}>
              Create Account
            </Text>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>
              Join {branding?.name || 'us'} today to explore and book sevas.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />
            <TextInput
              label="Email Address"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />
            <TextInput
              label="Phone Number"
              mode="outlined"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />
            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />

            <Button 
              mode="contained" 
              buttonColor={theme.colors.primary}
              onPress={handleRegister}
              style={styles.button}
              contentStyle={{ height: vs(50) }}
            >
              Sign Up
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text variant="body2" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                Login
              </Text>
            </TouchableOpacity>
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
  header: {
    marginTop: vs(20),
    marginBottom: vs(32),
  },
  title: {
    marginBottom: vs(8),
  },
  form: {
    marginBottom: vs(24),
  },
  input: {
    marginBottom: vs(16),
    backgroundColor: theme.colors.surface,
  },
  button: {
    borderRadius: ms(8),
    marginTop: vs(8),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: vs(24),
  }
});
