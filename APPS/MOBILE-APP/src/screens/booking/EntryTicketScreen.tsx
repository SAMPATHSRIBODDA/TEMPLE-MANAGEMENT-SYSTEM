import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EntryTickets'>;

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      date: d.getDate().toString().padStart(2, '0'),
      day: d.toLocaleString('en-US', { weekday: 'short' }),
      fullDate: d.toISOString().split('T')[0]
    });
  }
  return dates;
};

export const EntryTicketScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [ticketType, setTicketType] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(generateDates()[0].fullDate);
  const [persons, setPersons] = useState(1);
  
  React.useEffect(() => {
    fetch('http://10.0.2.2:5000/api/v1/ticket-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const activeTickets = data.data.filter((t:any) => t.isActive);
          setCategories(activeTickets);
          if (activeTickets.length > 0) setTicketType(activeTickets[0]);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const groupedSections = categories.reduce((acc: any, curr: any) => {
    if (!acc[curr.sectionName]) acc[curr.sectionName] = [];
    acc[curr.sectionName].push(curr);
    return acc;
  }, {});

  const pricePerPerson = ticketType ? ticketType.price : 50;

  const handleProceed = () => {
    if (!ticketType) return;
    navigation.navigate('BookingSummary', {
      title: ticketType.name,
      date: selectedDate,
      slot: 'N/A',
      quantity: persons,
      totalPrice: persons * pricePerPerson,
      type: 'Ticket'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Bookings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {categories.length === 0 && (
          <Text variant="body2" color="#999" style={{ marginVertical: vs(16) }}>No active tickets found.</Text>
        )}

        {Object.keys(groupedSections).map(sectionName => (
          <View key={sectionName} style={{ marginBottom: vs(8) }}>
            <Text variant="h3" style={styles.sectionTitle}>{sectionName}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
              {groupedSections[sectionName].map((typeObj: any) => {
                const isSelected = ticketType?._id === typeObj._id;
                return (
                  <TouchableOpacity 
                    key={typeObj._id}
                    onPress={() => setTicketType(typeObj)}
                    style={[
                      styles.typeItem, 
                      { minWidth: ms(140), marginRight: ms(12), marginBottom: vs(12) },
                      isSelected ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary } : { borderColor: theme.colors.outline }
                    ]}
                  >
                    <Text variant="body1" style={{ fontWeight: 'bold', textAlign: 'center' }} color={isSelected ? '#FFF' : theme.colors.primary}>{typeObj.name}</Text>
                    <Text variant="body2" style={{ textAlign: 'center' }} color={isSelected ? '#FFF' : '#666'}>
                      ₹{typeObj.price} / person
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ))}

        {/* Date Selection */}
        <Text variant="h3" style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateStrip}>
          {generateDates().map((item) => {
            const isSelected = selectedDate === item.fullDate;
            return (
              <TouchableOpacity 
                key={item.fullDate}
                onPress={() => setSelectedDate(item.fullDate)}
                style={[
                  styles.dateItem, 
                  isSelected ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary } : { borderColor: theme.colors.outline }
                ]}
              >
                <Text variant="body2" color={isSelected ? '#FFF' : '#666'}>{item.day}</Text>
                <Text variant="h2" color={isSelected ? '#FFF' : theme.colors.primary}>{item.date}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Persons Counter */}
        <Text variant="h3" style={styles.sectionTitle}>Number of Persons</Text>
        <View style={styles.counterContainer}>
          <IconButton 
            icon="minus" 
            size={ms(24)} 
            iconColor={theme.colors.primary}
            mode="outlined"
            onPress={() => setPersons(Math.max(1, persons - 1))} 
          />
          <Text variant="h2" style={styles.counterText}>{persons}</Text>
          <IconButton 
            icon="plus" 
            size={ms(24)}
            iconColor={theme.colors.primary}
            mode="contained"
            containerColor={theme.colors.primary + '20'}
            onPress={() => setPersons(Math.min(20, persons + 1))} 
          />
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text variant="body2" color={theme.colors.onSurfaceVariant}>Total Amount</Text>
          <Text variant="h2" color={theme.colors.primary}>₹{persons * pricePerPerson}</Text>
        </View>
        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={handleProceed}
          contentStyle={{ height: vs(45), paddingHorizontal: ms(24) }}
        >
          Proceed
        </Button>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  backButton: {
    marginRight: ms(16),
  },
  scrollContent: {
    padding: ms(16),
    paddingBottom: vs(40),
  },
  sectionTitle: {
    marginBottom: vs(12),
    marginTop: vs(8),
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(24),
  },
  typeItem: {
    flex: 1,
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 1,
    marginHorizontal: ms(4),
    alignItems: 'center',
  },
  dateStrip: {
    flexDirection: 'row',
    marginBottom: vs(24),
  },
  dateItem: {
    width: ms(60),
    height: vs(70),
    borderRadius: ms(12),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(32),
  },
  counterText: {
    marginHorizontal: ms(24),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  }
});
