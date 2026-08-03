import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { calculateCost, defaultCalculatorInput, type CalculatorInput, type Estimate, type Range } from '@/lib/costCalculator';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

type SavedScenario = { id: number; input: CalculatorInput; estimate: Estimate };
type Props = { onBack: () => void };

const money = (value: number) => new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export function CostCalculatorScreen({ onBack }: Props) {
  const [input, setInput] = useState(defaultCalculatorInput);
  const [view, setView] = useState<'plan' | 'results'>('plan');
  const [saved, setSaved] = useState<SavedScenario[]>([]);
  const estimate = useMemo(() => calculateCost(input), [input]);
  const update = <K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) => setInput(current => ({ ...current, [key]: value }));
  const save = () => {
    setSaved(current => [...current.filter(item => item.input.name !== input.name), { id: Date.now(), input: { ...input }, estimate }]);
    setView('results');
  };

  return <View style={s.root}>
    <StatusBar style="light" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <AnimatedPressable accessibilityLabel="Back to moving" onPress={onBack} style={s.back}><Text style={s.backText}>‹</Text></AnimatedPressable>
          <Text style={s.brand}>EXPLORIXA</Text><View style={s.back}/>
        </View>
        <Text style={s.eyebrow}>MOVE WITH CLARITY</Text>
        <Text style={s.title}>What will your{`\n`}new life cost?</Text>
        <Text style={s.subtitle}>A practical range for everyday life and the move itself—built around your household.</Text>
        <View style={s.switcher}>
          <AnimatedPressable onPress={() => setView('plan')} style={[s.switch, view === 'plan' && s.switchActive]}><Text style={[s.switchText, view === 'plan' && s.switchTextActive]}>01  Your plan</Text></AnimatedPressable>
          <AnimatedPressable onPress={() => setView('results')} style={[s.switch, view === 'results' && s.switchActive]}><Text style={[s.switchText, view === 'results' && s.switchTextActive]}>02  Estimate</Text></AnimatedPressable>
        </View>
      </View>

      {view === 'plan' ? <View style={s.form}>
        <Section number="01" title="Name your scenario" caption="Save a few versions and compare what feels possible.">
          <Field label="SCENARIO NAME" value={input.name} onChangeText={value => update('name', value)} placeholder="e.g. Living alone in Lisbon" />
        </Section>
        <Section number="02" title="Your route" caption="We use the destination to adjust housing and daily-life benchmarks.">
          <View style={s.twoCol}><Field label="CURRENT CITY" value={input.currentCity} onChangeText={value => update('currentCity', value)} /><Field label="DESTINATION" value={input.destinationCity} onChangeText={value => update('destinationCity', value)} /></View>
          <Field label="TARGET MOVING DATE" value={input.movingDate} onChangeText={value => update('movingDate', value)} placeholder="YYYY-MM-DD" />
        </Section>
        <Section number="03" title="Who's moving?" caption="Household size shapes food, travel, healthcare and your safety net.">
          <View style={s.stepRow}><Stepper label="ADULTS" value={input.adults} onChange={value => update('adults', value)} min={1}/><Stepper label="CHILDREN" value={input.children} onChange={value => update('children', value)} min={0}/><Stepper label="PETS" value={input.pets} onChange={value => update('pets', value)} min={0}/></View>
          <Field label="MONTHLY HOUSEHOLD INCOME (€)" value={String(input.monthlyIncome)} keyboardType="numeric" onChangeText={value => update('monthlyIncome', Number(value.replace(/[^0-9]/g, '')) || 0)} />
        </Section>
        <Section number="04" title="Make it feel like home" caption="Choose the kind of day-to-day life you want to price.">
          <Choice label="HOUSING TYPE" value={input.housing} options={['Apartment', 'House', 'Shared home']} onChange={value => update('housing', value as CalculatorInput['housing'])}/>
          <Stepper label="BEDROOMS" value={input.bedrooms} onChange={value => update('bedrooms', value)} min={0}/>
          <Choice label="LOCATION" value={input.location} options={['City center', 'Suburban']} onChange={value => update('location', value as CalculatorInput['location'])}/>
          <Choice label="GETTING AROUND" value={input.transport} options={['Public transport', 'Car']} onChange={value => update('transport', value as CalculatorInput['transport'])}/>
          <Choice label="LIFESTYLE" value={input.lifestyle} options={['Essential', 'Comfortable', 'Premium']} onChange={value => update('lifestyle', value as CalculatorInput['lifestyle'])}/>
        </Section>
        <Section number="05" title="Care & education" caption="Include services that can meaningfully change a family budget.">
          <Choice label="CHILDCARE" value={input.childcare} options={['None', 'Part-time', 'Full-time']} onChange={value => update('childcare', value as CalculatorInput['childcare'])}/>
          <Choice label="EDUCATION" value={input.education} options={['Public', 'Private', 'International']} onChange={value => update('education', value as CalculatorInput['education'])}/>
          <Choice label="HEALTHCARE" value={input.healthcare} options={['Public', 'Private', 'Employer covered']} onChange={value => update('healthcare', value as CalculatorInput['healthcare'])}/>
        </Section>
        <AnimatedPressable onPress={() => setView('results')} style={s.cta}><Text style={s.ctaText}>Build my estimate</Text><Icon name="arrow" color={colors.forest}/></AnimatedPressable>
      </View> : <Results input={input} estimate={estimate} saved={saved} onSave={save} onLoad={scenario => { setInput(scenario.input); setView('results'); }} onEdit={() => setView('plan')}/>} 
    </ScrollView>
  </View>;
}

