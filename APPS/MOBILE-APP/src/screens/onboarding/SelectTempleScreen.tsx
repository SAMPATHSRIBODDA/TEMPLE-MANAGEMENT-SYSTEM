import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { TempleBranding, fetchTemplesList } from '../../branding/brandingService';
import { useBranding } from '../../branding/brandingContext';

export const SelectTempleScreen: React.FC = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { selectTemple } = useBranding();
  const [temples, setTemples] = useState<TempleBranding[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTemplesList();
      setTemples(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSelect = async (id: string) => {
    setSelectingId(id);
    await selectTemple(id);
  };

  const filtered = temples.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.contact.address.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item }: { item: TempleBranding }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleSelect(item.id)}
      disabled={selectingId !== null}
    >
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={styles.cardInfo}>
        <Text variant="h3">{item.name}</Text>
        <Text variant="body2" color={theme.colors.onSurfaceVariant}>{item.contact.address}</Text>
        <View style={styles.colors}>
          <View style={[styles.colorSwatch, { backgroundColor: item.primaryColor }]} />
          <View style={[styles.colorSwatch, { backgroundColor: item.secondaryColor }]} />
        </View>
      </View>
      {selectingId === item.id && <ActivityIndicator color={item.primaryColor} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="h2" style={{ marginBottom: vs(8) }}>Select Your Temple</Text>
        <Text variant="body2" color={theme.colors.onSurfaceVariant}>Search for a temple to personalize your experience.</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput 
          style={[styles.searchInput, { borderColor: theme.colors.border }]}
          placeholder="Search by name or location..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList 
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text variant="body1" align="center" style={{ marginTop: vs(40) }}>No temples found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: ms(20),
    paddingBottom: vs(16),
  },
  searchContainer: {
    paddingHorizontal: ms(20),
    marginBottom: vs(16),
  },
  searchInput: {
    height: vs(45),
    borderWidth: 1,
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    fontSize: ms(14),
    backgroundColor: '#fff'
  },
  list: {
    paddingHorizontal: ms(20),
    paddingBottom: vs(40),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: ms(16),
    borderRadius: ms(12),
    marginBottom: vs(16),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    marginRight: ms(16),
  },
  cardInfo: {
    flex: 1,
  },
  colors: {
    flexDirection: 'row',
    marginTop: vs(8),
    gap: ms(8),
  },
  colorSwatch: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(4),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
