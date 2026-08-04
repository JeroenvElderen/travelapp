import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { CollectionCard } from '@/components/home/cards/CollectionCard';
import { FeaturedDestinationCard } from '@/components/home/cards/FeaturedDestinationCard';
import { PlaceCard } from '@/components/home/cards/PlaceCard';
import { HeroBanner } from '@/components/home/hero/HeroBanner';
import { CategoryBar } from '@/components/home/navigation/CategoryBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { categories, collections, featured, heroImage, places, user } from '@/lib/homeData';
import { colors, spacing } from '@/lib/theme';

type Props = { onTabChange?: (tab: string) => void };

export function HomeScreen({ onTabChange }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });
  const visiblePlaces = useMemo(
    () => activeCategory === 'all' || activeCategory === 'more'
      ? places
      : places.filter(place => place.category === activeCategory),
    [activeCategory],
  );
  const sectionTitle = activeCategory === 'all' || activeCategory === 'more'
    ? 'Handpicked for you'
    : categories.find(category => category.id === activeCategory)?.label ?? 'Handpicked for you';
  const openExplore = () => onTabChange?.('Explore');
  const toggleSaved = (id: string) => {
    setSavedPlaceIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <HeroBanner avatar={user.avatar} image={heroImage} name={user.firstName} onExplore={openExplore} scrollY={scrollY} />
        <CategoryBar items={categories} active={activeCategory} onChange={setActiveCategory} />

        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.section}>
          <FeaturedDestinationCard {...featured} onPress={openExplore} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(180)} style={styles.section}>
          <SectionHeader title={sectionTitle} />
          <FlatList
            contentContainerStyle={styles.row}
            data={visiblePlaces}
            horizontal
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PlaceCard
                onPress={openExplore}
                onToggleSaved={() => toggleSaved(item.id)}
                place={item}
                saved={savedPlaceIds.includes(item.id)}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(260)} style={styles.section}>
          <SectionHeader title="Collections" />
          <FlatList
            contentContainerStyle={styles.row}
            data={collections}
            horizontal
            keyExtractor={item => item.id}
            renderItem={({ item }) => <CollectionCard item={item} onPress={openExplore} />}
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>
        <View style={styles.bottomSpace} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.xxl },
  section: { marginTop: spacing.xxl, marginHorizontal: spacing.md },
  row: { gap: spacing.md, paddingBottom: spacing.lg },
  bottomSpace: { height: 110 },
});