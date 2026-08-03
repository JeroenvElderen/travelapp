import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { user } from '@/lib/homeData';
import { colors, shadows, spacing } from '@/lib/theme';

type Props = {
  absolute?: boolean;
  light?: boolean;
};

/** The single, shared app header used on every top-level screen. */
export function AppHeader({ absolute = false, light = false }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, absolute && styles.absolute, { paddingTop: insets.top + spacing.sm }]}>
      <AnimatedPressable accessibilityLabel="Open menu" style={styles.menu}>
        <Icon name="menu" color={colors.white} />
      </AnimatedPressable>
      <View style={styles.brand} accessibilityLabel="Explorixa">
        <Icon name="mountain" color={colors.gold} size={34} />
        <Text style={[styles.brandName, light && styles.brandNameLight]}>Explorixa <Text style={styles.gold}>✦</Text></Text>
      </View>
      <View>
        <Image source={user.avatar} style={styles.avatar} contentFit="cover" />
        <View style={styles.avatarDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 96,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  absolute: { position: 'absolute', top: 0, left: 0, right: 0 },
  menu: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  brand: { alignItems: 'center' },
  brandName: { marginTop: -spacing.sm, fontFamily: 'Georgia', fontSize: 29, fontWeight: '700', color: colors.ink },
  brandNameLight: { color: colors.white },
  gold: { color: colors.gold, fontSize: 20 },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.white },
  avatarDot: { position: 'absolute', right: -1, top: -1, width: 13, height: 13, borderRadius: 7, backgroundColor: colors.gold, borderWidth: 2, borderColor: colors.white },
});