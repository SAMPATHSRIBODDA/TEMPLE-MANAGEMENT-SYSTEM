import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, TextInput } from 'react-native-paper';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileCompletion'>;

export const ProfileCompletionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { login } = useAuth();
  
  const [dob, setDob] = useState('');
  const [gotra, setGotra] = useState('');
  const [address, setAddress] = useState('');

  const handleComplete = () => {
    // Save profile and then log user in so they proceed to the main app
    login();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text variant="h1" style={styles.title} color={theme.colors.primary}>
              Complete Profile
            </Text>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>
              Just a few more details to personalize your experience.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Date of Birth (DD/MM/YYYY)"
              mode="outlined"
              value={dob}
              onChangeText={setDob}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />
            <TextInput
              label="Gotra (Optional)"
              mode="outlined"
              value={gotra}
              onChangeText={setGotra}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />
            <TextInput
              label="Full Address"
              mode="outlined"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor={theme.colors.primary}
            />

            <Button 
              mode="contained" 
              buttonColor={theme.colors.primary}
              onPress={handleComplete}
              style={styles.button}
              contentStyle={{ height: vs(50) }}
            >
              Complete Registration
            </Button>
          </View>
          
          <TouchableOpacity onPress={handleComplete} style={{ alignItems: 'center', marginTop: vs(16) }}>
             <Text variant="body2" color={theme.colors.onSurfaceVariant}>Skip for now</Text>
          </TouchableOpacity>

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
});
