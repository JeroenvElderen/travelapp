import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import type { IconName } from '@/types/travel';

const items: { label: string; accessibilityLabel: string; icon: IconName }[] = [
  { label: 'Home', accessibilityLabel: 'Home', icon: 'home' },
  { label: 'Explore', accessibilityLabel: 'Explore destinations', icon: 'explore' },
  { label: 'Planner', accessibilityLabel: 'AI trip and relocation planner', icon: 'sparkle' },
  { label: 'Saved', accessibilityLabel: 'Saved places', icon: 'heart' },
  { label: 'Profile', accessibilityLabel: 'Profile', icon: 'profile' },
];

type Props = { active?: string; onChange?: (tab: string) => void };

export function BottomNavigation({ active, onChange }: Props) {
  return (
    <View style={styles.shell}>
      <View style={styles.nav}>
        <View pointerEvents="none" style={styles.highlight} />
        {items.map((item) => {
          const selected = item.label === active;
          const featured = item.label === 'Planner';
          return (
            <AnimatedPressable
              accessibilityLabel={item.accessibilityLabel}
              accessibilityState={{ selected }}
              key={item.label}
              onPress={() => onChange?.(item.label)}
              style={[styles.item, featured && styles.featuredItem]}
            >
              <View
                style={[
                  styles.iconShell,
                  selected && styles.iconShellActive,
                  featured && styles.featuredIconShell,
                  featured && selected && styles.featuredIconShellActive,
                ]}
              >
                <Icon
                  name={item.icon}
                  color={featured ? colors.white : selected ? colors.forest : colors.muted}
                  size={featured ? 25 : 23}
                  strokeWidth={selected ? 2.2 : 1.8}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[styles.label, selected && styles.active, featured && styles.featuredLabel]}
              >
                {item.label}
              </Text>
              {selected && <View style={[styles.indicator, featured && styles.featuredIndicator]} />}
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    zIndex: 10,
  },
  nav: {
    height: 78,
    borderRadius: 26,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(20, 54, 42, 0.08)',
    overflow: 'visible',
    ...shadows.floating,
  },
  highlight: {
    position: 'absolute',
    top: 1,
    left: radius.lg,
    right: radius.lg,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  item: {
    flex: 1,
    height: '100%',
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  featuredItem: {
    paddingBottom: spacing.xxs,
  },
  iconShell: {
    width: 42,
    height: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShellActive: {
    backgroundColor: '#E9F0E9',
  },
  featuredIconShell: {
    width: 52,
    height: 52,
    marginTop: -22,
    borderRadius: radius.pill,
    backgroundColor: colors.forest,
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 9,
  },
  featuredIconShellActive: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.32,
  },
  label: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  featuredLabel: {
    color: colors.forest,
    fontWeight: '700',
  },
  active: {
    color: colors.forest,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 6,
    width: 16,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  featuredIndicator: {
    bottom: 5,
    width: 20,
  },
});