function Results({ input, estimate, saved, onSave, onLoad, onEdit }: { input: CalculatorInput; estimate: Estimate; saved: SavedScenario[]; onSave: () => void; onLoad: (item: SavedScenario) => void; onEdit: () => void }) {
  const surplus = input.monthlyIncome - estimate.monthlyTotal.expected;
  return <View style={s.results}>
    <View style={s.resultIntro}><Text style={s.resultKicker}>YOUR PERSONAL ESTIMATE</Text><Text style={s.resultTitle}>{input.destinationCity || 'Your destination'}</Text><Text style={s.resultMeta}>{input.adults + input.children} people · {input.bedrooms} bedroom · {input.lifestyle}</Text></View>
    <View style={s.totalCard}><Text style={s.totalLabel}>EXPECTED MONTHLY COST</Text><Text style={s.totalValue}>{money(estimate.monthlyTotal.expected)}</Text><Text style={s.totalRange}>{money(estimate.monthlyTotal.low)} low  —  {money(estimate.monthlyTotal.high)} high</Text><View style={s.incomeBar}><View style={[s.incomeFill, { width: `${Math.min(100, Math.round(estimate.monthlyTotal.expected / Math.max(input.monthlyIncome, 1) * 100))}%` }]}/></View><Text style={[s.surplus, surplus < 0 && s.negative]}>{surplus >= 0 ? `${money(surplus)} left from monthly income` : `${money(Math.abs(surplus))} above monthly income`}</Text></View>
    <RangeLegend />
    <EstimateTable title="MONTHLY LIFE" rows={estimate.monthly}/>
    <View style={s.moveTotal}><View><Text style={s.totalLabelDark}>ONE-TIME MOVING BUDGET</Text><Text style={s.moveSub}>Plan before your departure</Text></View><View style={s.moveRight}><Text style={s.moveValue}>{money(estimate.movingTotal.expected)}</Text><Text style={s.moveRange}>{money(estimate.movingTotal.low)}–{money(estimate.movingTotal.high)}</Text></View></View>
    <EstimateTable title="MOVING COSTS" rows={estimate.moving}/>
    <View style={s.infoCard}><Text style={s.infoTitle}>Assumptions behind this range</Text>{estimate.assumptions.map(item => <Text key={item} style={s.bullet}>•  {item}</Text>)}<View style={s.rule}/><Text style={s.sourceLabel}>DATA SOURCES</Text>{estimate.sources.map(item => <Text key={item} style={s.source}>↗  {item}</Text>)}<Text style={s.updated}>Currency: {estimate.currency} · Last updated {estimate.updated}</Text></View>
    <View style={s.actions}><AnimatedPressable onPress={onSave} style={s.cta}><Text style={s.ctaText}>Save this scenario</Text><Icon name="bookmark" color={colors.forest}/></AnimatedPressable><AnimatedPressable onPress={onEdit} style={s.secondary}><Text style={s.secondaryText}>Adjust the details</Text></AnimatedPressable></View>
    {saved.length > 0 && <View style={s.saved}><Text style={s.resultKicker}>SAVED SCENARIOS</Text><Text style={s.savedTitle}>Plans worth comparing</Text>{saved.map(item => <AnimatedPressable key={item.id} onPress={() => onLoad(item)} style={s.savedRow}><View><Text style={s.savedName}>{item.input.name}</Text><Text style={s.resultMeta}>{item.input.destinationCity} · {item.input.adults + item.input.children} people</Text></View><View style={s.savedCost}><Text style={s.savedValue}>{money(item.estimate.monthlyTotal.expected)}</Text><Text style={s.savedMeta}>per month  →</Text></View></AnimatedPressable>)}</View>}
  </View>;
}

