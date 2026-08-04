import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppHeader } from '@/components/ui/AppHeader';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
  avatar: string;
  image: string;
  name: string;
  onExplore: () => void;
  scrollY: SharedValue<number>;
};

export function HeroBanner({ avatar: _avatar, image, name, onExplore, scrollY }: Props) {
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, 420], [0, 100], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-120, 0], [1.25, 1], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <View style={styles.hero}>
      <AnimatedImage source={{ uri: image }} contentFit="cover" transition={500} style={[styles.image, imageStyle]} />
      <View style={styles.wash} />
      <AppHeader absolute />
      <View style={styles.copy}>
        <Text style={styles.hello}>HI, {name.toUpperCase()}! 👋</Text>
        <Text style={styles.headline}>Let’s find your{`\n`}next <Text style={styles.script}>escape</Text></Text>
        <Text style={styles.sub}>Unique places, real experiences,{`\n`}unforgettable memories.</Text>
      </View>
      <AnimatedPressable
        accessibilityHint="Opens destination search and map"
        accessibilityLabel="Search destinations and places"
        onPress={onExplore}
        style={styles.search}
      >
        <View style={styles.searchIcon}><Icon name="search" size={25} /></View>
        <Text numberOfLines={1} style={styles.searchText}>Search destinations, places...</Text>
        <View style={styles.filter}><Icon name="tune" size={23} /></View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 560, overflow: 'hidden', backgroundColor: colors.sand },
  image: { position: 'absolute', top: spacing.none, right: spacing.none, bottom: spacing.none, left: spacing.none, height: 630, width: '100%' },
  wash: { position: 'absolute', top: spacing.none, right: spacing.none, bottom: spacing.none, left: spacing.none, backgroundColor: 'rgba(248,245,239,0.31)' },
  copy: { position: 'absolute', top: 170, left: spacing.xl, right: spacing.xl },
  hello: { ...typography.label, color: colors.gold, marginBottom: spacing.md },
  headline: { ...typography.display, color: colors.ink },
  script: { fontFamily: 'Georgia', fontStyle: 'italic', fontWeight: '400', color: colors.gold },
  sub: { ...typography.body, color: colors.muted, marginTop: spacing.lg },
  search: { position: 'absolute', bottom: 38, left: spacing.lg, right: spacing.lg, height: 68, borderRadius: radius.pill, backgroundColor: colors.forest, flexDirection: 'row', alignItems: 'center', padding: spacing.xs, ...shadows.floating },
  searchIcon: { width: 52, height: 52, borderRadius: radius.pill, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' },
  searchText: { ...typography.body, color: colors.white, flex: 1, marginHorizontal: spacing.md },
  filter: { width: 52, height: 52, borderRadius: radius.pill, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' },
});