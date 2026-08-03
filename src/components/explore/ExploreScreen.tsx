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

      <ExploreMap />

      <View style={styles.placeCard}>
        <View style={styles.handle}/>
        <Image source="https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900" style={styles.cardImage} contentFit="cover"/>
        <View style={styles.rating}><Text style={styles.ratingText}>★ 4.9</Text></View>
        <View style={styles.details}><View style={styles.detailTop}><Text style={styles.eyebrow}>HIDDEN GEM ✣</Text><Icon name="heart" size={28}/></View><Text style={styles.cardTitle}>Amalfi Coast</Text><View style={styles.location}><Icon name="pin" size={17}/><Text style={styles.locationText}>Campania, Italy · 2.4 km</Text></View><Text style={styles.description}>Breathtaking coastal views, colorful villages and crystal clear waters.</Text><View style={styles.tags}><Text style={styles.tag}>⛰ Scenic</Text><Text style={styles.tag}>▣ Photography</Text><Text style={styles.tag}>☀ Beach</Text></View><View style={styles.actions}><AnimatedPressable style={styles.save}><Icon name="bookmark" size={20}/><Text style={styles.saveText}>Save</Text></AnimatedPressable><AnimatedPressable style={styles.explore}><Text style={styles.exploreText}>Explore</Text><Icon name="arrow" color={colors.white}/></AnimatedPressable></View></View>
      </View>
      <BottomNavigation active="Explore" onChange={onTabChange}/>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},header:{backgroundColor:colors.canvas,zIndex:2},headerRow:{height:102,flexDirection:'row',alignItems:'center',paddingHorizontal:spacing.lg},roundDark:{width:48,height:48,borderRadius:24,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center',...shadows.soft},heading:{flex:1,alignItems:'center'},title:{fontFamily:'Georgia',fontWeight:'700',fontSize:34,color:colors.ink},spark:{fontSize:22,color:colors.gold},subtitle:{fontSize:13,color:colors.muted,marginTop:3},avatar:{width:46,height:46,borderRadius:23,borderWidth:2,borderColor:colors.white},search:{height:54,marginHorizontal:spacing.lg,backgroundColor:colors.surface,borderRadius:radius.pill,flexDirection:'row',alignItems:'center',paddingLeft:spacing.md,paddingRight:5,...shadows.soft},input:{flex:1,fontSize:15,color:colors.ink,paddingHorizontal:spacing.md},filter:{width:44,height:44,borderRadius:22,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center'},filters:{gap:10,paddingHorizontal:spacing.lg,paddingVertical:spacing.md},chip:{height:42,paddingHorizontal:17,borderRadius:radius.pill,backgroundColor:colors.surface,flexDirection:'row',gap:8,alignItems:'center',...shadows.soft},chipActive:{backgroundColor:colors.forest},chipText:{...typography.label,color:colors.ink},chipTextActive:{color:colors.white},map:{flex:1,minHeight:310,overflow:'hidden'},placeLabel:{position:'absolute',fontSize:18,color:'#24322D',textShadowColor:colors.white,textShadowRadius:3},seaLabel:{position:'absolute',fontFamily:'Georgia',fontStyle:'italic',fontSize:17,lineHeight:23,textAlign:'center',color:'rgba(255,255,255,.9)'},photoPin:{position:'absolute',alignItems:'center'},pinImage:{width:52,height:52,borderRadius:26,borderWidth:3,borderColor:colors.white},pinTail:{width:0,height:0,borderLeftWidth:7,borderRightWidth:7,borderTopWidth:10,borderLeftColor:'transparent',borderRightColor:'transparent',borderTopColor:'#A89B86',marginTop:-2},heroPin:{position:'absolute',left:'56%',top:'35%',width:52,height:52,borderRadius:26,backgroundColor:colors.gold,borderWidth:3,borderColor:colors.white,alignItems:'center',justifyContent:'center',...shadows.floating},mapActions:{position:'absolute',right:spacing.lg,bottom:spacing.lg,gap:10},mapButton:{width:48,height:48,borderRadius:24,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',...shadows.soft},placeCard:{height:288,marginTop:-15,marginHorizontal:spacing.sm,marginBottom:98,padding:14,paddingTop:20,borderRadius:32,backgroundColor:colors.surface,flexDirection:'row',...shadows.floating},handle:{position:'absolute',top:7,left:'50%',marginLeft:-22,width:44,height:5,borderRadius:3,backgroundColor:'#C4C0B9'},cardImage:{width:'48%',height:'100%',borderRadius:22},rating:{position:'absolute',left:23,top:31,backgroundColor:'rgba(21,36,31,.65)',borderRadius:20,paddingVertical:4,paddingHorizontal:9},ratingText:{color:colors.white,fontSize:12,fontWeight:'700'},details:{flex:1,paddingLeft:15,paddingTop:6},detailTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},eyebrow:{fontSize:12,color:colors.gold,fontWeight:'700'},cardTitle:{...typography.cardTitle,fontSize:25,marginTop:5,color:colors.ink},location:{flexDirection:'row',alignItems:'center',gap:5,marginTop:4},locationText:{fontSize:12,color:colors.muted},description:{fontSize:13,lineHeight:19,color:colors.muted,marginTop:13},tags:{flexDirection:'row',gap:5,marginTop:12},tag:{fontSize:10,color:colors.ink,backgroundColor:'#F2ECE3',paddingHorizontal:7,paddingVertical:7,borderRadius:14},actions:{flex:1,flexDirection:'row',alignItems:'flex-end',gap:8},save:{height:44,paddingHorizontal:14,borderRadius:18,borderWidth:1,borderColor:'#DCCAAF',flexDirection:'row',alignItems:'center',gap:6},saveText:{fontWeight:'600',color:colors.ink},explore:{height:44,flex:1,borderRadius:18,backgroundColor:colors.forest,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},exploreText:{color:colors.white,fontWeight:'600'},
});