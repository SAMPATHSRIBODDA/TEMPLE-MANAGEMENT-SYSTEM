import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DarshanBooking'>;

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

const SLOTS = ['06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

export const DarshanBookingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { branding } = useBranding();
  
  const [selectedDate, setSelectedDate] = useState(generateDates()[0].fullDate);
  const [selectedSlot, setSelectedSlot] = useState(SLOTS[0]);
  const [persons, setPersons] = useState(1);
  const [darshanTypes, setDarshanTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<any>(null);

  React.useEffect(() => {
    fetch('http://10.0.2.2:5000/api/v1/ticket-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const tickets = data.data.filter((t:any) => t.sectionName === 'Darshan' && t.isActive);
          setDarshanTypes(tickets);
          if (tickets.length > 0) setSelectedType(tickets[0]);
        }
      })
      .catch(console.error);
  }, []);
  
  const pricePerPerson = selectedType ? selectedType.price : 0;
  const darshanTitle = selectedType ? selectedType.name : 'Special Darshan';

  const handleProceed = () => {
    if (!selectedType) return;
    navigation.navigate('BookingSummary', {
      title: darshanTitle,
      date: selectedDate,
      slot: selectedSlot,
      quantity: persons,
      totalPrice: persons * pricePerPerson
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="h2" color={theme.colors.primary}>Darshan Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Darshan Type Selection */}
        {darshanTypes.length > 1 && (
          <>
            <Text variant="h3" style={styles.sectionTitle}>Select Darshan Type</Text>
            <View style={styles.slotGrid}>
              {darshanTypes.map((type: any) => {
                const isSelected = selectedType?.id === type.id || selectedType?._id === type._id;
                return (
                  <TouchableOpacity 
                    key={type.id || type._id}
                    onPress={() => setSelectedType(type)}
                    style={[
                      styles.slotItem, 
                      isSelected ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary } : { borderColor: theme.colors.outline }
                    ]}
                  >
                    <Text variant="body2" color={isSelected ? '#FFF' : theme.colors.primary}>{type.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

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

        {/* Slot Selection */}
        <Text variant="h3" style={styles.sectionTitle}>Select Slot</Text>
        <View style={styles.slotGrid}>
          {SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <TouchableOpacity 
                key={slot}
                onPress={() => setSelectedSlot(slot)}
                style={[
                  styles.slotItem, 
                  isSelected ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary } : { borderColor: theme.colors.outline }
                ]}
              >
                <Text variant="body2" color={isSelected ? '#FFF' : theme.colors.primary}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

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
            onPress={() => setPersons(Math.min(10, persons + 1))} 
          />
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: theme.colors.secondary + '10', borderColor: theme.colors.secondary }]}>
          <MaterialCommunityIcons name="information-outline" size={ms(20)} color={theme.colors.secondary} />
          <Text variant="body2" style={styles.infoText}>
            Please carry a valid ID proof. Reporting time is 30 mins before the slot.
          </Text>
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
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: vs(24),
  },
  slotItem: {
    width: '30%',
    paddingVertical: vs(12),
    borderRadius: ms(8),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
    marginBottom: vs(12),
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(32),
  },
  counterText: {
    marginHorizontal: ms(24),
  },
  infoBox: {
    flexDirection: 'row',
    padding: ms(12),
    borderRadius: ms(8),
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    marginLeft: ms(8),
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
