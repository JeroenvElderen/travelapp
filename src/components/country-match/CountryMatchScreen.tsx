import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { matchQuestions } from '@/lib/countryMatchData';
import { createCountryMatches, describeBudgetCompatibility } from '@/lib/countryMatchScoring';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import type { CountryMatchResult, MatchAnswer } from '@/types/countryMatch';

type Props = { onBack: () => void };
type Phase = 'intro' | 'quiz' | 'results' | 'compare';

export function CountryMatchScreen({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<MatchAnswer>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [comparing, setComparing] = useState<string[]>([]);
  const results = useMemo(() => createCountryMatches(answers), [answers]);

  const start = () => { setStep(0); setPhase('quiz'); };
  const retake = () => { setAnswers({}); setComparing([]); start(); };
  const choose = (value: string) => {
    const nextAnswers = { ...answers, [matchQuestions[step].id]: value };
    setAnswers(nextAnswers);
    if (step === matchQuestions.length - 1) setPhase('results');
    else setStep(current => current + 1);
  };

  if (phase === 'intro') return <Intro onBack={onBack} onStart={start}/>;
  if (phase === 'quiz') return <Quiz step={step} answers={answers} onBack={() => step ? setStep(step - 1) : setPhase('intro')} onChoose={choose}/>;
  if (phase === 'compare') return <Compare results={results.filter(result => comparing.includes(result.id))} budget={answers.budget} onBack={() => setPhase('results')}/>;
  return <Results
    answers={answers}
    results={results}
    saved={saved}
    comparing={comparing}
    onBack={onBack}
    onEdit={() => { setStep(0); setPhase('quiz'); }}
    onRetake={retake}
    onSave={id => setSaved(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])}
    onCompare={id => setComparing(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 3 ? [...current, id] : current)}
    onOpenCompare={() => setPhase('compare')}
  />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <View style={s.root}><StatusBar style="dark"/>{children}</View>;
}

function TopBar({ title, onBack, right }: { title: string; onBack: () => void; right?: React.ReactNode }) {
  return <View style={s.topBar}><AnimatedPressable accessibilityLabel="Go back" onPress={onBack} style={s.backButton}><Text style={s.backGlyph}>‹</Text></AnimatedPressable><Text style={s.topTitle}>{title}</Text><View style={s.topRight}>{right}</View></View>;
}

