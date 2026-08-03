import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppHeader } from '@/components/ui/AppHeader';
import { Icon } from '@/components/ui/Icon';
import { collaborativePlans, type CollaborativePlanType } from '@/lib/collaborationData';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

export function CollaborativePlansScreen() {
  const [activeType, setActiveType] = useState<CollaborativePlanType>('trip');
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const plan = useMemo(() => collaborativePlans.find(item => item.type === activeType) ?? collaborativePlans[0], [activeType]);
  const doneCount = plan.tasks.filter(task => completed[task.id] ?? task.completed).length;

  const sendInvite = () => {
    if (!email.trim()) return;
    setSent(true);
  };

  const closeInvite = () => {
    setInviteOpen(false);
    setEmail('');
    setSent(false);
  };

  return <View style={s.root}>
    <StatusBar style="dark" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
      <AppHeader />
      <View style={s.intro}>
        <Text style={s.kicker}>PLAN TOGETHER</Text>
        <Text style={s.title}>Shared adventures,{`\n`}made simple.</Text>
        <Text style={s.lead}>Keep decisions, tasks and every co-planner in one calm place.</Text>
      </View>

      <View style={s.switcher}>
        <PlanTab label="Trips" icon="plane" active={activeType === 'trip'} onPress={() => setActiveType('trip')} />
        <PlanTab label="Moving plans" icon="briefcase" active={activeType === 'move'} onPress={() => setActiveType('move')} />
      </View>

      <View style={s.planCard}>
        <View style={s.planTop}>
          <View style={s.planIcon}><Icon name={plan.type === 'trip' ? 'plane' : 'briefcase'} color={colors.gold} size={22} /></View>
          <Text style={s.eyebrow}>{plan.eyebrow}</Text>
          <AnimatedPressable accessibilityLabel="Plan options" style={s.more}><Icon name="more" size={20} /></AnimatedPressable>
        </View>
        <Text style={s.planTitle}>{plan.title}</Text>
        <View style={s.dateRow}><Icon name="calendar" size={17} color={colors.muted}/><Text style={s.date}>{plan.dates}</Text></View>
        <View style={s.progressHeader}><Text style={s.progressLabel}>Plan progress</Text><Text style={s.progressValue}>{plan.progress}%</Text></View>
        <View style={s.progressTrack}><View style={[s.progressFill, { width: `${plan.progress}%` }]} /></View>
        <View style={s.peopleRow}>
          <View style={s.avatars}>{plan.members.map((member, index) => <View key={member.id} accessibilityLabel={member.name} style={[s.avatar, { backgroundColor: member.color, marginLeft: index ? -8 : 0 }]}><Text style={s.avatarText}>{member.initials}</Text></View>)}</View>
          <Text style={s.peopleCopy}>{plan.members.length} people planning</Text>
          <AnimatedPressable onPress={() => setInviteOpen(true)} style={s.invite}><Icon name="plus" size={16} color={colors.forest}/><Text style={s.inviteText}>Invite</Text></AnimatedPressable>
        </View>
      </View>

      <View style={s.sectionHead}><View><Text style={s.sectionTitle}>Next up</Text><Text style={s.sectionMeta}>{doneCount} of {plan.tasks.length} complete</Text></View><AnimatedPressable accessibilityLabel="Add a task" style={s.add}><Icon name="plus" color={colors.white} size={20}/></AnimatedPressable></View>
      <View style={s.taskList}>{plan.tasks.map(task => {
        const isDone = completed[task.id] ?? task.completed;
        return <AnimatedPressable key={`${plan.id}-${task.id}`} onPress={() => setCompleted(current => ({ ...current, [task.id]: !isDone }))} style={s.task}>
          <View style={[s.check, isDone && s.checkDone]}>{isDone && <Icon name="check" color={colors.white} size={16} strokeWidth={2.5}/>}</View>
          <View style={s.taskCopy}><Text style={[s.taskTitle, isDone && s.taskTitleDone]}>{task.title}</Text><Text style={s.taskMeta}>{task.meta}</Text></View>
          <View style={s.assignee}><Text style={s.assigneeText}>{task.assignee}</Text></View>
        </AnimatedPressable>;
      })}</View>

      <View style={s.activity}>
        <View style={s.activityIcon}><Icon name="bell" color={colors.gold} size={19}/></View>
        <View style={s.taskCopy}><Text style={s.activityTitle}>Everything stays in sync</Text><Text style={s.activityText}>Comments, votes and updates appear here for everyone in the plan.</Text></View>
      </View>
    </ScrollView>

    <Modal visible={inviteOpen} transparent animationType="slide" onRequestClose={closeInvite}>
      <View style={s.modal}><Pressable accessibilityLabel="Close invite" onPress={closeInvite} style={s.scrim}/><View style={s.sheet}>
        <View style={s.handle}/>
        {sent ? <View style={s.sentState}><View style={s.sentIcon}><Icon name="check" color={colors.white} size={30}/></View><Text style={s.sheetTitle}>Invite sent</Text><Text style={s.sheetCopy}>They’ll be able to view, vote and help with tasks in “{plan.title}”.</Text><AnimatedPressable onPress={closeInvite} style={s.primary}><Text style={s.primaryText}>Done</Text></AnimatedPressable></View> : <>
          <Text style={s.kicker}>GROW THE PLAN</Text><Text style={s.sheetTitle}>Invite a co-planner</Text><Text style={s.sheetCopy}>Share the planning without losing track of who is doing what.</Text>
          <Text style={s.inputLabel}>Email address</Text><TextInput autoCapitalize="none" keyboardType="email-address" placeholder="friend@example.com" placeholderTextColor="#8A8E8B" value={email} onChangeText={setEmail} style={s.input}/>
          <View style={s.permission}><Icon name="pencil" color={colors.gold} size={18}/><Text style={s.permissionText}><Text style={s.permissionStrong}>Can edit</Text>{`\n`}Add ideas, vote and complete tasks</Text></View>
          <AnimatedPressable accessibilityState={{ disabled: !email.trim() }} onPress={sendInvite} style={[s.primary, !email.trim() && s.primaryDisabled]}><Text style={s.primaryText}>Send invitation</Text><Icon name="arrow" color={colors.white} size={19}/></AnimatedPressable>
        </>}
      </View></View>
    </Modal>
  </View>;
}