function Section({ number, title, caption, children }: { number: string; title: string; caption: string; children: React.ReactNode }) { return <View style={s.section}><View style={s.sectionHead}><Text style={s.number}>{number}</Text><View style={s.sectionCopy}><Text style={s.sectionTitle}>{title}</Text><Text style={s.caption}>{caption}</Text></View></View><View style={s.sectionBody}>{children}</View></View>; }
function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) { const { label, ...inputProps } = props; return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput placeholderTextColor="#9A9D98" style={s.input} {...inputProps}/></View>; }
function Choice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <View style={s.field}><Text style={s.label}>{label}</Text><View style={s.chips}>{options.map(option => <AnimatedPressable key={option} onPress={() => onChange(option)} style={[s.chip, value === option && s.chipActive]}><Text style={[s.chipText, value === option && s.chipTextActive]}>{option}</Text></AnimatedPressable>)}</View></View>; }
function Stepper({ label, value, onChange, min }: { label: string; value: number; onChange: (value: number) => void; min: number }) { return <View style={s.stepper}><Text style={s.label}>{label}</Text><View style={s.stepControl}><AnimatedPressable onPress={() => onChange(Math.max(min, value - 1))} style={s.stepButton}><Text style={s.stepButtonText}>−</Text></AnimatedPressable><Text style={s.stepValue}>{value}</Text><AnimatedPressable onPress={() => onChange(value + 1)} style={s.stepButton}><Text style={s.stepButtonText}>+</Text></AnimatedPressable></View></View>; }
function RangeLegend() { return <View style={s.legend}><View><Text style={s.legendDot}>● <Text style={s.legendLabel}>LOW</Text></Text><Text style={s.legendCopy}>lean months</Text></View><View><Text style={s.legendDotMid}>● <Text style={s.legendLabel}>EXPECTED</Text></Text><Text style={s.legendCopy}>most likely</Text></View><View><Text style={s.legendDotHigh}>● <Text style={s.legendLabel}>HIGH</Text></Text><Text style={s.legendCopy}>room to flex</Text></View></View>; }
function EstimateTable({ title, rows }: { title: string; rows: Record<string, Range> }) { return <View style={s.table}><Text style={s.tableTitle}>{title}</Text><View style={s.tableHead}><Text style={s.rowLabel}>CATEGORY</Text><Text style={s.rowValue}>LOW</Text><Text style={s.rowValue}>EXPECTED</Text><Text style={s.rowValue}>HIGH</Text></View>{Object.entries(rows).map(([label, values]) => <View key={label} style={s.tableRow}><Text style={s.rowName}>{label}</Text><Text style={s.rowValue}>{money(values.low)}</Text><Text style={[s.rowValue, s.expected]}>{money(values.expected)}</Text><Text style={s.rowValue}>{money(values.high)}</Text></View>)}</View>; }

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},content:{paddingBottom:60},header:{backgroundColor:colors.forest,paddingHorizontal:spacing.lg,paddingTop:18,paddingBottom:0,borderBottomLeftRadius:32,borderBottomRightRadius:32},headerRow:{height:54,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},back:{width:42,height:42,borderRadius:21,backgroundColor:colors.forestSoft,alignItems:'center',justifyContent:'center'},backText:{fontSize:34,lineHeight:36,color:colors.white,fontWeight:'300'},brand:{fontFamily:'Georgia',fontWeight:'700',fontSize:17,letterSpacing:2,color:colors.gold},eyebrow:{fontSize:10,fontWeight:'800',letterSpacing:2.2,color:colors.gold,marginTop:30},title:{fontFamily:'Georgia',fontSize:42,lineHeight:47,fontWeight:'700',color:colors.white,marginTop:10},subtitle:{...typography.body,color:'#BED0C9',marginTop:14,maxWidth:350},switcher:{flexDirection:'row',marginTop:30},switch:{flex:1,paddingVertical:18,borderBottomWidth:3,borderBottomColor:'transparent'},switchActive:{borderBottomColor:colors.gold},switchText:{fontSize:12,fontWeight:'700',color:'#849B92',letterSpacing:.5,textAlign:'center'},switchTextActive:{color:colors.white},form:{padding:spacing.lg,gap:16},section:{backgroundColor:colors.surface,borderRadius:radius.lg,borderWidth:1,borderColor:colors.line,overflow:'hidden'},sectionHead:{flexDirection:'row',padding:spacing.lg,backgroundColor:'#F1E9DD'},number:{fontFamily:'Georgia',fontSize:16,color:colors.gold,marginRight:14},sectionCopy:{flex:1},sectionTitle:{...typography.cardTitle,color:colors.ink},caption:{...typography.caption,color:colors.muted,marginTop:5,maxWidth:300},sectionBody:{padding:spacing.lg,gap:18},twoCol:{flexDirection:'row',gap:12},field:{flex:1,gap:8},label:{fontSize:9,fontWeight:'800',letterSpacing:1.4,color:colors.muted},input:{height:50,borderWidth:1,borderColor:'#D8D1C8',borderRadius:radius.sm,paddingHorizontal:14,fontSize:15,color:colors.ink,backgroundColor:colors.white},chips:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{paddingVertical:11,paddingHorizontal:14,borderRadius:radius.pill,borderWidth:1,borderColor:'#D8D1C8',backgroundColor:colors.white},chipActive:{backgroundColor:colors.forest,borderColor:colors.forest},chipText:{fontSize:12,fontWeight:'700',color:colors.ink},chipTextActive:{color:colors.white},stepRow:{flexDirection:'row',gap:10},stepper:{flex:1,gap:8},stepControl:{height:48,borderWidth:1,borderColor:'#D8D1C8',borderRadius:radius.sm,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:colors.white},stepButton:{width:34,height:46,alignItems:'center',justifyContent:'center'},stepButtonText:{fontSize:20,color:colors.gold},stepValue:{fontSize:16,fontWeight:'800',color:colors.ink},cta:{height:56,borderRadius:radius.pill,backgroundColor:colors.gold,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,...shadows.soft},ctaText:{fontSize:15,fontWeight:'800',color:colors.forest},results:{padding:spacing.lg,gap:16},resultIntro:{paddingTop:14},resultKicker:{fontSize:10,fontWeight:'800',letterSpacing:1.7,color:colors.gold},resultTitle:{fontFamily:'Georgia',fontSize:35,fontWeight:'700',color:colors.ink,marginTop:6},resultMeta:{...typography.caption,color:colors.muted,marginTop:3},totalCard:{backgroundColor:colors.forest,borderRadius:radius.lg,padding:spacing.xl,...shadows.soft},totalLabel:{fontSize:9,fontWeight:'800',letterSpacing:1.5,color:colors.gold},totalValue:{fontFamily:'Georgia',fontSize:43,fontWeight:'700',color:colors.white,marginTop:10},totalRange:{fontSize:13,color:'#C1D0CA',marginTop:6},incomeBar:{height:6,backgroundColor:colors.forestSoft,borderRadius:3,marginTop:20,overflow:'hidden'},incomeFill:{height:6,backgroundColor:colors.gold,borderRadius:3},surplus:{fontSize:11,fontWeight:'700',color:'#B9D6C8',marginTop:8},negative:{color:'#E7B0A8'},legend:{backgroundColor:'#EFE5D6',borderRadius:radius.md,padding:16,flexDirection:'row',justifyContent:'space-between'},legendDot:{fontSize:9,color:'#A8B9B1'},legendDotMid:{fontSize:9,color:colors.gold},legendDotHigh:{fontSize:9,color:colors.forest},legendLabel:{fontSize:9,fontWeight:'800',letterSpacing:.6,color:colors.ink},legendCopy:{fontSize:9,color:colors.muted,marginLeft:15,marginTop:2},table:{backgroundColor:colors.surface,borderRadius:radius.lg,borderWidth:1,borderColor:colors.line,overflow:'hidden'},tableTitle:{fontFamily:'Georgia',fontSize:20,fontWeight:'700',padding:18,color:colors.ink},tableHead:{flexDirection:'row',paddingHorizontal:12,paddingVertical:10,backgroundColor:'#F1E9DD'},tableRow:{minHeight:48,flexDirection:'row',alignItems:'center',paddingHorizontal:12,borderTopWidth:1,borderTopColor:colors.line},rowLabel:{flex:1.35,fontSize:8,fontWeight:'800',color:colors.muted},rowName:{flex:1.35,fontSize:11,color:colors.ink},rowValue:{flex:1,fontSize:9,textAlign:'right',color:colors.muted},expected:{fontWeight:'800',color:colors.ink},moveTotal:{backgroundColor:'#E9D7BC',borderRadius:radius.lg,padding:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},totalLabelDark:{fontSize:9,fontWeight:'800',letterSpacing:1.2,color:colors.forest},moveSub:{fontSize:11,color:colors.muted,marginTop:5},moveRight:{alignItems:'flex-end'},moveValue:{fontFamily:'Georgia',fontSize:25,fontWeight:'700',color:colors.ink},moveRange:{fontSize:9,color:colors.muted,marginTop:3},infoCard:{padding:spacing.lg,borderRadius:radius.lg,backgroundColor:colors.white,borderLeftWidth:3,borderLeftColor:colors.gold},infoTitle:{...typography.cardTitle,fontSize:19,color:colors.ink,marginBottom:12},bullet:{fontSize:12,lineHeight:20,color:colors.muted},rule:{height:1,backgroundColor:colors.line,marginVertical:15},sourceLabel:{fontSize:9,fontWeight:'800',letterSpacing:1.4,color:colors.gold,marginBottom:8},source:{fontSize:11,lineHeight:20,color:colors.forest,fontWeight:'600'},updated:{fontSize:10,color:colors.muted,marginTop:13},actions:{gap:10},secondary:{height:50,borderRadius:radius.pill,borderWidth:1,borderColor:colors.forest,alignItems:'center',justifyContent:'center'},secondaryText:{fontSize:14,fontWeight:'800',color:colors.forest},saved:{marginTop:16,gap:10},savedTitle:{...typography.title,color:colors.ink,marginBottom:6},savedRow:{padding:16,borderRadius:radius.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},savedName:{fontSize:13,fontWeight:'800',color:colors.ink},savedCost:{alignItems:'flex-end'},savedValue:{fontFamily:'Georgia',fontSize:17,fontWeight:'700',color:colors.ink},savedMeta:{fontSize:9,color:colors.gold,marginTop:2},
});