import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { TicketStatus } from '../../types/ticket';
import { MOCK_TICKETS } from '../../data/tickets/mockTicketData';

type ScanState = 'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR_USED' | 'ERROR_EXPIRED' | 'ERROR_INVALID';

export const ScannerScreen = ({ navigation }: any) => {
  const theme = useTheme();
  
  const [scanState, setScanState] = useState<ScanState>('IDLE');
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  
  // Laser Animation
  const [laserAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    startLaserAnimation();
  }, []);

  const startLaserAnimation = () => {
    laserAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  const translateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, ms(240)] // Height of the scanner box
  });

  // Mock Scanning Action
  const simulateScan = (type: ScanState) => {
    setScanState('SCANNING');
    
    setTimeout(() => {
      if (type === 'SUCCESS') setScannedTicket(MOCK_TICKETS[0]);
      if (type === 'ERROR_USED') setScannedTicket(MOCK_TICKETS[2]);
      if (type === 'ERROR_EXPIRED') setScannedTicket(MOCK_TICKETS[3]);
      
      setScanState(type);
    }, 1500);
  };

  const renderScannerOverlay = () => {
    if (scanState !== 'IDLE' && scanState !== 'SCANNING') return null;

    return (
      <View style={styles.scannerBox}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
        
        <Animated.View style={[styles.laser, { transform: [{ translateY }] }]} />
      </View>
    );
  };

  const renderResult = () => {
    if (scanState === 'IDLE' || scanState === 'SCANNING') return null;

    let icon = 'check-circle';
    let color = '#34C759'; // Success green
    let title = 'Valid Ticket';
    let message = 'Gate 4 Entry Authorized';

    if (scanState === 'ERROR_USED') {
      icon = 'alert-circle';
      color = '#FF9500';
      title = 'Already Used';
      message = 'This ticket was scanned 2 hours ago.';
    } else if (scanState === 'ERROR_EXPIRED') {
      icon = 'clock-alert';
      color = '#8E8E93';
      title = 'Ticket Expired';
      message = 'This ticket is no longer valid.';
    } else if (scanState === 'ERROR_INVALID') {
      icon = 'close-circle';
      color = '#FF3B30';
      title = 'Invalid Ticket';
      message = 'QR Code not recognized in system.';
    }

    return (
      <View style={styles.resultContainer}>
        <MaterialCommunityIcons name={icon as any} size={ms(80)} color={color} />
        <Text variant="h2" style={{ fontWeight: 'bold', color, marginTop: vs(16) }}>{title}</Text>
        <Text variant="body1" style={{ color: '#FFF', marginTop: vs(8), textAlign: 'center' }}>{message}</Text>
        
        {scannedTicket && (
          <View style={styles.ticketInfo}>
            <Text variant="body1" style={{ color: '#FFF', fontWeight: 'bold' }}>{scannedTicket.title}</Text>
            <Text variant="body2" style={{ color: '#CCC' }}>Booking: {scannedTicket.bookingRef}</Text>
            <Text variant="body2" style={{ color: '#CCC' }}>Persons: {scannedTicket.persons}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: color, marginTop: vs(40) }]}
          onPress={() => {
            setScanState('IDLE');
            setScannedTicket(null);
          }}
        >
          <Text variant="body1" style={{ fontWeight: 'bold', color: '#FFF' }}>Scan Next Ticket</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mock Camera Background */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.mockCamera}>
          <MaterialCommunityIcons name="camera" size={ms(48)} color="rgba(255,255,255,0.2)" />
          <Text variant="body1" style={{ color: 'rgba(255,255,255,0.5)', marginTop: vs(16) }}>Camera Active</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="close" size={ms(28)} color="#FFF" />
        </TouchableOpacity>
        <Text variant="h3" style={{ color: '#FFF', fontWeight: 'bold' }}>Scan E-Pass</Text>
        <View style={{ width: ms(44) }} />
      </View>

      <View style={styles.content}>
        {renderScannerOverlay()}
        {renderResult()}
      </View>

      {/* Admin Mock Controls */}
      {scanState === 'IDLE' && (
        <View style={styles.adminControls}>
          <Text variant="body2" style={{ color: '#FFF', marginBottom: vs(8), textAlign: 'center' }}>Simulate Scan</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#34C759' }]} onPress={() => simulateScan('SUCCESS')}>
              <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold' }}>Valid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#FF3B30' }]} onPress={() => simulateScan('ERROR_INVALID')}>
              <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold' }}>Invalid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#FF9500' }]} onPress={() => simulateScan('ERROR_USED')}>
              <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold' }}>Used</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.simBtn, { backgroundColor: '#8E8E93' }]} onPress={() => simulateScan('ERROR_EXPIRED')}>
              <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold' }}>Expired</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mockCamera: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: vs(16),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backBtn: {
    padding: ms(8),
    marginLeft: ms(-8),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBox: {
    width: ms(240),
    height: ms(240),
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: ms(40),
    height: ms(40),
    borderColor: '#34C759',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  laser: {
    width: '100%',
    height: 2,
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  resultContainer: {
    alignItems: 'center',
    padding: ms(32),
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: ms(24),
    width: '85%',
  },
  ticketInfo: {
    marginTop: vs(24),
    padding: ms(16),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: ms(12),
    width: '100%',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: vs(16),
    paddingHorizontal: ms(32),
    borderRadius: ms(24),
    width: '100%',
    alignItems: 'center',
  },
  adminControls: {
    position: 'absolute',
    bottom: vs(40),
    left: 0,
    right: 0,
    paddingHorizontal: ms(20),
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  simBtn: {
    paddingVertical: vs(12),
    paddingHorizontal: ms(16),
    borderRadius: ms(12),
    alignItems: 'center',
  }
});
