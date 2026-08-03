import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const filters = ['For you', 'Oddities', 'Nature', 'History', 'Food'];

const discoveries = [
  {
    id: 'door-to-hell',
    eyebrow: 'OTHERWORLDLY PLACE',
    title: 'The Door to Hell',
    location: 'Darvaza, Turkmenistan',
    distance: '6,014 km away',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=88',
    accent: '#F26B3A',
  },
  {
    id: 'ice-cave',
    eyebrow: 'NATURAL WONDER',
    title: 'Crystal Ice Cave',
    location: 'Vatnajökull, Iceland',
    distance: '1,842 km away',
    image:
      'https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&w=1200&q=88',
    accent: '#6CB8C7',
  },
  {
    id: 'forgotten-city',
    eyebrow: 'LOST HISTORY',
    title: 'The Forgotten City',
    location: 'Petra, Jordan',
    distance: '3,426 km away',
    image:
      'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?auto=format&fit=crop&w=1200&q=88',
    accent: '#D99A60',
  },
];

const quickActions = [
  { icon: '⌖', label: 'Near me', detail: '42 places' },
  { icon: '◫', label: 'Map', detail: 'Explore freely' },
  { icon: '✦', label: 'Surprise me', detail: 'Go anywhere' },
];

export default function App() {
  const [activeFilter, setActiveFilter] = useState('For you');
  const [saved, setSaved] = useState<string[]>([]);

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.wordmark}>EXPLORI<Text style={styles.wordmarkAccent}>X</Text>A</Text>
            <Text style={styles.tagline}>THE WORLD IS STRANGER THAN YOU THINK</Text>
          </View>
          <TouchableOpacity accessibilityLabel="Open your profile" style={styles.avatar}>
            <Text style={styles.avatarText}>E</Text>
            <View style={styles.avatarDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <View>
              <Text style={styles.searchLabel}>Search the unexplored</Text>
              <Text style={styles.searchHint}>Places, stories, curiosities...</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Open filters" style={styles.filterButton}>
            <Text style={styles.filterIcon}>≡</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.heroCard}>
          <Image
            source="https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=1400&q=90"
            contentFit="cover"
            transition={300}
            style={styles.fill}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopLine}>
            <View style={styles.editorsBadge}><Text style={styles.editorsBadgeText}>EDITOR'S FIELD NOTE</Text></View>
            <Text style={styles.issue}>NO. 017</Text>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroKicker}>A SECRET WORLD BENEATH PARIS</Text>
            <Text style={styles.heroTitle}>The city below{`\n`}the city.</Text>
            <Text style={styles.heroCopy}>Descend into 300 kilometres of tunnels, hidden rooms and forgotten stories.</Text>
            <TouchableOpacity style={styles.readButton}>
              <Text style={styles.readButtonText}>READ THE STORY</Text>
              <Text style={styles.readArrow}>→</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroPage}>01 / 05</Text>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.label} activeOpacity={0.8} style={styles.quickCard}>
              <Text style={styles.quickIcon}>{action.icon}</Text>
              <Text style={styles.quickLabel}>{action.label}</Text>
              <Text style={styles.quickDetail}>{action.detail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>CURATED FOR THE CURIOUS</Text>
            <Text style={styles.sectionTitle}>Remarkable places</Text>
          </View>
          <TouchableOpacity><Text style={styles.viewAll}>VIEW ALL  ↗</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discoveryList}>
          {discoveries.map((item) => {
            const isSaved = saved.includes(item.id);
            return (
              <TouchableOpacity key={item.id} activeOpacity={0.9} style={styles.discoveryCard}>
                <View style={styles.discoveryImageWrap}>
                  <Image source={item.image} contentFit="cover" transition={250} style={styles.fill} />
                  <View style={styles.imageShade} />
                  <View style={[styles.categoryFlag, { backgroundColor: item.accent }]}>
                    <Text style={styles.categoryFlagText}>{item.eyebrow}</Text>
                  </View>
                  <TouchableOpacity
                    accessibilityLabel={isSaved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
                    onPress={() => toggleSaved(item.id)}
                    style={[styles.saveButton, isSaved && styles.saveButtonActive]}
                  >
                    <Text style={[styles.saveIcon, isSaved && styles.saveIconActive]}>{isSaved ? '♥' : '♡'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.discoveryBody}>
                  <Text style={styles.discoveryTitle}>{item.title}</Text>
                  <Text style={styles.discoveryLocation}>⌖  {item.location}</Text>
                  <View style={styles.cardDivider} />
                  <View style={styles.cardFooter}>
                    <Text style={styles.distance}>{item.distance}</Text>
                    <Text style={styles.cardArrow}>↗</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.challengeCard}>
          <View style={styles.challengeStamp}><Text style={styles.challengeStampText}>7</Text></View>
          <View style={styles.challengeCopy}>
            <Text style={styles.challengeEyebrow}>WEEKLY FIELD CHALLENGE</Text>
            <Text style={styles.challengeTitle}>Find seven hidden wonders nearby</Text>
            <Text style={styles.challengeProgress}>2 of 7 discovered  ·  5 days left</Text>
            <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          </View>
          <Text style={styles.challengeArrow}>›</Text>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        {[
          ['◈', 'Discover'],
          ['⌖', 'Nearby'],
          ['◉', 'Field log'],
          ['♧', 'Saved'],
        ].map(([icon, label], index) => (
          <TouchableOpacity key={label} style={styles.tab}>
            <Text style={[styles.tabIcon, index === 0 && styles.tabActive]}>{icon}</Text>
            <Text style={[styles.tabLabel, index === 0 && styles.tabActive]}>{label}</Text>
            {index === 0 && <View style={styles.activeMark} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#12221F' },
  content: { paddingBottom: 112, backgroundColor: '#F4F0E7' },
  topBar: { backgroundColor: '#12221F', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordmark: { color: '#F5F0E5', fontSize: 25, fontWeight: '900', letterSpacing: 3 },
  wordmarkAccent: { color: '#ED6B3B' },
  tagline: { color: '#80928C', fontSize: 7, fontWeight: '800', letterSpacing: 1.55, marginTop: 5 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#5A6D66', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#F4EFE5', fontSize: 14, fontWeight: '800' },
  avatarDot: { position: 'absolute', right: 0, bottom: 1, width: 9, height: 9, borderRadius: 5, backgroundColor: '#ED6B3B', borderWidth: 2, borderColor: '#12221F' },
  searchRow: { backgroundColor: '#12221F', paddingHorizontal: 20, paddingBottom: 18, flexDirection: 'row', gap: 10 },
  searchBox: { height: 58, flex: 1, borderRadius: 4, backgroundColor: '#F4F0E7', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  searchIcon: { fontSize: 27, color: '#1B302C', marginRight: 11, marginTop: -4 },
  searchLabel: { color: '#18302B', fontSize: 13, fontWeight: '800' },
  searchHint: { color: '#7E8B86', fontSize: 9, marginTop: 3 },
  filterButton: { width: 58, height: 58, borderRadius: 4, backgroundColor: '#ED6B3B', alignItems: 'center', justifyContent: 'center' },
  filterIcon: { color: '#FFFFFF', fontSize: 25, transform: [{ rotate: '90deg' }] },
  filters: { paddingHorizontal: 20, paddingVertical: 15, gap: 8, backgroundColor: '#F4F0E7' },
  filterChip: { paddingHorizontal: 16, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#C9C4B9', justifyContent: 'center' },
  filterChipActive: { backgroundColor: '#18332D', borderColor: '#18332D' },
  filterText: { color: '#606A65', fontSize: 11, fontWeight: '700' },
  filterTextActive: { color: '#FAF6ED' },
  heroCard: { marginHorizontal: 14, height: 440, overflow: 'hidden', backgroundColor: '#263B35' },
  fill: { position: 'absolute', inset: 0 },
  heroOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(8,20,17,0.37)' },
  heroTopLine: { position: 'absolute', top: 18, left: 18, right: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editorsBadge: { backgroundColor: '#ED6B3B', paddingHorizontal: 10, paddingVertical: 7 },
  editorsBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  issue: { color: '#E9E4DA', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  heroContent: { position: 'absolute', left: 22, right: 22, bottom: 38 },
  heroKicker: { color: '#F2B08E', fontSize: 9, fontWeight: '900', letterSpacing: 1.7, marginBottom: 10 },
  heroTitle: { color: '#FFFFFF', fontSize: 39, lineHeight: 42, fontWeight: '900', letterSpacing: -1.5 },
  heroCopy: { color: '#E8E3D9', fontSize: 12, lineHeight: 18, maxWidth: 300, marginTop: 12 },
  readButton: { alignSelf: 'flex-start', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#FFFFFF', paddingBottom: 6, flexDirection: 'row', gap: 25 },
  readButtonText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  readArrow: { color: '#FFFFFF', fontSize: 14, marginTop: -4 },
  heroPage: { position: 'absolute', right: 18, bottom: 16, color: '#DBD7CD', fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  quickGrid: { flexDirection: 'row', padding: 14, gap: 8 },
  quickCard: { flex: 1, backgroundColor: '#E7E0D2', minHeight: 108, padding: 13, justifyContent: 'flex-end' },
  quickIcon: { color: '#ED6B3B', fontSize: 23, marginBottom: 13 },
  quickLabel: { color: '#1A302B', fontSize: 12, fontWeight: '900' },
  quickDetail: { color: '#7A817D', fontSize: 8, marginTop: 4 },
  sectionHeader: { paddingHorizontal: 20, marginTop: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionEyebrow: { color: '#D65F35', fontSize: 8, fontWeight: '900', letterSpacing: 1.45, marginBottom: 6 },
  sectionTitle: { color: '#172E29', fontSize: 25, fontWeight: '900', letterSpacing: -0.8 },
  viewAll: { color: '#31463F', fontSize: 8, fontWeight: '900', letterSpacing: 1.2, paddingBottom: 3 },
  discoveryList: { paddingHorizontal: 20, gap: 13 },
  discoveryCard: { width: 250, backgroundColor: '#FFFCF5' },
  discoveryImageWrap: { height: 195, overflow: 'hidden', backgroundColor: '#263D37' },
  imageShade: { position: 'absolute', inset: 0, backgroundColor: 'rgba(10,23,19,0.08)' },
  categoryFlag: { position: 'absolute', left: 0, bottom: 0, paddingHorizontal: 10, paddingVertical: 7 },
  categoryFlagText: { color: '#FFFFFF', fontSize: 7, fontWeight: '900', letterSpacing: 1.1 },
  saveButton: { position: 'absolute', top: 12, right: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(16,32,27,0.7)', alignItems: 'center', justifyContent: 'center' },
  saveButtonActive: { backgroundColor: '#F7F1E7' },
  saveIcon: { color: '#FFFFFF', fontSize: 22, marginTop: -2 },
  saveIconActive: { color: '#ED6B3B' },
  discoveryBody: { padding: 15 },
  discoveryTitle: { color: '#172E29', fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  discoveryLocation: { color: '#69756F', fontSize: 9, fontWeight: '600', marginTop: 7 },
  cardDivider: { height: 1, backgroundColor: '#E5E0D7', marginVertical: 13 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distance: { color: '#8A918D', fontSize: 8, fontWeight: '700' },
  cardArrow: { color: '#D65F35', fontSize: 16 },
  challengeCard: { margin: 20, backgroundColor: '#18332D', padding: 18, flexDirection: 'row', alignItems: 'center' },
  challengeStamp: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#EF7548', alignItems: 'center', justifyContent: 'center' },
  challengeStampText: { color: '#F37A4D', fontSize: 23, fontWeight: '900' },
  challengeCopy: { flex: 1, paddingHorizontal: 14 },
  challengeEyebrow: { color: '#EF8A63', fontSize: 7, fontWeight: '900', letterSpacing: 1.1 },
  challengeTitle: { color: '#FAF5E9', fontSize: 13, fontWeight: '800', marginTop: 5 },
  challengeProgress: { color: '#95A69F', fontSize: 8, marginTop: 5 },
  progressTrack: { height: 3, backgroundColor: '#41564F', marginTop: 9 },
  progressFill: { width: '29%', height: 3, backgroundColor: '#ED6B3B' },
  challengeArrow: { color: '#F4EEE3', fontSize: 27 },
  tabBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, backgroundColor: '#10241F', flexDirection: 'row', paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: '#2F433D' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { color: '#778A83', fontSize: 21, height: 27 },
  tabLabel: { color: '#778A83', fontSize: 8, fontWeight: '800', marginTop: 2 },
  tabActive: { color: '#F07749' },
  activeMark: { position: 'absolute', top: 0, width: 28, height: 2, backgroundColor: '#F07749' },
});
