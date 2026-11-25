import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { useBranding } from '../../branding/brandingContext';
import { QRFullScreenModal } from '../../components/tickets/QRFullScreenModal';

export const TicketDetailsScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const { branding } = useBranding();
  const { ticket } = route.params;

  const [isQRModalVisible, setQRModalVisible] = useState(false);

  // Mock QR generation using a placeholder image service for demonstration
  const qrImageUri = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.qrPayload}`;
  const isPast = ticket.status !== 'VALID';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text variant="h3" style={{ fontWeight: 'bold' }}>Ticket Details</Text>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialCommunityIcons name="share-variant" size={ms(24)} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.passCard, { backgroundColor: theme.colors.surface }]}>
          
          {/* Header */}
          <View style={styles.passHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {branding?.logo ? (
                <Image source={{ uri: branding.logo }} style={styles.logo} />
              ) : (
                <View style={[styles.logo, { backgroundColor: theme.colors.primary }]} />
              )}
              <Text variant="h3" style={{ fontWeight: 'bold', marginLeft: ms(12) }}>{branding?.name || 'Temple App'}</Text>
            </View>
          </View>

          {/* Title */}
          <View style={[styles.titleSection, { backgroundColor: isPast ? theme.colors.surfaceVariant : theme.colors.primary }]}>
            <Text variant="h2" style={{ color: isPast ? theme.colors.onSurface : '#FFF', fontWeight: 'bold' }}>{ticket.title}</Text>
            <Text variant="body1" style={{ color: isPast ? theme.colors.onSurfaceVariant : 'rgba(255,255,255,0.8)', marginTop: vs(4) }}>
              Booking Ref: {ticket.bookingRef}
            </Text>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Date</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{ticket.date}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Time</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{ticket.time}</Text>
              </View>
            </View>
            <View style={[styles.gridRow, { marginTop: vs(24) }]}>
              <View style={styles.gridItem}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Persons</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{ticket.persons}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Entry Gate</Text>
                <Text variant="body1" style={{ fontWeight: 'bold' }}>{ticket.gate || 'Main Gate'}</Text>
              </View>
            </View>
          </View>

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <View style={[styles.dashedLine, { borderColor: theme.colors.outline }]} />
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <Text variant="body2" color={theme.colors.onSurfaceVariant} style={{ marginBottom: vs(16) }}>
              Present this QR code at the entry gate
            </Text>
            
            <TouchableOpacity onPress={() => setQRModalVisible(true)} activeOpacity={0.8} style={[styles.qrWrapper, isPast && { opacity: 0.3 }]}>
              <Image source={{ uri: qrImageUri }} style={styles.qrImage} />
            </TouchableOpacity>

            <Text variant="body2" style={{ marginTop: vs(16), fontWeight: 'bold' }}>
              {ticket.qrPayload}
            </Text>

            {isPast && (
              <View style={[styles.statusBadge, { backgroundColor: ticket.status === 'USED' ? '#FF9500' : '#FF3B30' }]}>
                <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold' }}>TICKET {ticket.status}</Text>
              </View>
            )}
          </View>

        </View>

        {/* Bottom Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}>
            <MaterialCommunityIcons name="download-outline" size={ms(24)} color={theme.colors.primary} />
            <Text variant="body2" style={{ fontWeight: 'bold', marginLeft: ms(8) }} color={theme.colors.primary}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}>
            <MaterialCommunityIcons name="star-outline" size={ms(24)} color={theme.colors.primary} />
            <Text variant="body2" style={{ fontWeight: 'bold', marginLeft: ms(8) }} color={theme.colors.primary}>Favorite</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Full Screen QR Modal */}
      <QRFullScreenModal 
        visible={isQRModalVisible} 
        onClose={() => setQRModalVisible(false)} 
        qrUri={qrImageUri}
        brightnessWarning={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: vs(12),
  },
  backBtn: { padding: ms(8) },
  scrollContent: {
    padding: ms(20),
    paddingBottom: vs(40),
  },
  passCard: {
    borderRadius: ms(24),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  passHeader: {
    padding: ms(24),
  },
  logo: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
  },
  titleSection: {
    padding: ms(24),
  },
  detailsGrid: {
    padding: ms(24),
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
  },
  separatorContainer: {
    height: vs(1),
    position: 'relative',
    marginHorizontal: ms(24),
  },
  dashedLine: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  qrSection: {
    padding: ms(32),
    alignItems: 'center',
  },
  qrWrapper: {
    padding: ms(16),
    backgroundColor: '#FFF',
    borderRadius: ms(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrImage: {
    width: ms(200),
    height: ms(200),
  },
  statusBadge: {
    marginTop: vs(16),
    paddingHorizontal: ms(16),
    paddingVertical: vs(6),
    borderRadius: ms(16),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(24),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(16),
    borderRadius: ms(16),
    marginHorizontal: ms(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  }
});
