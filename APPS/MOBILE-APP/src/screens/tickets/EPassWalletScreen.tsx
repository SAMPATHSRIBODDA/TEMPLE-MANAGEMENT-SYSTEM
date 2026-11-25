import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { Ticket } from '../../types/ticket';

export const EPassWalletScreen = ({ navigation }: any) => {
  const theme = useTheme();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://10.0.2.2:5000/api/v1/transactions/tickets');
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map((t:any) => ({
          id: t._id,
          type: t.ticketType.includes('Darshan') ? 'Darshan' : 'Entry Ticket',
          title: t.ticketType,
          date: new Date(t.validForDate).toISOString().split('T')[0],
          time: t.slotTime || 'N/A',
          persons: t.adultCount,
          status: t.status === 'issued' ? 'VALID' : 'USED',
          qrPayload: t.qrCode,
          bookingRef: t.ticketNumber
        }));
        setTickets(mapped);
      }
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTickets().then(() => setRefreshing(false));
  }, []);

  const renderTicket = (ticket: Ticket) => {
    const isPast = ticket.status !== 'VALID';
    
    return (
      <TouchableOpacity 
        key={ticket.id}
        style={[
          styles.ticketCard, 
          { backgroundColor: theme.colors.surface },
          isPast && { opacity: 0.7 }
        ]}
        onPress={() => navigation.navigate('TicketDetails', { ticket })}
        activeOpacity={0.9}
      >
        {/* Top Section */}
        <View style={[styles.ticketTop, { backgroundColor: isPast ? theme.colors.surfaceVariant : theme.colors.primary }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3" style={{ color: isPast ? theme.colors.onSurface : '#FFF', fontWeight: 'bold' }}>
              {ticket.type}
            </Text>
            <MaterialCommunityIcons 
              name={ticket.type === 'Darshan' ? 'hands-pray' : ticket.type === 'Prasadam' ? 'food-apple' : 'flower'} 
              size={ms(24)} 
              color={isPast ? theme.colors.onSurfaceVariant : 'rgba(255,255,255,0.7)'} 
            />
          </View>
          <Text variant="body1" style={{ color: isPast ? theme.colors.onSurface : '#FFF', marginTop: vs(8) }} numberOfLines={1}>
            {ticket.title}
          </Text>
        </View>

        {/* Separator with cutouts */}
        <View style={styles.separatorContainer}>
          <View style={[styles.cutout, styles.cutoutLeft, { backgroundColor: theme.colors.background }]} />
          <View style={[styles.dashedLine, { borderColor: theme.colors.outline }]} />
          <View style={[styles.cutout, styles.cutoutRight, { backgroundColor: theme.colors.background }]} />
        </View>

        {/* Bottom Section */}
        <View style={styles.ticketBottom}>
          <View style={styles.infoRow}>
            <View>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>Date</Text>
              <Text variant="body1" style={{ fontWeight: 'bold' }}>{ticket.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>Time</Text>
              <Text variant="body1" style={{ fontWeight: 'bold' }}>{ticket.time}</Text>
            </View>
          </View>
          
          <View style={[styles.infoRow, { marginTop: vs(16) }]}>
            <View>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>Persons</Text>
              <Text variant="body1" style={{ fontWeight: 'bold' }}>{ticket.persons}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="body2" color={theme.colors.onSurfaceVariant}>Status</Text>
              <Text variant="body1" style={{ 
                fontWeight: 'bold', 
                color: ticket.status === 'VALID' ? '#34C759' : ticket.status === 'USED' ? '#FF9500' : '#FF3B30'
              }}>
                {ticket.status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text variant="h2" style={{ fontWeight: 'bold' }}>My Tickets</Text>
        <View style={{ width: ms(40) }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        <Text variant="h3" style={styles.sectionTitle}>Upcoming</Text>
        {tickets.filter(t => t.status === 'VALID').map(renderTicket)}
        {tickets.filter(t => t.status === 'VALID').length === 0 && (
          <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ fontStyle: 'italic', marginBottom: vs(16) }}>No upcoming tickets.</Text>
        )}

        <Text variant="h3" style={[styles.sectionTitle, { marginTop: vs(24) }]}>Past</Text>
        {tickets.filter(t => t.status !== 'VALID').map(renderTicket)}
        {tickets.filter(t => t.status !== 'VALID').length === 0 && (
          <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ fontStyle: 'italic' }}>No past tickets.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: vs(12),
  },
  backBtn: {
    padding: ms(8),
    marginLeft: ms(-8),
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingBottom: vs(40),
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: vs(16),
  },
  ticketCard: {
    borderRadius: ms(16),
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  ticketTop: {
    padding: ms(20),
  },
  separatorContainer: {
    height: vs(30),
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  dashedLine: {
    borderWidth: 1,
    borderStyle: 'dashed',
    marginHorizontal: ms(24),
  },
  cutout: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  cutoutLeft: {
    left: ms(-15),
  },
  cutoutRight: {
    right: ms(-15),
  },
  ticketBottom: {
    padding: ms(20),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