function PlanTab({ label, icon, active, onPress }: { label: string; icon: 'plane' | 'briefcase'; active: boolean; onPress: () => void }) {
  return <AnimatedPressable accessibilityLabel={`${label} plans`} accessibilityState={{ selected: active }} onPress={onPress} style={[s.tab, active && s.tabActive]}><Icon name={icon} size={18} color={active ? colors.white : colors.muted}/><Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text></AnimatedPressable>;
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},content:{paddingBottom:spacing.huge},intro:{paddingHorizontal:spacing.lg,paddingTop:spacing.sm},kicker:{fontSize:10,fontWeight:'800',letterSpacing:1.8,color:colors.gold,marginBottom:spacing.xs},title:{fontFamily:'Georgia',fontSize:39,lineHeight:44,fontWeight:'700',color:colors.ink},lead:{...typography.body,color:colors.muted,marginTop:spacing.sm,maxWidth:350},switcher:{margin:spacing.lg,padding:5,borderRadius:radius.pill,backgroundColor:'#ECE5DA',flexDirection:'row'},tab:{flex:1,height:46,borderRadius:radius.pill,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:spacing.xs},tabActive:{backgroundColor:colors.forest,...shadows.soft},tabText:{...typography.label,color:colors.muted},tabTextActive:{color:colors.white},planCard:{marginHorizontal:spacing.lg,padding:spacing.lg,borderRadius:radius.xl,backgroundColor:colors.forest,...shadows.floating},planTop:{flexDirection:'row',alignItems:'center'},planIcon:{width:40,height:40,borderRadius:20,backgroundColor:colors.forestSoft,alignItems:'center',justifyContent:'center',marginRight:spacing.sm},eyebrow:{fontSize:9,fontWeight:'800',letterSpacing:1.5,color:colors.gold,flex:1},more:{width:36,height:36,borderRadius:18,backgroundColor:colors.forestSoft,alignItems:'center',justifyContent:'center'},planTitle:{fontFamily:'Georgia',fontSize:29,lineHeight:35,fontWeight:'700',color:colors.white,marginTop:spacing.md},dateRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:6},date:{...typography.caption,color:'#BECFC8'},progressHeader:{flexDirection:'row',justifyContent:'space-between',marginTop:spacing.xl,marginBottom:spacing.xs},progressLabel:{...typography.caption,fontWeight:'700',color:colors.white},progressValue:{...typography.caption,fontWeight:'800',color:colors.gold},progressTrack:{height:7,borderRadius:4,backgroundColor:colors.forestSoft,overflow:'hidden'},progressFill:{height:'100%',borderRadius:4,backgroundColor:colors.gold},peopleRow:{flexDirection:'row',alignItems:'center',marginTop:spacing.lg},avatars:{flexDirection:'row'},avatar:{width:34,height:34,borderRadius:17,borderWidth:2,borderColor:colors.forest,alignItems:'center',justifyContent:'center'},avatarText:{fontSize:9,fontWeight:'800',color:colors.white},peopleCopy:{...typography.caption,color:'#BECFC8',marginLeft:spacing.xs,flex:1},invite:{height:36,paddingHorizontal:spacing.sm,borderRadius:radius.pill,backgroundColor:colors.gold,flexDirection:'row',alignItems:'center',gap:4},inviteText:{...typography.caption,fontWeight:'800',color:colors.forest},sectionHead:{paddingHorizontal:spacing.lg,marginTop:spacing.xxl,marginBottom:spacing.sm,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{...typography.title,color:colors.ink},sectionMeta:{...typography.caption,color:colors.muted,marginTop:2},add:{width:42,height:42,borderRadius:21,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center'},taskList:{marginHorizontal:spacing.lg,borderRadius:radius.lg,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,overflow:'hidden',...shadows.soft},task:{minHeight:80,paddingHorizontal:spacing.md,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderBottomColor:colors.line},check:{width:25,height:25,borderRadius:8,borderWidth:1.5,borderColor:'#B8B6B0',alignItems:'center',justifyContent:'center',marginRight:spacing.sm},checkDone:{backgroundColor:colors.gold,borderColor:colors.gold},taskCopy:{flex:1},taskTitle:{...typography.label,color:colors.ink},taskTitleDone:{textDecorationLine:'line-through',color:colors.muted},taskMeta:{...typography.caption,color:colors.muted,marginTop:3},assignee:{width:32,height:32,borderRadius:16,backgroundColor:'#EDE2D2',alignItems:'center',justifyContent:'center',marginLeft:spacing.xs},assigneeText:{fontSize:9,fontWeight:'800',color:colors.forest},activity:{margin:spacing.lg,padding:spacing.md,borderRadius:radius.lg,backgroundColor:'#EFE6D8',flexDirection:'row',gap:spacing.sm},activityIcon:{width:36,height:36,borderRadius:18,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center'},activityTitle:{...typography.label,color:colors.ink},activityText:{...typography.caption,color:colors.muted,marginTop:2},modal:{flex:1,justifyContent:'flex-end'},scrim:{...StyleSheet.absoluteFill,backgroundColor:colors.overlay},sheet:{backgroundColor:colors.canvas,borderTopLeftRadius:radius.xl,borderTopRightRadius:radius.xl,padding:spacing.lg,paddingBottom:spacing.huge},handle:{width:42,height:4,borderRadius:2,backgroundColor:'#CDC7BD',alignSelf:'center',marginBottom:spacing.xl},sheetTitle:{...typography.title,fontSize:29,color:colors.ink},sheetCopy:{...typography.body,color:colors.muted,marginTop:spacing.xs,marginBottom:spacing.xl},inputLabel:{...typography.label,color:colors.ink,marginBottom:spacing.xs},input:{height:54,borderRadius:radius.md,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,paddingHorizontal:spacing.md,fontSize:15,color:colors.ink},permission:{padding:spacing.md,marginTop:spacing.md,borderRadius:radius.md,backgroundColor:'#EEE5D7',flexDirection:'row',gap:spacing.sm,alignItems:'center'},permissionText:{...typography.caption,color:colors.muted},permissionStrong:{...typography.label,color:colors.ink},primary:{height:56,borderRadius:radius.pill,backgroundColor:colors.forest,marginTop:spacing.xl,flexDirection:'row',gap:spacing.sm,alignItems:'center',justifyContent:'center'},primaryDisabled:{opacity:.4},primaryText:{...typography.label,fontSize:16,color:colors.white},sentState:{alignItems:'center'},sentIcon:{width:62,height:62,borderRadius:31,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center',marginBottom:spacing.md},
});