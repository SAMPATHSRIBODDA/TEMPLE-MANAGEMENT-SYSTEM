import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { MockVideoPlayer } from '../../components/live/MockVideoPlayer';
import { useBranding } from '../../branding/brandingContext';

export const LiveStreamDetailsScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const { branding } = useBranding();
  const { stream } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      {/* Top Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text variant="h3" style={{ fontWeight: 'bold' }}>Live & Darshan</Text>
        <View style={{ width: ms(40) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Video Player */}
        <MockVideoPlayer stream={stream} />

        {/* Stream Details */}
        <View style={styles.detailsContainer}>
          <Text variant="h2" style={{ fontWeight: 'bold', marginBottom: vs(8) }}>{stream.title}</Text>
          <Text variant="body1" color={theme.colors.onSurfaceVariant} style={{ marginBottom: vs(16) }}>
            {stream.description}
          </Text>

          <View style={styles.actionRow}>
            <View style={styles.channelInfo}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]} />
              <Text variant="body1" style={{ fontWeight: 'bold', marginLeft: ms(8) }}>{branding?.name || 'Temple Official'}</Text>
            </View>
            
            <TouchableOpacity style={[styles.donateBtn, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="gift-outline" size={ms(18)} color="#FFF" />
              <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold', marginLeft: ms(4) }}>Donate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Chat Placeholder */}
        <View style={styles.chatSection}>
          <View style={styles.chatHeader}>
            <Text variant="h3" style={{ fontWeight: 'bold' }}>Live Chat</Text>
            <Text variant="body2" color={theme.colors.onSurfaceVariant}>Top Chat</Text>
          </View>
          
          <View style={[styles.chatBox, { backgroundColor: theme.colors.surfaceVariant }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: ms(12) }}>
              {/* Mock Chat Messages */}
              <View style={styles.chatMessage}>
                <Text variant="body2" style={{ fontWeight: 'bold', marginRight: ms(8) }} color={theme.colors.primary}>Ramesh K.</Text>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Om Namah Shivaya 🙏</Text>
              </View>
              <View style={styles.chatMessage}>
                <Text variant="body2" style={{ fontWeight: 'bold', marginRight: ms(8) }} color={theme.colors.primary}>Sita V.</Text>
                <Text variant="body2" color={theme.colors.onSurfaceVariant}>Beautiful Darshan today.</Text>
              </View>
              <View style={styles.chatMessage}>
                <Text variant="body2" style={{ fontWeight: 'bold', marginRight: ms(8) }} color={theme.colors.primary}>Temple Admin</Text>
                <Text variant="body2" color="#FF3B30">Welcome to the live stream. Please maintain decorum.</Text>
              </View>
            </ScrollView>
          </View>

          {/* Chat Input */}
          <View style={styles.chatInputContainer}>
            <TextInput 
              style={[styles.chatInput, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.onSurface }]}
              placeholder="Chat publicly..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            <TouchableOpacity style={styles.sendBtn}>
              <MaterialCommunityIcons name="send" size={ms(24)} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

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
    paddingBottom: vs(40),
  },
  detailsContainer: {
    padding: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
  },
  donateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
  },
  chatSection: {
    padding: ms(16),
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  chatBox: {
    height: vs(250),
    borderRadius: ms(12),
    marginBottom: vs(12),
  },
  chatMessage: {
    flexDirection: 'row',
    marginBottom: vs(8),
    flexWrap: 'wrap',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: vs(48),
    borderRadius: ms(24),
    paddingHorizontal: ms(16),
  },
  sendBtn: {
    padding: ms(12),
  }
});
