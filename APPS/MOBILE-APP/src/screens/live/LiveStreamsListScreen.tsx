import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { ms, vs } from '../../utils/responsive';
import { MOCK_LIVE_STREAMS } from '../../data/live/mockLiveData';
import { LiveStream } from '../../types/live';

export const LiveStreamsListScreen = ({ navigation }: any) => {
  const theme = useTheme();

  const renderStreamCard = (stream: LiveStream) => (
    <TouchableOpacity 
      key={stream.id} 
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('LiveStreamDetails', { stream })}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: stream.thumbnailUrl }} style={styles.thumbnail} />
        {stream.state === 'LIVE' && (
          <View style={styles.liveBadge}>
            <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold', fontSize: ms(10) }}>LIVE</Text>
          </View>
        )}
        {stream.state === 'UPCOMING' && (
          <View style={[styles.liveBadge, { backgroundColor: theme.colors.primary }]}>
            <Text variant="body2" style={{ color: '#FFF', fontWeight: 'bold', fontSize: ms(10) }}>UPCOMING</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text variant="body1" style={{ fontWeight: 'bold', marginBottom: vs(4) }} numberOfLines={1}>
          {stream.title}
        </Text>
        <Text variant="body2" color={theme.colors.onSurfaceVariant} numberOfLines={2}>
          {stream.description}
        </Text>
        {stream.scheduledTime && (
          <Text variant="body2" color={theme.colors.primary} style={{ marginTop: vs(8), fontWeight: 'bold' }}>
            {stream.scheduledTime}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={ms(24)} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text variant="h2" style={{ fontWeight: 'bold' }}>All Streams</Text>
        <View style={{ width: ms(40) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text variant="h3" style={styles.sectionTitle}>Live Now</Text>
        {MOCK_LIVE_STREAMS.filter(s => s.state === 'LIVE').map(renderStreamCard)}

        <Text variant="h3" style={[styles.sectionTitle, { marginTop: vs(24) }]}>Upcoming Events</Text>
        {MOCK_LIVE_STREAMS.filter(s => s.state === 'UPCOMING').map(renderStreamCard)}

        <Text variant="h3" style={[styles.sectionTitle, { marginTop: vs(24) }]}>Past Streams</Text>
        {MOCK_LIVE_STREAMS.filter(s => s.state === 'ENDED').map(renderStreamCard)}
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
    paddingHorizontal: ms(16),
    paddingBottom: vs(40),
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: vs(16),
  },
  card: {
    marginBottom: vs(16),
    borderRadius: ms(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: ms(12),
    left: ms(12),
    backgroundColor: '#FF3B30',
    paddingHorizontal: ms(8),
    paddingVertical: vs(4),
    borderRadius: ms(4),
  },
  info: {
    padding: ms(16),
  }
});
