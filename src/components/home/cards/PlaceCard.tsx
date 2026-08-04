import { memo } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import type { Place } from '@/types/travel';

type Props = { place: Place; saved?: boolean; onPress?: () => void; onToggleSaved?: () => void };

export const PlaceCard = memo(function PlaceCard({ place, saved = false, onPress, onToggleSaved }: Props) {
  return <AnimatedPressable accessibilityLabel={`Explore ${place.name}, ${place.country}`} onPress={onPress} style={styles.card}>
    <Image source={{ uri: place.image }} style={styles.image} contentFit="cover" transition={300} />
    <AnimatedPressable accessibilityLabel={`${saved ? 'Remove' : 'Save'} ${place.name}`} accessibilityState={{ checked: saved }} onPress={onToggleSaved} style={[styles.heart, saved && styles.heartSaved]}><Icon name={saved ? 'bookmark' : 'heart'} color={colors.white} size={19} /></AnimatedPressable>
    <View style={styles.copy}><Text numberOfLines={1} style={styles.name}>{place.name}</Text><Text style={styles.country}>{place.country}</Text><Text style={styles.rating}><Text style={styles.star}>★ </Text>{place.rating}</Text></View>
  </AnimatedPressable>;
});

const styles=StyleSheet.create({card:{width:164,height:226,borderRadius:radius.md,backgroundColor:colors.surface,overflow:'hidden',...shadows.soft},image:{height:137,width:'100%'},heart:{position:'absolute',right:spacing.xs,top:spacing.xs,width:34,height:34,borderRadius:radius.pill,backgroundColor:'rgba(5,20,15,.52)',alignItems:'center',justifyContent:'center'},heartSaved:{backgroundColor:colors.gold},copy:{padding:spacing.sm},name:{...typography.label,color:colors.ink},country:{...typography.caption,color:colors.muted,marginTop:spacing.xxs},rating:{...typography.caption,color:colors.ink,marginTop:spacing.xs},star:{color:colors.gold}});