import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // In a real app, authenticate against backend here
    login();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            {branding?.logo && (
              <Image source={{ uri: branding.logo }} style={styles.logo} resizeMode="contain" />
            )}
            <Text variant="h1" align="center" style={styles.title} color={theme.colors.primary}>
              Welcome Back
            </Text>
            <Text variant="body2" align="center" color={theme.colors.onSurfaceVariant}>
              Sign in to continue to {branding?.name || 'the app'}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email or Phone Number"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
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
            
            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text variant="body2" color={theme.colors.primary} style={{ fontWeight: '600' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button 
              mode="contained" 
              buttonColor={theme.colors.primary}
              onPress={handleLogin}
              style={styles.button}
              contentStyle={{ height: vs(50) }}
            >
              Login
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text variant="body2" color={theme.colors.primary} style={{ fontWeight: 'bold' }}>
                Register
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: vs(40),
  },
  logo: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    marginBottom: vs(16),
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: vs(24),
  },
  button: {
    borderRadius: ms(8),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: vs(24),
  }
});
