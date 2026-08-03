import { useState } from 'react';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';


import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { AppHeader } from '@/components/ui/AppHeader';
import { savedCollections, savedExperiences, savedPlaces } from '@/lib/savedData';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

type Props = { onTabChange?: (tab: string) => void };
const tabs = [{ label: 'All', count: 56 }, { label: 'Places', count: 32 }, { label: 'Collections', count: 6 }, { label: 'Experiences', count: 18 }];

export function SavedScreen({ onTabChange }: Props) {
  const [active, setActive] = useState('All');
  return <View style={styles.root}>
    <StatusBar style="dark" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: 130 }]}>
      <AppHeader />
      <Text style={styles.title}>Saved <Text style={styles.gold}>✦</Text></Text><Text style={styles.subtitle}>All the places you love in one place.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>{tabs.map(tab => <AnimatedPressable key={tab.label} onPress={() => setActive(tab.label)} style={[styles.tab, active === tab.label && styles.tabActive]}><Icon name={tab.label === 'All' ? 'bookmark' : tab.label === 'Places' ? 'pin' : tab.label === 'Collections' ? 'folder' : 'sparkle'} size={19} color={active === tab.label ? colors.white : colors.ink}/><Text style={[styles.tabLabel, active === tab.label && styles.tabLabelActive]}>{tab.label}</Text><Text style={[styles.tabCount, active === tab.label && styles.tabLabelActive]}>{tab.count}</Text></AnimatedPressable>)}</ScrollView>

      <SectionTitle title="Saved places" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>{savedPlaces.map(place => <View key={place.id} style={styles.place}><Image source={place.image} style={styles.placeImage}/><AnimatedPressable accessibilityLabel={`Remove ${place.name} from saved`} style={styles.heart}><Icon name="heart" color={colors.white} size={21}/></AnimatedPressable><View style={styles.placeInfo}><Text style={styles.cardTitle}>{place.name}</Text><Text style={styles.muted}>{place.country}</Text><Text style={styles.rating}><Text style={styles.gold}>★</Text> {place.rating}</Text><Text style={styles.badge}>{place.category}</Text></View></View>)}</ScrollView>

      <SectionTitle title="My collections" />
      <View style={styles.collectionRow}>{savedCollections.map(item => <View key={item.id} style={styles.collection}><Image source={item.image} style={styles.collectionImage}/><View style={styles.folder}><Icon name="folder" color={colors.white}/></View><View style={styles.collectionInfo}><View><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.muted}>{item.count} places</Text></View><Icon name="more"/></View></View>)}</View>

      <SectionTitle title="Saved experiences" />
      <View style={styles.experiences}>{savedExperiences.map((item, index) => <View key={item.id} style={[styles.experience, index > 0 && styles.experienceBorder]}><Image source={item.image} style={styles.experienceImage}/><View style={styles.experienceInfo}><Text style={styles.experienceTitle}>{item.title}</Text><Text style={styles.muted}>{item.country}</Text><View style={styles.meta}><Text style={styles.metaText}>◷ {item.duration}</Text><Text style={styles.metaText}>♙ {item.group}</Text><Text style={styles.metaText}>◇ From ${item.price}</Text></View></View><AnimatedPressable accessibilityLabel={`Remove ${item.title} from saved`} style={styles.bookmark}><Icon name="bookmark" size={20}/></AnimatedPressable><Icon name="more"/></View>)}</View>
    </ScrollView>
  </View>;
}

function SectionTitle({ title }: { title: string }) { return <View style={styles.sectionTitle}><Text style={styles.sectionText}>{title}</Text><AnimatedPressable accessibilityLabel={`See all ${title}`} style={styles.seeAll}><Text style={styles.seeAllText}>See all</Text><Icon name="arrow" size={20}/></AnimatedPressable></View>; }

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},content:{paddingBottom:130},top:{height:92,paddingHorizontal:spacing.lg,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},menu:{width:48,height:48,borderRadius:24,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center',...shadows.soft},brand:{alignItems:'center'},brandMark:{height:21,fontFamily:'Georgia',fontSize:26,lineHeight:20,color:colors.gold},brandName:{fontFamily:'Georgia',fontSize:27,fontWeight:'700',color:colors.ink},avatar:{width:48,height:48,borderRadius:24,borderWidth:2,borderColor:colors.white},title:{marginTop:spacing.sm,paddingHorizontal:spacing.lg,fontFamily:'Georgia',fontSize:38,fontWeight:'700',color:colors.ink},gold:{color:colors.gold},subtitle:{paddingHorizontal:spacing.lg,marginTop:spacing.xs,fontSize:16,color:colors.muted},tabs:{gap:10,paddingHorizontal:spacing.lg,paddingVertical:spacing.xl},tab:{height:52,minWidth:130,paddingHorizontal:16,borderRadius:radius.pill,backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',gap:9,...shadows.soft},tabActive:{backgroundColor:colors.forest},tabLabel:{...typography.label,color:colors.ink},tabLabelActive:{color:colors.white},tabCount:{marginLeft:'auto',fontSize:13,color:colors.muted},sectionTitle:{marginTop:spacing.md,marginBottom:spacing.md,paddingHorizontal:spacing.lg,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionText:{...typography.title,color:colors.ink},seeAll:{flexDirection:'row',alignItems:'center',gap:9},seeAllText:{fontSize:15,fontWeight:'600',color:colors.ink},horizontal:{gap:12,paddingHorizontal:spacing.lg,paddingBottom:spacing.sm},place:{width:205,borderRadius:radius.lg,backgroundColor:colors.surface,overflow:'hidden',...shadows.soft},placeImage:{width:'100%',height:150},heart:{position:'absolute',right:12,top:12,width:38,height:38,borderRadius:19,backgroundColor:'rgba(10,35,27,.85)',alignItems:'center',justifyContent:'center'},placeInfo:{padding:14},cardTitle:{fontSize:17,fontWeight:'700',color:colors.ink},muted:{fontSize:14,color:colors.muted,marginTop:5},rating:{fontSize:14,color:colors.ink,marginTop:10},badge:{alignSelf:'flex-start',marginTop:10,paddingHorizontal:10,paddingVertical:6,borderRadius:radius.pill,backgroundColor:'#F3EEE7',fontSize:12,color:colors.ink},collectionRow:{paddingHorizontal:spacing.lg,flexDirection:'row',gap:14},collection:{flex:1,borderRadius:radius.lg,backgroundColor:colors.surface,overflow:'hidden',...shadows.soft},collectionImage:{width:'100%',height:140},folder:{position:'absolute',top:100,left:14,width:44,height:44,borderRadius:22,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center'},collectionInfo:{minHeight:82,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},experiences:{marginHorizontal:spacing.lg,paddingHorizontal:14,borderRadius:radius.lg,backgroundColor:colors.surface,...shadows.soft},experience:{minHeight:116,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12},experienceBorder:{borderTopWidth:1,borderTopColor:colors.line},experienceImage:{width:105,height:88,borderRadius:radius.md},experienceInfo:{flex:1},experienceTitle:{fontSize:16,fontWeight:'700',color:colors.ink},meta:{marginTop:12,flexDirection:'row',flexWrap:'wrap',gap:12},metaText:{fontSize:12,color:colors.ink},bookmark:{width:42,height:42,borderRadius:21,backgroundColor:'#F4EFE8',alignItems:'center',justifyContent:'center'},
});