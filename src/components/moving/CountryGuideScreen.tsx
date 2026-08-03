import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import type { CountryGuide } from '@/lib/countryGuides';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

type Props = { guide: CountryGuide; onBack: () => void };

export function CountryGuideScreen({ guide, onBack }: Props) {
  const [openSections, setOpenSections] = useState<string[]>(['Cost of living']);
  const toggle = (title: string) => setOpenSections(current => current.includes(title) ? current.filter(item => item !== title) : [...current, title]);

  return <View style={s.root}>
    <StatusBar style="light" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
      <View style={s.hero}>
        <View style={s.heroNav}>
          <AnimatedPressable accessibilityLabel="Back to moving plans" onPress={onBack} style={s.back}><Text style={s.backArrow}>‹</Text></AnimatedPressable>
          <View style={s.reviewed}><Icon name="check" color={colors.gold} size={13}/><Text style={s.reviewedText}>REVIEWED {guide.lastReviewed.toUpperCase()}</Text></View>
        </View>
        <Text style={s.flag}>{guide.flag}</Text><Text style={s.eyebrow}>COUNTRY LIVING GUIDE</Text>
        <Text style={s.title}>{guide.title}</Text><Text style={s.subtitle}>{guide.subtitle}</Text>
        <View style={s.factGrid}>{guide.quickFacts.map(fact => <View key={fact.label} style={s.fact}><Text style={s.factLabel}>{fact.label}</Text><Text style={s.factValue}>{fact.value}</Text></View>)}</View>
      </View>

      <View style={s.body}>
        <View style={s.notice}><Icon name="clock" color={colors.gold} size={20}/><Text style={s.noticeText}>{guide.timeSensitiveNote}</Text></View>

        <SectionTitle kicker="WHERE LIFE HAPPENS" title="Capital & major cities" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cityRow}>{guide.cities.map(city => <View key={city.name} style={s.cityCard}><Text style={s.cityName}>{city.name}</Text><Text style={s.cityNote}>{city.note}</Text></View>)}</ScrollView>

        <SectionTitle kicker="THE ESSENTIALS" title="Everyday life, explained" />
        <View style={s.accordion}>{guide.sections.map(section => {
          const open = openSections.includes(section.title);
          return <AnimatedPressable key={section.title} onPress={() => toggle(section.title)} style={s.accordionItem}>
            <View style={s.accordionTop}><View style={s.iconBox}><Icon name={section.icon} size={19} color={colors.gold}/></View><View style={s.accordionCopy}><Text style={s.accordionTitle}>{section.title}</Text><Text style={s.accordionSummary}>{section.summary}</Text></View><Text style={s.toggle}>{open ? '−' : '+'}</Text></View>
            {open && <View style={s.detailList}>{section.details.map(detail => <View key={detail} style={s.detailRow}><View style={s.bullet}/><Text style={s.detail}>{detail}</Text></View>)}</View>}
          </AnimatedPressable>;
        })}</View>

        <SectionTitle kicker="WHO IT WORKS FOR" title={`Could ${guide.country} suit you?`} />
        <View style={s.suitability}>{guide.suitability.map(item => <View key={item.label} style={s.suitRow}><View style={s.suitTop}><Text style={s.suitLabel}>{item.label}</Text><Text style={s.fit}>{item.fit}</Text></View><Text style={s.suitNote}>{item.note}</Text></View>)}</View>

        <View style={s.proConGrid}><ListCard title="Why it works" icon="check" items={guide.advantages} tone="green"/><ListCard title="Trade-offs" icon="more" items={guide.disadvantages} tone="sand"/></View>
        <ListCard title="Common newcomer difficulties" icon="briefcase" items={guide.newcomerDifficulties} tone="white" />

        <View style={s.wishCard}><Text style={s.wishKicker}>RESIDENT REALITY CHECK</Text><Text style={s.wishTitle}>What people wish they knew</Text>{guide.wishIKnew.map((item, index) => <View key={item} style={s.wishRow}><Text style={s.wishNumber}>{String(index + 1).padStart(2, '0')}</Text><Text style={s.wishText}>{item}</Text></View>)}</View>

        <SectionTitle kicker="CHECK IT YOURSELF" title="Official sources" />
        <Text style={s.sourcesIntro}>Open the primary source before making legal, financial, health or relocation decisions.</Text>
        <View style={s.sources}>{guide.sources.map(source => <AnimatedPressable key={source.url} onPress={() => { void Linking.openURL(source.url); }} style={s.source}>
          <View style={s.sourceCopy}><Text style={s.sourceOrg}>{source.organization}</Text><Text style={s.sourceLabel}>{source.label}</Text><Text style={s.sourceChecked}>Checked {source.checked}</Text></View><Icon name="arrow" color={colors.gold} size={19}/>
        </AnimatedPressable>)}</View>
        <Text style={s.footer}>Last reviewed {guide.lastReviewed} · Editorial guide, not legal or financial advice.</Text>
      </View>
    </ScrollView>
  </View>;
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) { return <View style={s.sectionTitle}><Text style={s.kicker}>{kicker}</Text><Text style={s.heading}>{title}</Text></View>; }

