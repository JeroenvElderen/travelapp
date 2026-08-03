import { useState } from 'react';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExploreMap } from '@/components/explore/ExploreMap';
import { BottomNavigation } from '@/components/home/navigation/BottomNavigation';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import type { ExplorePlace } from '@/lib/explorePlaces';
import type { IconName } from '@/types/travel';

const filters: { label: string; icon: IconName }[] = [
  { label: 'All', icon: 'compass' }, { label: 'Hidden Gems', icon: 'sparkle' },
  { label: 'Nature', icon: 'mountain' }, { label: 'Beaches', icon: 'sun' },
  { label: 'Culture', icon: 'city' },
];

type Props = { onTabChange?: (tab: string) => void };

export function ExploreScreen({ onTabChange }: Props) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState<ExplorePlace | null>(null);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable accessibilityLabel="Open menu" style={styles.roundDark}><Icon name="menu" color={colors.white} /></AnimatedPressable>
          <View style={styles.heading}><Text style={styles.title}>Explore<Text style={styles.spark}>✦</Text></Text><Text style={styles.subtitle}>Discover hidden gems around the world</Text></View>
          <Image source="https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200" style={styles.avatar} contentFit="cover" />
        </View>
        <View style={styles.search}><Icon name="search" size={25} /><TextInput accessibilityLabel="Search destinations" placeholder="Search places, activities, or destinations..." placeholderTextColor="#717875" style={styles.input}/><AnimatedPressable accessibilityLabel="Open filters" style={styles.filter}><Icon name="tune" color={colors.white}/></AnimatedPressable></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map(item => { const active = item.label === activeFilter; return <AnimatedPressable key={item.label} onPress={() => setActiveFilter(item.label)} style={[styles.chip, active && styles.chipActive]}><Icon name={item.icon} size={20} color={active ? colors.white : colors.gold}/><Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text></AnimatedPressable>; })}
        </ScrollView>
      </View>

      <ExploreMap onSelectPlace={setSelectedPlace} />

      {selectedPlace && <View style={styles.placeCard} accessibilityLabel={`Details for ${selectedPlace.name}`}>
        <View style={styles.handle}/>
        <Image source={selectedPlace.image} style={styles.cardImage} contentFit="cover"/>
        <View style={styles.rating}><Text style={styles.ratingText}>★ {selectedPlace.rating}</Text></View>
        <View style={styles.details}><View style={styles.detailTop}><Text style={styles.eyebrow}>REAL PLACE ✣</Text><AnimatedPressable accessibilityLabel="Close place details" onPress={() => setSelectedPlace(null)}><Text style={styles.close}>×</Text></AnimatedPressable></View><Text style={styles.cardTitle}>{selectedPlace.name}</Text><View style={styles.location}><Icon name="pin" size={17}/><Text style={styles.locationText}>{selectedPlace.region} · {selectedPlace.distance}</Text></View><Text style={styles.description}>{selectedPlace.description}</Text><View style={styles.tags}>{selectedPlace.tags.slice(0, 3).map(tag => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View><View style={styles.actions}><AnimatedPressable style={styles.save}><Icon name="bookmark" size={20}/><Text style={styles.saveText}>Save</Text></AnimatedPressable><AnimatedPressable style={styles.explore}><Text style={styles.exploreText}>Explore</Text><Icon name="arrow" color={colors.white}/></AnimatedPressable></View></View>
      </View>}
      <BottomNavigation active="Explore" onChange={onTabChange}/>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},header:{backgroundColor:colors.canvas,zIndex:2},headerRow:{height:92,flexDirection:'row',alignItems:'center',paddingHorizontal:spacing.lg},roundDark:{width:48,height:48,borderRadius:24,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center',...shadows.soft},heading:{flex:1,alignItems:'center'},title:{fontFamily:'Georgia',fontWeight:'700',fontSize:34,color:colors.ink},spark:{fontSize:22,color:colors.gold},subtitle:{fontSize:13,color:colors.muted,marginTop:3},avatar:{width:46,height:46,borderRadius:23,borderWidth:2,borderColor:colors.white},search:{height:54,marginHorizontal:spacing.lg,backgroundColor:colors.surface,borderRadius:radius.pill,flexDirection:'row',alignItems:'center',paddingLeft:spacing.md,paddingRight:5,...shadows.soft},input:{flex:1,fontSize:15,color:colors.ink,paddingHorizontal:spacing.md},filter:{width:44,height:44,borderRadius:22,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center'},filters:{gap:10,paddingHorizontal:spacing.lg,paddingVertical:spacing.sm},chip:{height:42,paddingHorizontal:17,borderRadius:radius.pill,backgroundColor:colors.surface,flexDirection:'row',gap:8,alignItems:'center',...shadows.soft},chipActive:{backgroundColor:colors.forest},chipText:{...typography.label,color:colors.ink},chipTextActive:{color:colors.white},placeCard:{position:'absolute',left:spacing.sm,right:spacing.sm,bottom:112,height:260,padding:14,paddingTop:20,borderRadius:32,backgroundColor:colors.surface,flexDirection:'row',zIndex:4,...shadows.floating},handle:{position:'absolute',top:7,left:'50%',marginLeft:-22,width:44,height:5,borderRadius:3,backgroundColor:'#C4C0B9'},cardImage:{width:'43%',height:'100%',borderRadius:22},rating:{position:'absolute',left:23,top:31,backgroundColor:'rgba(21,36,31,.65)',borderRadius:20,paddingVertical:4,paddingHorizontal:9},ratingText:{color:colors.white,fontSize:12,fontWeight:'700'},details:{flex:1,paddingLeft:15,paddingTop:2},detailTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},eyebrow:{fontSize:12,color:colors.gold,fontWeight:'700'},close:{fontSize:30,lineHeight:30,color:colors.muted,paddingHorizontal:4},cardTitle:{...typography.cardTitle,fontSize:23,marginTop:2,color:colors.ink},location:{flexDirection:'row',alignItems:'center',gap:5,marginTop:3},locationText:{flex:1,fontSize:11,color:colors.muted},description:{fontSize:12,lineHeight:17,color:colors.muted,marginTop:8},tags:{flexDirection:'row',gap:4,marginTop:8},tag:{fontSize:9,color:colors.ink,backgroundColor:'#F2ECE3',paddingHorizontal:6,paddingVertical:5,borderRadius:14},actions:{flex:1,flexDirection:'row',alignItems:'flex-end',gap:8},save:{height:40,paddingHorizontal:10,borderRadius:18,borderWidth:1,borderColor:'#DCCAAF',flexDirection:'row',alignItems:'center',gap:5},saveText:{fontWeight:'600',color:colors.ink},explore:{height:40,flex:1,borderRadius:18,backgroundColor:colors.forest,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},exploreText:{color:colors.white,fontWeight:'600'},
});