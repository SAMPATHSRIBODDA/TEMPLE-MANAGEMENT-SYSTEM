import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyMembers'>;

const MEMBERS = [
  { id: '1', name: 'Jane Doe', relation: 'Wife', age: 32 },
  { id: '2', name: 'Baby Doe', relation: 'Son', age: 8 }
];

export const FamilyMembersScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>My Family Members</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {MEMBERS.map(member => (
          <View key={member.id} style={styles.card}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text variant="h2" color={theme.colors.primary}>{member.name[0]}</Text>
            </View>
            <View style={styles.info}>
              <Text variant="h3">{member.name}</Text>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>{member.relation} • {member.age} yrs</Text>
            </View>
            <TouchableOpacity>
              <MaterialCommunityIcons name="pencil-outline" size={ms(20)} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="contained" buttonColor={theme.colors.primary} contentStyle={{ height: vs(50) }}>
          + Add New Member
        </Button>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  },
  backButton: { marginRight: ms(16) },
  content: { padding: ms(16) },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: ms(16),
    borderRadius: ms(12),
    marginBottom: vs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(16),
  },
  info: { flex: 1 },
  footer: { padding: ms(16), backgroundColor: theme.colors.surface }
});