function ListCard({ title, icon, items, tone }: { title: string; icon: 'check'|'more'|'briefcase'; items: readonly string[]; tone: 'green'|'sand'|'white' }) {
  return <View style={[s.listCard, tone === 'green' && s.listGreen, tone === 'sand' && s.listSand]}><View style={s.listHeading}><Icon name={icon} size={19} color={tone === 'green' ? colors.white : colors.gold}/><Text style={[s.listTitle, tone === 'green' && s.listTitleLight]}>{title}</Text></View>{items.map(item => <View key={item} style={s.listItem}><Text style={[s.listBullet, tone === 'green' && s.listLight]}>•</Text><Text style={[s.listText, tone === 'green' && s.listLight]}>{item}</Text></View>)}</View>;
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},content:{paddingBottom:spacing.xxxl},hero:{backgroundColor:colors.forest,paddingHorizontal:spacing.lg,paddingTop:56,paddingBottom:spacing.xxl,borderBottomLeftRadius:34,borderBottomRightRadius:34},heroNav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:spacing.xl},back:{width:42,height:42,borderRadius:21,backgroundColor:colors.forestSoft,alignItems:'center',justifyContent:'center'},backArrow:{fontFamily:'Georgia',fontSize:35,lineHeight:36,color:colors.white,marginTop:-3},reviewed:{flexDirection:'row',alignItems:'center',gap:6,borderWidth:1,borderColor:'#456358',borderRadius:radius.pill,paddingHorizontal:10,paddingVertical:7},reviewedText:{fontSize:9,fontWeight:'800',letterSpacing:.8,color:'#D6E0DC'},flag:{fontSize:45,marginBottom:spacing.sm},eyebrow:{fontSize:10,fontWeight:'800',letterSpacing:1.8,color:colors.gold},title:{fontFamily:'Georgia',fontWeight:'700',fontSize:40,lineHeight:46,color:colors.white,marginTop:spacing.xs},subtitle:{...typography.body,color:'#C9D7D1',maxWidth:330,marginTop:spacing.sm},factGrid:{flexDirection:'row',flexWrap:'wrap',gap:spacing.sm,marginTop:spacing.xl},fact:{width:'47%',borderTopWidth:1,borderTopColor:'#426157',paddingTop:spacing.sm},factLabel:{fontSize:10,textTransform:'uppercase',letterSpacing:1,color:'#9CB1A9'},factValue:{fontFamily:'Georgia',fontSize:17,fontWeight:'700',color:colors.white,marginTop:3},body:{paddingTop:spacing.lg},notice:{marginHorizontal:spacing.lg,backgroundColor:'#F1E5D3',borderRadius:radius.md,padding:spacing.md,flexDirection:'row',alignItems:'flex-start',gap:spacing.sm},noticeText:{...typography.caption,color:colors.ink,flex:1,lineHeight:18},sectionTitle:{marginHorizontal:spacing.lg,marginTop:spacing.xxl,marginBottom:spacing.md},kicker:{fontSize:10,fontWeight:'800',letterSpacing:1.5,color:colors.gold,marginBottom:5},heading:{...typography.title,color:colors.ink},cityRow:{paddingHorizontal:spacing.lg,gap:spacing.sm},cityCard:{width:205,minHeight:115,padding:spacing.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,borderRadius:radius.lg},cityName:{...typography.cardTitle,color:colors.ink},cityNote:{...typography.caption,color:colors.muted,marginTop:spacing.xs,lineHeight:18},accordion:{marginHorizontal:spacing.lg,backgroundColor:colors.surface,borderRadius:radius.lg,overflow:'hidden',borderWidth:1,borderColor:colors.line},accordionItem:{padding:spacing.md,borderBottomWidth:1,borderBottomColor:colors.line},accordionTop:{flexDirection:'row',alignItems:'center'},iconBox:{width:38,height:38,borderRadius:19,backgroundColor:'#F4EBDD',alignItems:'center',justifyContent:'center'},accordionCopy:{flex:1,marginHorizontal:spacing.sm},accordionTitle:{...typography.label,color:colors.ink},accordionSummary:{...typography.caption,color:colors.muted,marginTop:3},toggle:{fontSize:23,fontWeight:'300',color:colors.gold},detailList:{marginLeft:50,marginTop:spacing.md,gap:spacing.sm},detailRow:{flexDirection:'row',alignItems:'flex-start',gap:spacing.sm},bullet:{width:5,height:5,borderRadius:3,backgroundColor:colors.gold,marginTop:7},detail:{fontSize:13,lineHeight:20,color:colors.ink,flex:1},suitability:{marginHorizontal:spacing.lg,backgroundColor:colors.surface,borderRadius:radius.lg,paddingHorizontal:spacing.md,...shadows.soft},suitRow:{paddingVertical:spacing.md,borderBottomWidth:1,borderBottomColor:colors.line},suitTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},suitLabel:{...typography.label,color:colors.ink},fit:{fontSize:10,fontWeight:'800',color:colors.forest,backgroundColor:'#DFEAE5',borderRadius:radius.pill,paddingHorizontal:9,paddingVertical:5},suitNote:{...typography.caption,color:colors.muted,marginTop:5},proConGrid:{gap:spacing.sm,marginHorizontal:spacing.lg,marginTop:spacing.xxl},listCard:{backgroundColor:colors.surface,borderRadius:radius.lg,padding:spacing.lg,borderWidth:1,borderColor:colors.line,marginHorizontal:spacing.lg,marginTop:spacing.sm},listGreen:{backgroundColor:colors.forest,borderColor:colors.forest,marginHorizontal:0},listSand:{backgroundColor:'#EFE4D3',borderColor:'#EFE4D3',marginHorizontal:0},listHeading:{flexDirection:'row',alignItems:'center',gap:spacing.sm,marginBottom:spacing.sm},listTitle:{...typography.cardTitle,fontSize:20,color:colors.ink},listTitleLight:{color:colors.white},listItem:{flexDirection:'row',gap:spacing.sm,marginTop:spacing.xs},listBullet:{color:colors.gold,fontWeight:'800'},listText:{fontSize:13,lineHeight:19,color:colors.ink,flex:1},listLight:{color:'#D4E0DB'},wishCard:{marginHorizontal:spacing.lg,marginTop:spacing.xxl,padding:spacing.lg,borderRadius:radius.lg,backgroundColor:'#EBD9BD'},wishKicker:{fontSize:10,fontWeight:'800',letterSpacing:1.5,color:colors.gold},wishTitle:{...typography.title,color:colors.ink,marginTop:5,marginBottom:spacing.sm},wishRow:{flexDirection:'row',gap:spacing.md,paddingVertical:spacing.md,borderTopWidth:1,borderTopColor:'#D8C19F'},wishNumber:{fontFamily:'Georgia',fontSize:17,fontWeight:'700',color:colors.gold},wishText:{fontSize:14,lineHeight:21,color:colors.ink,flex:1},sourcesIntro:{...typography.body,fontSize:14,color:colors.muted,marginHorizontal:spacing.lg,marginTop:-spacing.xs,marginBottom:spacing.md},sources:{marginHorizontal:spacing.lg,gap:spacing.sm},source:{padding:spacing.md,borderRadius:radius.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,flexDirection:'row',alignItems:'center'},sourceCopy:{flex:1},sourceOrg:{fontSize:10,fontWeight:'800',letterSpacing:.8,color:colors.gold,textTransform:'uppercase'},sourceLabel:{...typography.label,color:colors.ink,marginTop:3},sourceChecked:{...typography.caption,color:colors.muted,marginTop:3},footer:{...typography.caption,textAlign:'center',color:colors.muted,marginHorizontal:spacing.xl,marginTop:spacing.xxl}
});