function Intro({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return <Shell><ScrollView contentContainerStyle={s.introContent}>
    <TopBar title="Country match" onBack={onBack}/>
    <View style={s.introHero}><Text style={s.sparkle}>✦</Text><Text style={s.kickerLight}>EXPLORIXA · MOVE</Text><Text style={s.introTitle}>Where should you live?</Text><Text style={s.introCopy}>Match your budget, work and everyday priorities with countries worth exploring.</Text></View>
    <View style={s.introBody}>
      <Text style={s.sectionTitle}>A shortlist made around you.</Text><Text style={s.bodyCopy}>Answer 17 quick questions. We will show several potential matches, the reasons behind them, and the trade-offs to investigate.</Text>
      <View style={s.promiseGrid}><Promise icon="tune" title="Your priorities" copy="Lifestyle, family, language and work all shape the result."/><Promise icon="layers" title="Several matches" copy="No country is presented as the objectively best choice."/><Promise icon="document" title="Honest caveats" copy="Budget estimates, unknowns and legal checks stay visible."/></View>
      <View style={s.notice}><Icon name="check" color={colors.gold}/><Text style={s.noticeText}>Results are guidance, not legal, tax, immigration or medical advice. Eligibility must be confirmed with official authorities.</Text></View>
      <AnimatedPressable onPress={onStart} style={s.cta}><Text style={s.ctaText}>Start the quiz</Text><Icon name="arrow" color={colors.forest}/></AnimatedPressable><Text style={s.time}>About 4 minutes · You can change your answers later</Text>
    </View>
  </ScrollView></Shell>;
}

function Promise({ icon, title, copy }: { icon: 'tune' | 'layers' | 'document'; title: string; copy: string }) {
  return <View style={s.promise}><View style={s.promiseIcon}><Icon name={icon} color={colors.gold} size={20}/></View><View style={s.flex}><Text style={s.promiseTitle}>{title}</Text><Text style={s.promiseCopy}>{copy}</Text></View></View>;
}

function Quiz({ step, answers, onBack, onChoose }: { step: number; answers: MatchAnswer; onBack: () => void; onChoose: (value: string) => void }) {
  const question = matchQuestions[step];
  return <Shell>
    <TopBar title="Your priorities" onBack={onBack} right={<Text style={s.stepCount}>{step + 1} / {matchQuestions.length}</Text>}/>
    <View style={s.progress}><View style={[s.progressFill, { width: `${((step + 1) / matchQuestions.length) * 100}%` }]}/></View>
    <ScrollView contentContainerStyle={s.quizContent}>
      <Text style={s.kicker}>{question.eyebrow}</Text><Text style={s.questionTitle}>{question.title}</Text><Text style={s.questionHelper}>{question.helper}</Text>
      <View style={s.options}>{question.options.map(option => { const selected = answers[question.id] === option.value; return <AnimatedPressable key={option.value} onPress={() => onChoose(option.value)} style={[s.option, selected && s.optionSelected]}><View style={[s.radio, selected && s.radioSelected]}>{selected && <View style={s.radioDot}/>}</View><View style={s.flex}><Text style={[s.optionLabel, selected && s.optionLabelSelected]}>{option.label}</Text><Text style={[s.optionDetail, selected && s.optionDetailSelected]}>{option.detail}</Text></View><Icon name="arrow" size={18} color={selected ? colors.gold : colors.muted}/></AnimatedPressable>; })}</View>
      <Text style={s.quizFootnote}>Choose the answer that feels closest. You can revise every answer from your results.</Text>
    </ScrollView>
  </Shell>;
}

function Results({ answers, results, saved, comparing, onBack, onEdit, onRetake, onSave, onCompare, onOpenCompare }: { answers: MatchAnswer; results: CountryMatchResult[]; saved: string[]; comparing: string[]; onBack: () => void; onEdit: () => void; onRetake: () => void; onSave: (id: string) => void; onCompare: (id: string) => void; onOpenCompare: () => void }) {
  return <Shell>
    <ScrollView contentContainerStyle={s.resultsContent}>
      <TopBar title="Your country matches" onBack={onBack} right={<AnimatedPressable onPress={onEdit}><Text style={s.edit}>Edit</Text></AnimatedPressable>}/>
      <View style={s.resultsHero}><Text style={s.kickerLight}>YOUR SHORTLIST</Text><Text style={s.resultsTitle}>A few places worth a closer look.</Text><Text style={s.resultsCopy}>These are possibilities—not a verdict. Scores reflect your answers and the information currently available.</Text></View>
      <View style={s.resultsBody}>{results.slice(0, 4).map((result, index) => <MatchCard key={result.id} result={result} rank={index + 1} budget={answers.budget} saved={saved.includes(result.id)} comparing={comparing.includes(result.id)} onSave={() => onSave(result.id)} onCompare={() => onCompare(result.id)}/>)}</View>
      <View style={s.method}><Icon name="sparkle" color={colors.gold}/><View style={s.flex}><Text style={s.methodTitle}>How we matched you</Text><Text style={s.methodCopy}>We weighted all 17 answers equally and checked budget compatibility separately. A high score is a reason to research—not proof that a move is possible.</Text></View></View>
      <View style={s.resultActions}><AnimatedPressable onPress={onEdit} style={s.secondaryButton}><Icon name="pencil" size={18}/><Text style={s.secondaryText}>Change answers</Text></AnimatedPressable><AnimatedPressable onPress={onRetake} style={s.textButton}><Text style={s.textButtonText}>Retake from scratch</Text></AnimatedPressable></View>
    </ScrollView>
    {comparing.length >= 2 && <View style={s.compareTray}><View><Text style={s.compareTrayTitle}>{comparing.length} countries selected</Text><Text style={s.compareTrayCopy}>Compare your priorities side by side</Text></View><AnimatedPressable onPress={onOpenCompare} style={s.compareButton}><Text style={s.compareButtonText}>Compare</Text><Icon name="arrow" color={colors.forest} size={18}/></AnimatedPressable></View>}
  </Shell>;
}

function MatchCard({ result, rank, budget, saved, comparing, onSave, onCompare }: { result: CountryMatchResult; rank: number; budget: string; saved: boolean; comparing: boolean; onSave: () => void; onCompare: () => void }) {
  return <View style={s.matchCard}>
    <View style={s.matchTop}><View style={s.flagCircle}><Text style={s.flag}>{result.flag}</Text></View><View style={s.flex}><Text style={s.rank}>MATCH {rank}</Text><Text style={s.country}>{result.country}</Text></View><View style={s.score}><Text style={s.scoreNumber}>{result.score}%</Text><Text style={s.scoreLabel}>FIT</Text></View></View>
    <Text style={s.matchLead}>{result.country} aligns with {result.matchedAnswers.slice(0, 3).join(', ').toLowerCase()} and several of your day-to-day priorities.</Text>
    <Detail title="Why it matches" items={result.strengths} tone="good"/>
    <View style={s.priorityWrap}>{result.matchedAnswers.slice(0, 6).map(item => <Text key={item} style={s.priorityChip}>✓ {item}</Text>)}</View>
    <View style={s.budgetBox}><View><Text style={s.detailEyebrow}>ESTIMATED BUDGET FIT</Text><Text style={s.budgetFit}>{describeBudgetCompatibility(budget, result.monthlyBudget)}</Text></View><Text style={s.budgetAmount}>{result.budgetLabel}</Text></View>
    <Detail title="Important compromises" items={result.compromises} tone="warn"/>
    <Detail title="Potential visa pathways" items={result.visaPathways}/>
    <View style={s.detailSection}><Text style={s.detailTitle}>Recommended cities</Text><View style={s.cityRow}>{result.cities.map(city => <Text key={city} style={s.cityChip}>{city}</Text>)}</View></View>
    <Detail title="Information unavailable" items={result.unavailable} tone="muted"/>
    <View style={s.legal}><Icon name="document" size={20} color={colors.gold}/><View style={s.flex}><Text style={s.legalTitle}>Legal eligibility still needs confirmation</Text><Text style={s.legalCopy}>Visa names are starting points only. Confirm live requirements for your nationality, work, income and household.</Text></View></View>
    <View style={s.cardActions}><AnimatedPressable onPress={onSave} style={[s.saveButton, saved && s.saveButtonActive]}><Icon name="bookmark" size={19} color={saved ? colors.white : colors.forest}/><Text style={[s.saveText, saved && s.saveTextActive]}>{saved ? 'Saved' : 'Save country'}</Text></AnimatedPressable><AnimatedPressable onPress={onCompare} style={[s.selectButton, comparing && s.selectButtonActive]}><View style={[s.checkbox, comparing && s.checkboxActive]}>{comparing && <Icon name="check" size={13} color={colors.white}/>}</View><Text style={s.selectText}>{comparing ? 'Selected' : 'Compare'}</Text></AnimatedPressable></View>
  </View>;
}

function Detail({ title, items, tone }: { title: string; items: string[]; tone?: 'good' | 'warn' | 'muted' }) {
  return <View style={s.detailSection}><Text style={s.detailTitle}>{title}</Text>{items.map(item => <View key={item} style={s.bulletRow}><Text style={[s.bullet, tone === 'good' && s.bulletGood, tone === 'warn' && s.bulletWarn]}>•</Text><Text style={[s.bulletText, tone === 'muted' && s.mutedText]}>{item}</Text></View>)}</View>;
}

function Compare({ results, budget, onBack }: { results: CountryMatchResult[]; budget: string; onBack: () => void }) {
  const rows = [
    { label: 'Overall fit', value: (r: CountryMatchResult) => `${r.score}% match` }, { label: 'Budget', value: (r: CountryMatchResult) => describeBudgetCompatibility(budget, r.monthlyBudget) }, { label: 'Estimated range', value: (r: CountryMatchResult) => r.budgetLabel }, { label: 'Cities to explore', value: (r: CountryMatchResult) => r.cities.join(', ') }, { label: 'Biggest advantage', value: (r: CountryMatchResult) => r.strengths[0] }, { label: 'Key compromise', value: (r: CountryMatchResult) => r.compromises[0] }, { label: 'Possible pathway', value: (r: CountryMatchResult) => r.visaPathways[0] },
  ];
  return <Shell><TopBar title="Compare matches" onBack={onBack}/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.compareScroll}><View><View style={s.compareHeader}><View style={s.rowLabel}/>{results.map(result => <View key={result.id} style={s.compareCountry}><Text style={s.compareFlag}>{result.flag}</Text><Text style={s.compareName}>{result.country}</Text><Text style={s.compareScore}>{result.score}% fit</Text></View>)}</View>{rows.map((row, index) => <View key={row.label} style={[s.compareRow, index % 2 === 0 && s.compareRowAlt]}><View style={s.rowLabel}><Text style={s.rowLabelText}>{row.label}</Text></View>{results.map(result => <View key={result.id} style={s.compareCell}><Text style={s.compareValue}>{row.value(result)}</Text></View>)}</View>)}<View style={s.compareLegal}><Icon name="document" color={colors.gold}/><Text style={s.compareLegalText}>All visa pathways and legal eligibility require confirmation with the relevant authorities.</Text></View></View></ScrollView></Shell>;
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},flex:{flex:1},topBar:{height:82,paddingTop:18,paddingHorizontal:spacing.lg,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:colors.canvas},backButton:{width:42,height:42,borderRadius:21,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},backGlyph:{fontSize:32,lineHeight:32,color:colors.ink,marginTop:-3},topTitle:{...typography.label,color:colors.ink},topRight:{minWidth:42,alignItems:'flex-end'},stepCount:{...typography.caption,fontWeight:'800',color:colors.gold},introContent:{paddingBottom:spacing.xxxl},introHero:{backgroundColor:colors.forest,paddingHorizontal:spacing.xl,paddingTop:spacing.xxxl,paddingBottom:spacing.huge,borderBottomLeftRadius:36,borderBottomRightRadius:36},sparkle:{fontSize:36,color:colors.gold,marginBottom:spacing.sm},kickerLight:{fontSize:10,fontWeight:'800',letterSpacing:1.8,color:colors.gold,marginBottom:spacing.sm},introTitle:{fontFamily:'Georgia',fontWeight:'700',fontSize:42,lineHeight:47,color:colors.white,maxWidth:330},introCopy:{...typography.body,color:'#C6D5CF',marginTop:spacing.md,maxWidth:340},introBody:{padding:spacing.xl},sectionTitle:{...typography.title,color:colors.ink},bodyCopy:{...typography.body,color:colors.muted,marginTop:spacing.sm},promiseGrid:{marginVertical:spacing.xl,gap:spacing.sm},promise:{flexDirection:'row',padding:spacing.md,borderRadius:radius.lg,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,gap:spacing.md},promiseIcon:{width:42,height:42,borderRadius:21,backgroundColor:'#F1E5D1',alignItems:'center',justifyContent:'center'},promiseTitle:{...typography.label,color:colors.ink},promiseCopy:{...typography.caption,color:colors.muted,marginTop:3},notice:{flexDirection:'row',gap:spacing.sm,padding:spacing.md,borderRadius:radius.md,backgroundColor:'#F0E7D9'},noticeText:{...typography.caption,color:colors.ink,flex:1},cta:{height:56,borderRadius:radius.pill,backgroundColor:colors.gold,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:spacing.sm,marginTop:spacing.xl,...shadows.soft},ctaText:{fontSize:16,fontWeight:'800',color:colors.forest},time:{...typography.caption,textAlign:'center',color:colors.muted,marginTop:spacing.sm},progress:{height:4,backgroundColor:colors.line},progressFill:{height:4,backgroundColor:colors.gold},quizContent:{padding:spacing.xl,paddingTop:spacing.xxxl},kicker:{fontSize:10,fontWeight:'800',letterSpacing:1.8,color:colors.gold,marginBottom:spacing.sm},questionTitle:{fontFamily:'Georgia',fontSize:34,lineHeight:40,fontWeight:'700',color:colors.ink},questionHelper:{...typography.body,color:colors.muted,marginTop:spacing.sm},options:{gap:spacing.sm,marginTop:spacing.xxl},option:{minHeight:86,padding:spacing.md,borderRadius:radius.lg,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,flexDirection:'row',alignItems:'center',gap:spacing.md},optionSelected:{backgroundColor:colors.forest,borderColor:colors.forest},radio:{width:22,height:22,borderRadius:11,borderWidth:1.5,borderColor:colors.muted,alignItems:'center',justifyContent:'center'},radioSelected:{borderColor:colors.gold},radioDot:{width:10,height:10,borderRadius:5,backgroundColor:colors.gold},optionLabel:{...typography.label,color:colors.ink},optionLabelSelected:{color:colors.white},optionDetail:{...typography.caption,color:colors.muted,marginTop:3},optionDetailSelected:{color:'#B9CCC4'},quizFootnote:{...typography.caption,color:colors.muted,textAlign:'center',margin:spacing.xl},resultsContent:{paddingBottom:140},edit:{...typography.label,color:colors.gold},resultsHero:{backgroundColor:colors.forest,padding:spacing.xl,paddingTop:spacing.xxl,paddingBottom:spacing.xxxl,borderBottomLeftRadius:34,borderBottomRightRadius:34},resultsTitle:{fontFamily:'Georgia',fontSize:35,lineHeight:41,fontWeight:'700',color:colors.white},resultsCopy:{...typography.body,color:'#C6D5CF',marginTop:spacing.sm},resultsBody:{padding:spacing.lg,gap:spacing.lg},matchCard:{backgroundColor:colors.surface,borderRadius:radius.xl,padding:spacing.lg,borderWidth:1,borderColor:colors.line,...shadows.soft},matchTop:{flexDirection:'row',alignItems:'center'},flagCircle:{width:54,height:54,borderRadius:27,backgroundColor:'#F2E8D9',alignItems:'center',justifyContent:'center',marginRight:spacing.sm},flag:{fontSize:29},rank:{fontSize:9,fontWeight:'800',letterSpacing:1.4,color:colors.gold},country:{...typography.cardTitle,color:colors.ink},score:{width:58,height:58,borderRadius:29,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center'},scoreNumber:{fontSize:16,fontWeight:'800',color:colors.white},scoreLabel:{fontSize:8,fontWeight:'800',letterSpacing:1,color:colors.gold},matchLead:{...typography.body,color:colors.ink,marginTop:spacing.lg},detailSection:{marginTop:spacing.lg,paddingTop:spacing.md,borderTopWidth:1,borderTopColor:colors.line},detailTitle:{...typography.label,color:colors.ink,marginBottom:spacing.xs},bulletRow:{flexDirection:'row',gap:spacing.xs,marginTop:5},bullet:{fontSize:18,lineHeight:18,color:colors.gold},bulletGood:{color:'#4D8A6A'},bulletWarn:{color:'#B97842'},bulletText:{...typography.caption,color:colors.ink,flex:1},mutedText:{color:colors.muted},priorityWrap:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:spacing.md},priorityChip:{fontSize:10,fontWeight:'700',color:colors.forest,backgroundColor:'#E2EEE8',paddingHorizontal:9,paddingVertical:6,borderRadius:radius.pill},budgetBox:{marginTop:spacing.lg,padding:spacing.md,borderRadius:radius.md,backgroundColor:'#F0E6D7',gap:spacing.xs},detailEyebrow:{fontSize:9,fontWeight:'800',letterSpacing:1.2,color:colors.gold},budgetFit:{...typography.label,color:colors.ink},budgetAmount:{...typography.caption,color:colors.muted},cityRow:{flexDirection:'row',flexWrap:'wrap',gap:spacing.xs},cityChip:{...typography.caption,fontWeight:'700',color:colors.ink,paddingHorizontal:10,paddingVertical:7,borderRadius:radius.pill,borderWidth:1,borderColor:colors.line},legal:{flexDirection:'row',gap:spacing.sm,backgroundColor:colors.forest,padding:spacing.md,borderRadius:radius.md,marginTop:spacing.lg},legalTitle:{...typography.label,color:colors.white},legalCopy:{...typography.caption,color:'#B9CCC4',marginTop:3},cardActions:{flexDirection:'row',gap:spacing.sm,marginTop:spacing.lg},saveButton:{flex:1,height:46,borderRadius:radius.pill,borderWidth:1,borderColor:colors.forest,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:spacing.xs},saveButtonActive:{backgroundColor:colors.forest},saveText:{...typography.label,color:colors.forest},saveTextActive:{color:colors.white},selectButton:{flex:1,height:46,borderRadius:radius.pill,backgroundColor:'#F2E9DC',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:spacing.xs},selectButtonActive:{backgroundColor:'#E5D7C4'},checkbox:{width:18,height:18,borderRadius:5,borderWidth:1.5,borderColor:colors.muted,alignItems:'center',justifyContent:'center'},checkboxActive:{borderColor:colors.forest,backgroundColor:colors.forest},selectText:{...typography.label,color:colors.ink},method:{marginHorizontal:spacing.lg,padding:spacing.lg,borderRadius:radius.lg,backgroundColor:'#EFE5D6',flexDirection:'row',gap:spacing.md},methodTitle:{...typography.label,color:colors.ink},methodCopy:{...typography.caption,color:colors.muted,marginTop:3},resultActions:{padding:spacing.lg,gap:spacing.sm},secondaryButton:{height:52,borderRadius:radius.pill,borderWidth:1,borderColor:colors.forest,flexDirection:'row',gap:spacing.sm,alignItems:'center',justifyContent:'center'},secondaryText:{...typography.label,color:colors.forest},textButton:{height:42,alignItems:'center',justifyContent:'center'},textButtonText:{...typography.label,color:colors.gold},compareTray:{position:'absolute',left:spacing.md,right:spacing.md,bottom:spacing.md,backgroundColor:colors.forest,borderRadius:radius.lg,padding:spacing.md,paddingLeft:spacing.lg,flexDirection:'row',alignItems:'center',justifyContent:'space-between',...shadows.floating},compareTrayTitle:{...typography.label,color:colors.white},compareTrayCopy:{...typography.caption,color:'#B9CCC4'},compareButton:{height:43,paddingHorizontal:spacing.md,borderRadius:radius.pill,backgroundColor:colors.gold,flexDirection:'row',alignItems:'center',gap:spacing.xs},compareButtonText:{...typography.label,color:colors.forest},compareScroll:{padding:spacing.lg,paddingBottom:spacing.xxxl},compareHeader:{flexDirection:'row',alignItems:'stretch'},rowLabel:{width:105,padding:spacing.sm,justifyContent:'center'},compareCountry:{width:175,padding:spacing.md,alignItems:'center',backgroundColor:colors.forest,borderRightWidth:1,borderRightColor:colors.forestSoft},compareFlag:{fontSize:30},compareName:{...typography.cardTitle,fontSize:19,color:colors.white,marginTop:spacing.xs},compareScore:{...typography.caption,fontWeight:'800',color:colors.gold},compareRow:{flexDirection:'row',minHeight:92,backgroundColor:colors.surface,borderBottomWidth:1,borderBottomColor:colors.line},compareRowAlt:{backgroundColor:'#F1E8DB'},rowLabelText:{...typography.caption,fontWeight:'800',color:colors.gold},compareCell:{width:175,padding:spacing.md,justifyContent:'center',borderLeftWidth:1,borderLeftColor:colors.line},compareValue:{...typography.caption,color:colors.ink},compareLegal:{maxWidth:105+175*3,marginTop:spacing.lg,padding:spacing.md,backgroundColor:'#EFE5D6',borderRadius:radius.md,flexDirection:'row',gap:spacing.sm},compareLegalText:{...typography.caption,color:colors.ink,flex:1},
});