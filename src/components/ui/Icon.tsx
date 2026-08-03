import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import type { IconName } from '../../types/travel';
import { colors } from '../../theme';
type Props={name:IconName;size?:number;color?:string;strokeWidth?:number};
export function Icon({name,size=24,color=colors.ink,strokeWidth=1.8}:Props){
 const p:{[K in IconName]?:string}={menu:'M4 7h16M4 12h16M4 17h16',search:'M20 20l-4.4-4.4M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4',tune:'M4 7h10M18 7h2M4 17h3M11 17h9M14 4v6M7 14v6',compass:'M16.5 7.5l-3 6-6 3 3-6 6-3z',mountain:'M3 19l6-12 4 7 2-3 6 8H3z',walk:'M13 5a2 2 0 1 0 0-4 2 2 0 0 0 4M10 21l2-7 3 3 2 4M12 8l-3 5-4-2M14 8l3 4 3-1',city:'M5 21V8h6v13M11 21V3h8v18M7 11h2M7 15h2M14 7h2M14 11h2M14 15h2',sun:'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1',more:'M5 12h.01M12 12h.01M19 12h.01',heart:'M12 21S3 15.5 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5C21 15.5 12 21 12 21z',pin:'M12 21s6-6.2 6-12a6 6 0 1 0-12 0c0 5.8 6 12 6 12z',arrow:'M5 12h14M14 7l5 5-5 5',home:'M3 11l9-8 9 8M5 10v11h14V10M9 21v-7h6v7',explore:'M9 20H5a2 2 0 0 1-2-2v-3a6 6 0 0 1 12 0v3a2 2 0 0 1-2 2H9zM15 15a6 6 0 0 1 6 6',profile:'M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21a8 8 0 0 1 16 0',sparkle:'M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z'};
 return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d={p[name]} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>{name==='pin'&&<Circle cx="12" cy="9" r="2" stroke={color}/>}</Svg>;
}
