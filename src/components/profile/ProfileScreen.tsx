import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { BottomNavigation } from '@/components/home/navigation/BottomNavigation';
import { AppHeader } from '@/components/ui/AppHeader';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { user } from '@/lib/homeData';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import type { IconName } from '@/types/travel';

type Props = { onTabChange?: (tab: string) => void };
type Row = { icon: IconName; title: string; detail: string };

const activity: Row[] = [
  { icon: 'clock', title: 'Recent views', detail: 'Places and experiences you viewed recently' },
  { icon: 'bookmark', title: 'Saved places', detail: 'All the places you’ve saved' },
  { icon: 'briefcase', title: 'My trips', detail: 'Your upcoming and past trips' },
  { icon: 'document', title: 'Reviews', detail: 'Places and experiences you reviewed' },
];
const settings: Row[] = [
  { icon: 'profile', title: 'Personal information', detail: 'Manage your personal details' },
  { icon: 'bell', title: 'Notifications', detail: 'Manage your notification preferences' },
  { icon: 'credit-card', title: 'Payment methods', detail: 'Manage cards and payment options' },
  { icon: 'globe', title: 'Language', detail: 'English (US)' },
];

export function ProfileScreen({ onTabChange }: Props) {
  return <View style={styles.root}>
    <StatusBar style="dark" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <AppHeader />
      <View style={styles.intro}>
        <View style={styles.portraitWrap}><Image source={user.avatar} style={styles.portrait} contentFit="cover"/><View style={styles.sparkle}><Icon name="sparkle" color={colors.white} size={22}/></View></View>
        <View style={styles.greeting}><Text style={styles.hello}>Hi, {user.firstName}! 👋</Text><Text style={styles.tagline}>Travel more, discover deeper,{`\n`}create unforgettable memories.</Text><View style={styles.actions}><AnimatedPressable style={styles.edit}><Icon name="pencil" color={colors.white} size={17}/><Text style={styles.editText}>Edit profile</Text></AnimatedPressable><AnimatedPressable accessibilityLabel="Profile settings" style={styles.settingsButton}><Icon name="settings" size={21}/></AnimatedPressable></View></View>
      </View>
      <View style={styles.stats}>{[['mountain','24','Countries'],['heart','128','Saved places'],['briefcase','12','Trips'],['camera','56','Photos']].map(([icon,value,label], i) => <View key={label} style={[styles.stat, i > 0 && styles.statBorder]}><Icon name={icon as IconName} color={i === 0 || i === 2 ? colors.gold : colors.ink} size={27}/><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>)}</View>
      <View style={styles.premium}><View style={styles.premiumCopy}><Text style={styles.premiumTitle}>♛  Explorixa Premium</Text><Text style={styles.premiumText}>Unlock exclusive deals, offline maps,{`\n`}and AI trip planner.</Text></View><AnimatedPressable style={styles.premiumButton}><Text style={styles.premiumButtonText}>Go Premium</Text></AnimatedPressable></View>
      <ProfileSection title="My activity" rows={activity}/>
      <ProfileSection title="Settings" rows={settings}/>
      <View style={styles.bottomSpace}/>
    </ScrollView>
    <BottomNavigation active="Profile" onChange={onTabChange}/>
  </View>;
}

function ProfileSection({ title, rows }: { title: string; rows: Row[] }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.list}>{rows.map((row, index) => <AnimatedPressable key={row.title} style={[styles.row, index > 0 && styles.rowBorder]}><View style={styles.rowIcon}><Icon name={row.icon} size={25}/></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{row.title}</Text><Text numberOfLines={1} style={styles.rowDetail}>{row.detail}</Text></View><Text style={styles.chevron}>›</Text></AnimatedPressable>)}</View></View>;
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},content:{paddingBottom:spacing.lg},intro:{paddingHorizontal:spacing.lg,marginTop:spacing.lg,flexDirection:'row',alignItems:'center',gap:spacing.xl},portraitWrap:{width:116,height:116},portrait:{width:116,height:116,borderRadius:58,borderWidth:3,borderColor:colors.white,...shadows.soft},sparkle:{position:'absolute',right:-3,bottom:2,width:38,height:38,borderRadius:19,backgroundColor:colors.gold,borderWidth:2,borderColor:colors.white,alignItems:'center',justifyContent:'center'},greeting:{flex:1},hello:{fontFamily:'Georgia',fontSize:28,fontWeight:'700',color:colors.ink},tagline:{...typography.body,color:colors.muted,marginTop:spacing.xs},actions:{flexDirection:'row',gap:spacing.sm,marginTop:spacing.md},edit:{height:46,paddingHorizontal:spacing.lg,borderRadius:radius.pill,backgroundColor:colors.forest,flexDirection:'row',alignItems:'center',gap:spacing.xs,...shadows.soft},editText:{fontSize:15,color:colors.white},settingsButton:{width:46,height:46,borderRadius:23,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',...shadows.soft},stats:{margin:spacing.lg,marginTop:spacing.xxl,minHeight:112,borderRadius:radius.lg,backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',...shadows.soft},stat:{flex:1,alignItems:'center',gap:4},statBorder:{borderLeftWidth:1,borderLeftColor:colors.line},statValue:{fontFamily:'Georgia',fontSize:24,fontWeight:'700',color:colors.ink},statLabel:{fontSize:12,color:colors.muted},premium:{marginHorizontal:spacing.lg,minHeight:116,borderRadius:radius.lg,backgroundColor:colors.forest,padding:spacing.lg,flexDirection:'row',alignItems:'center',...shadows.soft},premiumCopy:{flex:1},premiumTitle:{fontFamily:'Georgia',fontSize:21,fontWeight:'700',color:colors.white},premiumText:{fontSize:13,lineHeight:19,color:colors.white,marginTop:spacing.sm},premiumButton:{height:48,paddingHorizontal:spacing.lg,borderRadius:radius.pill,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center'},premiumButtonText:{fontSize:15,fontWeight:'700',color:colors.white},section:{marginTop:spacing.xxl,marginHorizontal:spacing.lg},sectionTitle:{...typography.title,color:colors.ink,marginBottom:spacing.md},list:{paddingHorizontal:spacing.lg,borderRadius:radius.lg,backgroundColor:colors.surface,...shadows.soft},row:{minHeight:76,flexDirection:'row',alignItems:'center'},rowBorder:{borderTopWidth:1,borderTopColor:colors.line},rowIcon:{width:42},rowCopy:{flex:1},rowTitle:{fontSize:15,fontWeight:'700',color:colors.ink},rowDetail:{fontSize:13,color:colors.muted,marginTop:3},chevron:{fontSize:30,fontWeight:'300',color:colors.muted},bottomSpace:{height:110},
});