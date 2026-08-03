import {
  ArrowRight, Building2, Compass, Ellipsis, Footprints, Heart, House,
  MapPin, Menu, Mountain, Navigation, Search, SlidersHorizontal, Sparkles,
  Sun, UserRound, type LucideIcon,
} from 'lucide-react-native';
import type { IconName } from '../../types/travel';
import { colors } from '../../theme';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

const icons: Record<IconName, LucideIcon> = {
  menu: Menu,
  search: Search,
  tune: SlidersHorizontal,
  compass: Compass,
  mountain: Mountain,
  walk: Footprints,
  city: Building2,
  sun: Sun,
  more: Ellipsis,
  heart: Heart,
  pin: MapPin,
  arrow: ArrowRight,
  home: House,
  explore: Navigation,
  profile: UserRound,
  sparkle: Sparkles,
};

export function Icon({ name, size = 24, color = colors.ink, strokeWidth = 1.8 }: Props) {
  const LucideIconComponent = icons[name];
  return <LucideIconComponent color={color} size={size} strokeWidth={strokeWidth} />;
}