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
        {items.map((item) => {
          const selected = item.label === active;
          return (
            <AnimatedPressable
              accessibilityLabel={item.accessibilityLabel}
              key={item.label}
              onPress={() => onChange?.(item.label)}
              style={styles.item}
            >
              <View style={[styles.iconShell, selected && styles.iconShellActive]}>
                <Icon name={item.icon} color={selected ? colors.gold : colors.ink} size={24} />
              </View>
              <Text numberOfLines={1} style={[styles.label, selected && styles.active]}>
                {item.label}
              </Text>
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
    height: 82,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    ...shadows.floating,
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  iconShell: {
    width: 38,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShellActive: {
    backgroundColor: '#F3E8D7',
  },
  label: {
    ...typography.caption,
    color: colors.ink,
    fontSize: 11,
  },
  active: {
    color: colors.gold,
    fontWeight: '700',
  },
});
