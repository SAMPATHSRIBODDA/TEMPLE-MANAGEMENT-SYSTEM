import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../Text';
import { ms, vs } from '../../utils/responsive';

interface QRFullScreenModalProps {
  visible: boolean;
  onClose: () => void;
  qrUri: string;
  brightnessWarning?: boolean;
}

export const QRFullScreenModal: React.FC<QRFullScreenModalProps> = ({ visible, onClose, qrUri, brightnessWarning }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <MaterialCommunityIcons name="close" size={ms(32)} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.qrContainer}>
          <Image source={{ uri: qrUri }} style={styles.qrImage} />
        </View>

        {brightnessWarning && (
          <View style={styles.warningContainer}>
            <MaterialCommunityIcons name="brightness-6" size={ms(24)} color="#FFF" />
            <Text variant="body1" style={{ color: '#FFF', marginLeft: ms(12) }}>
              Screen brightness increased for easier scanning.
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: vs(60),
    right: ms(20),
    padding: ms(12),
  },
  qrContainer: {
    backgroundColor: '#FFF',
    padding: ms(32),
    borderRadius: ms(24),
  },
  qrImage: {
    width: ms(280),
    height: ms(280),
  },
  warningContainer: {
    position: 'absolute',
    bottom: vs(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(40),
  }
});
