import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

import { colors } from '@/lib/theme';
import type { IconName } from '@/types/travel';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };
type GlyphProps = Required<Pick<Props, 'color' | 'strokeWidth'>>;

function Glyph({ name, color, strokeWidth }: GlyphProps & { name: IconName }) {
  const common = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (name) {
    case 'menu': return <><Line x1="4" y1="7" x2="20" y2="7" {...common}/><Line x1="4" y1="12" x2="20" y2="12" {...common}/><Line x1="4" y1="17" x2="20" y2="17" {...common}/></>;
    case 'search': return <><Circle cx="11" cy="11" r="7" fill="none" {...common}/><Line x1="16" y1="16" x2="21" y2="21" {...common}/></>;
    case 'tune': return <><Line x1="4" y1="7" x2="20" y2="7" {...common}/><Circle cx="9" cy="7" r="2" fill={color}/><Line x1="4" y1="17" x2="20" y2="17" {...common}/><Circle cx="15" cy="17" r="2" fill={color}/></>;
    case 'heart': return <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" fill="none" {...common}/>;
    case 'pin': return <><Path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" fill="none" {...common}/><Circle cx="12" cy="10" r="2.5" fill="none" {...common}/></>;
    case 'arrow': return <><Line x1="5" y1="12" x2="19" y2="12" {...common}/><Polyline points="14 7 19 12 14 17" fill="none" {...common}/></>;
    case 'home': return <><Path d="m3 11 9-8 9 8" fill="none" {...common}/><Path d="M5 10v11h14V10M9 21v-7h6v7" fill="none" {...common}/></>;
    case 'profile': return <><Circle cx="12" cy="8" r="4" fill="none" {...common}/><Path d="M4 21a8 8 0 0 1 16 0" fill="none" {...common}/></>;
    case 'more': return <><Circle cx="5" cy="12" r="1.5" fill={color}/><Circle cx="12" cy="12" r="1.5" fill={color}/><Circle cx="19" cy="12" r="1.5" fill={color}/></>;
    case 'sun': return <><Circle cx="12" cy="12" r="4" fill="none" {...common}/><Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" {...common}/></>;
    case 'mountain': return <><Polyline points="2 20 9 7 13 13 16 9 22 20" fill="none" {...common}/><Polyline points="7 11 9 13 11 11" fill="none" {...common}/></>;
    case 'city': return <><Rect x="4" y="5" width="7" height="16" fill="none" {...common}/><Rect x="11" y="9" width="9" height="12" fill="none" {...common}/><Path d="M7 9h1M7 13h1M7 17h1M15 13h1M15 17h1" {...common}/></>;
    case 'walk': return <><Circle cx="13" cy="4" r="2" fill="none" {...common}/><Path d="m10 21 2-7 3 2 2 5M7 12l3-4 4 2 3 3M9 21l-2-5" fill="none" {...common}/></>;
    case 'explore': return <><Circle cx="12" cy="12" r="9" fill="none" {...common}/><Path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" fill="none" {...common}/></>;
    case 'compass': return <><Circle cx="12" cy="12" r="9" fill="none" {...common}/><Path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" fill="none" {...common}/></>;
    case 'sparkle': return <><Path d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z" fill="none" {...common}/><Path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" fill="none" {...common}/></>;
  }
}

export function Icon({ name, size = 24, color = colors.ink, strokeWidth = 1.8 }: Props) {
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Glyph name={name} color={color} strokeWidth={strokeWidth}/></Svg>;
}
