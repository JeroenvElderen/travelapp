import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import type { IconName } from '@/types/travel';

const sections: { title: string; items: { label: string; detail: string; tab: string; icon: IconName }[] }[] = [
  { title: 'PLAN', items: [
    { label: 'AI trip & move planner', detail: 'Build an editable plan', tab: 'Planner', icon: 'sparkle' },
    { label: 'Country match', detail: 'Find places that fit your life', tab: 'CountryMatch', icon: 'globe' },
  ] },
  { title: 'RELOCATION TOOLS', items: [
    { label: 'Moving abroad hub', detail: 'Your relocation dashboard', tab: 'Move', icon: 'plane' },
    { label: 'Country guides', detail: 'Daily life and official sources', tab: 'CountryGuide', icon: 'document' },
    { label: 'Visa explorer', detail: 'Research possible pathways', tab: 'VisaExplorer', icon: 'briefcase' },
    { label: 'Compare cities', detail: 'Compare your shortlist', tab: 'CityComparison', icon: 'city' },
    { label: 'Cost calculator', detail: 'Draft a monthly budget', tab: 'CostCalculator', icon: 'wallet' },
    { label: 'Moving checklist', detail: 'Track relocation tasks', tab: 'MovingChecklist', icon: 'check' },
  ] },
  { title: 'EXPLORE', items: [
    { label: 'Explore map', detail: 'Discover places', tab: 'Explore', icon: 'explore' },
    { label: 'Saved', detail: 'Your places and plans', tab: 'Saved', icon: 'bookmark' },
  ] },
];

export function AppMenu({ visible, onClose, onNavigate }: { visible: boolean; onClose: () => void; onNavigate: (tab: string) => void }) {
  const go = (tab: string) => { onClose(); onNavigate(tab); };
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.modal}><Pressable accessibilityLabel="Close menu" onPress={onClose} style={s.scrim}/><View style={s.drawer}>
      <View style={s.top}><View><Text style={s.eyebrow}>EXPLORIXA</Text><Text style={s.title}>Where to next?</Text></View><AnimatedPressable accessibilityLabel="Close menu" onPress={onClose} style={s.close}><Text style={s.closeText}>×</Text></AnimatedPressable></View>
      <ScrollView contentContainerStyle={s.content}>{sections.map(section => <View key={section.title} style={s.section}><Text style={s.sectionTitle}>{section.title}</Text>{section.items.map(item => <AnimatedPressable key={item.tab} onPress={() => go(item.tab)} style={s.row}><View style={s.icon}><Icon name={item.icon} color={colors.gold} size={21}/></View><View style={s.copy}><Text style={s.label}>{item.label}</Text><Text style={s.detail}>{item.detail}</Text></View><Icon name="arrow" color={colors.muted} size={18}/></AnimatedPressable>)}</View>)}</ScrollView>
    </View></View>
  </Modal>;
}

const s=StyleSheet.create({modal:{flex:1,flexDirection:'row'},scrim:{...StyleSheet.absoluteFill,backgroundColor:colors.overlay},drawer:{width:'88%',maxWidth:390,height:'100%',backgroundColor:colors.canvas,...shadows.floating},top:{paddingTop:56,paddingHorizontal:spacing.lg,paddingBottom:spacing.lg,backgroundColor:colors.forest,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},eyebrow:{fontSize:10,fontWeight:'800',letterSpacing:2,color:colors.gold},title:{...typography.title,color:colors.white,marginTop:4},close:{width:42,height:42,borderRadius:21,backgroundColor:colors.forestSoft,alignItems:'center',justifyContent:'center'},closeText:{fontSize:30,lineHeight:32,color:colors.white},content:{padding:spacing.lg,paddingBottom:spacing.huge},section:{marginBottom:spacing.xl},sectionTitle:{fontSize:10,fontWeight:'800',letterSpacing:1.6,color:colors.gold,marginBottom:spacing.xs},row:{minHeight:67,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:'row',alignItems:'center'},icon:{width:40,height:40,borderRadius:20,backgroundColor:'#F1E6D6',alignItems:'center',justifyContent:'center',marginRight:spacing.sm},copy:{flex:1},label:{...typography.label,color:colors.ink},detail:{...typography.caption,color:colors.muted,marginTop:2}});