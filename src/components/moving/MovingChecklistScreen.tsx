import { useMemo, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Modal, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { buildChecklist, defaultMoveProfile, moveChecklistDates, phaseMeta, type ChecklistItem, type MoveProfile } from '@/lib/movingChecklist';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

type Props = { onBack: () => void };

const friendlyDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function MovingChecklistScreen({ onBack }: Props) {
  const [profile, setProfile] = useState(defaultMoveProfile);
  const [items, setItems] = useState(() => buildChecklist(defaultMoveProfile));
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState(profile);
  const [expanded, setExpanded] = useState<string | null>('passport');
  const [newItem, setNewItem] = useState('');
  const [reminders, setReminders] = useState(false);
  const completed = items.filter(item => item.completed).length;
  const progress = Math.round(completed / items.length * 100);

  const upcoming = useMemo(() => items.filter(item => !item.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0], [items]);
  const patchItem = (id: string, patch: Partial<ChecklistItem>) => setItems(current => current.map(item => item.id === id ? { ...item, ...patch } : item));

  const saveProfile = () => {
    setItems(current => {
      const shifted = moveChecklistDates(current, profile.moveDate, draftProfile.moveDate);
      const byId = new Map(shifted.map(item => [item.id, item]));
      const generated = buildChecklist(draftProfile).map(item => {
        const previous = byId.get(item.id);
        return previous ? { ...item, dueDate: previous.dueDate, completed: previous.completed, notes: previous.notes } : item;
      });
      return [...generated, ...shifted.filter(item => item.custom)];
    });
    setProfile(draftProfile);
    setEditingProfile(false);
  };
  const addItem = () => {
    const title = newItem.trim();
    if (!title) return;
    const item: ChecklistItem = { id: `custom-${Date.now()}`, phase: 'one-three', title, detail: 'Personal checklist item', dueDate: profile.moveDate, completed: false, notes: '', custom: true };
    setItems(current => [...current, item]); setNewItem(''); setExpanded(item.id);
  };
  const toggleReminders = async (value: boolean) => {
    setReminders(value);
    if (!value || !upcoming) return;
    const permission = await Notifications.requestPermissionsAsync();
    if (permission.status !== 'granted') { setReminders(false); return; }
    const date = new Date(`${upcoming.dueDate}T09:00:00`);
    if (date.getTime() > Date.now()) await Notifications.scheduleNotificationAsync({ content: { title: 'Moving plan reminder', body: upcoming.title }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date } });
  };

  return <View style={s.root}>
    <StatusBar style="light" />
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <View style={s.topbar}><AnimatedPressable onPress={onBack} style={s.back}><Icon name="arrow" color={colors.white} size={20}/></AnimatedPressable><Text style={s.topTitle}>MOVING PLAN</Text><AnimatedPressable onPress={() => { setDraftProfile(profile); setEditingProfile(true); }} style={s.edit}><Icon name="pencil" color={colors.white} size={18}/></AnimatedPressable></View>
        <Text style={s.eyebrow}>YOUR PERSONALISED TIMELINE</Text><Text style={s.title}>{profile.destination} is on the horizon.</Text>
        <Text style={s.subtitle}>{profile.nationality} · {profile.household} · {profile.visaPathway}</Text>
        <View style={s.dateRow}><View style={s.dateIcon}><Icon name="calendar" color={colors.gold}/></View><View style={s.dateCopy}><Text style={s.dateLabel}>TARGET MOVE</Text><Text style={s.dateValue}>{friendlyDate(profile.moveDate)}</Text></View><AnimatedPressable onPress={() => { setDraftProfile(profile); setEditingProfile(true); }}><Text style={s.change}>Change</Text></AnimatedPressable></View>
      </View>

      <View style={s.body}>
        <View style={s.progressCard}><View style={s.progressHead}><View><Text style={s.cardKicker}>YOUR PROGRESS</Text><Text style={s.progressTitle}>{completed} of {items.length} complete</Text></View><Text style={s.percent}>{progress}%</Text></View><View style={s.track}><View style={[s.fill, { width: `${progress}%` }]}/></View>{upcoming && <Text style={s.next}>Next: {upcoming.title} · {friendlyDate(upcoming.dueDate)}</Text>}</View>
        <View style={s.reminderCard}><View style={s.reminderIcon}><Icon name="bell" color={colors.gold}/></View><View style={s.reminderCopy}><Text style={s.reminderTitle}>Planning reminders</Text><Text style={s.muted}>{reminders ? 'Your next deadline reminder is scheduled.' : 'Get a gentle nudge before your next deadline.'}</Text></View><Switch value={reminders} onValueChange={toggleReminders} trackColor={{ false: colors.line, true: colors.gold }} thumbColor={colors.white}/></View>
        <View style={s.notice}><Icon name="document" color={colors.forest} size={20}/><Text style={s.noticeText}><Text style={s.noticeStrong}>Keep documents private. </Text>This plan references requirements only. Don’t upload passports or identity documents here.</Text></View>

        {phaseMeta.map((phase, phaseIndex) => {
          const phaseItems = items.filter(item => item.phase === phase.id);
          return <View key={phase.id} style={s.phase}>
            <View style={s.phaseHead}><View style={s.phaseNumber}><Text style={s.phaseNumberText}>{phaseIndex + 1}</Text></View><View style={s.phaseCopy}><Text style={s.phaseTitle}>{phase.label}</Text><Text style={s.muted}>{phase.description}</Text></View><Text style={s.phaseCount}>{phaseItems.filter(i => i.completed).length}/{phaseItems.length}</Text></View>
            <View style={s.itemCard}>{phaseItems.map((item, index) => {
              const open = expanded === item.id;
              return <View key={item.id} style={[s.item, index > 0 && s.itemBorder]}>
                <View style={s.itemRow}><AnimatedPressable accessibilityLabel={`Mark ${item.title} ${item.completed ? 'incomplete' : 'complete'}`} onPress={() => patchItem(item.id, { completed: !item.completed })} style={[s.checkbox, item.completed && s.checkboxDone]}>{item.completed && <Icon name="check" color={colors.white} size={16}/>}</AnimatedPressable><AnimatedPressable onPress={() => setExpanded(open ? null : item.id)} style={s.itemMain}><Text style={[s.itemTitle, item.completed && s.itemTitleDone]}>{item.title}</Text><View style={s.due}><Icon name="clock" size={13} color={colors.gold}/><Text style={s.dueText}>{friendlyDate(item.dueDate)}</Text>{item.notes ? <View style={s.noteDot}/> : null}</View></AnimatedPressable><AnimatedPressable onPress={() => setExpanded(open ? null : item.id)} style={s.chevron}><Text style={s.chevronText}>{open ? '−' : '+'}</Text></AnimatedPressable></View>
                {open && <View style={s.details}><Text style={s.detailText}>{item.detail}</Text><Text style={s.inputLabel}>DEADLINE</Text><TextInput accessibilityLabel="Deadline" value={item.dueDate} onChangeText={dueDate => patchItem(item.id, { dueDate })} placeholder="YYYY-MM-DD" style={s.input}/><Text style={s.inputLabel}>NOTES</Text><TextInput accessibilityLabel="Notes" value={item.notes} onChangeText={notes => patchItem(item.id, { notes })} placeholder="Add a private note or useful link…" multiline style={[s.input, s.notes]}/></View>}
              </View>;
            })}</View>
          </View>;
        })}

        <View style={s.addCard}><View style={s.addIcon}><Icon name="plus" color={colors.gold}/></View><Text style={s.addTitle}>Add your own task</Text><Text style={s.muted}>Every move is different. Add anything you want to remember.</Text><View style={s.addRow}><TextInput value={newItem} onChangeText={setNewItem} onSubmitEditing={addItem} placeholder="e.g. Cancel gym membership" placeholderTextColor={colors.muted} style={[s.input, s.addInput]}/><AnimatedPressable onPress={addItem} style={s.addButton}><Icon name="arrow" color={colors.white} size={20}/></AnimatedPressable></View></View>
      </View>
    </ScrollView>

    <Modal visible={editingProfile} animationType="slide" transparent onRequestClose={() => setEditingProfile(false)}><View style={s.modalOverlay}><View style={s.sheet}><View style={s.sheetHandle}/><Text style={s.sheetTitle}>Personalise your plan</Text><Text style={s.sheetSubtitle}>Future, incomplete deadlines shift with your move date.</Text><ProfileInput label="DESTINATION COUNTRY" value={draftProfile.destination} onChangeText={destination => setDraftProfile(p => ({ ...p, destination }))}/><ProfileInput label="NATIONALITY" value={draftProfile.nationality} onChangeText={nationality => setDraftProfile(p => ({ ...p, nationality }))}/><ProfileInput label="TARGET MOVE DATE" value={draftProfile.moveDate} onChangeText={moveDate => setDraftProfile(p => ({ ...p, moveDate }))}/><ProfileInput label="VISA PATHWAY" value={draftProfile.visaPathway} onChangeText={visaPathway => setDraftProfile(p => ({ ...p, visaPathway }))}/><ProfileInput label="HOUSEHOLD" value={draftProfile.household} onChangeText={household => setDraftProfile(p => ({ ...p, household }))}/><ProfileInput label="EMPLOYMENT" value={draftProfile.employment} onChangeText={employment => setDraftProfile(p => ({ ...p, employment }))}/><Toggle label="Pets are moving" value={draftProfile.pets} onChange={pets => setDraftProfile(p => ({ ...p, pets }))}/><Toggle label="Children need education" value={draftProfile.education} onChange={education => setDraftProfile(p => ({ ...p, education }))}/><Toggle label="I plan to drive" value={draftProfile.driving} onChange={driving => setDraftProfile(p => ({ ...p, driving }))}/><View style={s.sheetActions}><AnimatedPressable onPress={() => setEditingProfile(false)} style={s.cancelButton}><Text style={s.cancelText}>Cancel</Text></AnimatedPressable><AnimatedPressable onPress={saveProfile} style={s.saveButton}><Text style={s.saveText}>Update timeline</Text></AnimatedPressable></View></View></View></Modal>
  </View>;
}

function ProfileInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) { return <View style={s.profileField}><Text style={s.inputLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} style={s.input}/></View>; }
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) { return <View style={s.toggle}><Text style={s.toggleLabel}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.line, true: colors.gold }} thumbColor={colors.white}/></View>; }

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},content:{paddingBottom:50},hero:{backgroundColor:colors.forest,paddingHorizontal:spacing.lg,paddingTop:52,paddingBottom:spacing.xxl,borderBottomLeftRadius:32,borderBottomRightRadius:32},topbar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:spacing.xxxl},back:{width:42,height:42,borderRadius:21,backgroundColor:colors.forestSoft,alignItems:'center',justifyContent:'center',transform:[{rotate:'180deg'}]},edit:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:'#537167',alignItems:'center',justifyContent:'center'},topTitle:{fontSize:11,fontWeight:'800',letterSpacing:2,color:'#C9D7D1'},eyebrow:{fontSize:10,fontWeight:'800',letterSpacing:1.8,color:colors.gold},title:{fontFamily:'Georgia',fontSize:36,lineHeight:42,fontWeight:'700',color:colors.white,marginTop:spacing.sm,maxWidth:330},subtitle:{...typography.caption,color:'#BED0C8',marginTop:spacing.sm},dateRow:{marginTop:spacing.xl,padding:spacing.md,borderRadius:radius.lg,backgroundColor:colors.forestSoft,flexDirection:'row',alignItems:'center'},dateIcon:{width:42,height:42,borderRadius:21,backgroundColor:'#365C50',alignItems:'center',justifyContent:'center'},dateCopy:{flex:1,marginLeft:spacing.sm},dateLabel:{fontSize:9,fontWeight:'800',letterSpacing:1.4,color:'#AFC3BB'},dateValue:{fontFamily:'Georgia',fontSize:18,fontWeight:'700',color:colors.white,marginTop:2},change:{fontSize:12,fontWeight:'800',color:colors.gold},body:{padding:spacing.lg},progressCard:{padding:spacing.lg,borderRadius:radius.lg,backgroundColor:colors.surface,...shadows.soft},progressHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'},cardKicker:{fontSize:9,fontWeight:'800',letterSpacing:1.3,color:colors.gold},progressTitle:{...typography.cardTitle,fontSize:20,marginTop:4},percent:{fontFamily:'Georgia',fontSize:25,fontWeight:'700',color:colors.gold},track:{height:8,borderRadius:4,backgroundColor:colors.line,marginTop:spacing.md,overflow:'hidden'},fill:{height:8,borderRadius:4,backgroundColor:colors.gold},next:{...typography.caption,color:colors.muted,marginTop:spacing.sm},reminderCard:{marginTop:spacing.sm,padding:spacing.md,borderRadius:radius.lg,backgroundColor:'#EFE6D8',flexDirection:'row',alignItems:'center'},reminderIcon:{width:40,height:40,borderRadius:20,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center'},reminderCopy:{flex:1,marginHorizontal:spacing.sm},reminderTitle:{...typography.label,color:colors.ink},muted:{...typography.caption,color:colors.muted},notice:{marginTop:spacing.lg,padding:spacing.md,borderRadius:radius.md,backgroundColor:'#E2ECE7',flexDirection:'row',alignItems:'flex-start',gap:spacing.sm},noticeText:{...typography.caption,color:colors.forest,flex:1},noticeStrong:{fontWeight:'800'},phase:{marginTop:spacing.xxl},phaseHead:{flexDirection:'row',alignItems:'center',marginBottom:spacing.sm},phaseNumber:{width:30,height:30,borderRadius:15,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center'},phaseNumberText:{fontSize:12,fontWeight:'800',color:colors.white},phaseCopy:{flex:1,marginLeft:spacing.sm},phaseTitle:{fontFamily:'Georgia',fontSize:21,fontWeight:'700',color:colors.ink},phaseCount:{fontSize:11,fontWeight:'800',color:colors.gold},itemCard:{borderRadius:radius.lg,backgroundColor:colors.surface,paddingHorizontal:spacing.md,borderWidth:1,borderColor:colors.line},item:{paddingVertical:spacing.md},itemBorder:{borderTopWidth:1,borderTopColor:colors.line},itemRow:{flexDirection:'row',alignItems:'center'},checkbox:{width:25,height:25,borderRadius:8,borderWidth:1.5,borderColor:'#C9B99F',alignItems:'center',justifyContent:'center'},checkboxDone:{backgroundColor:colors.forest,borderColor:colors.forest},itemMain:{flex:1,marginLeft:spacing.sm},itemTitle:{...typography.label,color:colors.ink},itemTitleDone:{textDecorationLine:'line-through',color:colors.muted},due:{flexDirection:'row',alignItems:'center',gap:4,marginTop:3},dueText:{fontSize:11,color:colors.muted},noteDot:{width:5,height:5,borderRadius:3,backgroundColor:colors.gold,marginLeft:4},chevron:{width:30,height:30,alignItems:'center',justifyContent:'center'},chevronText:{fontSize:22,color:colors.gold},details:{paddingLeft:37,paddingTop:spacing.sm},detailText:{...typography.caption,color:colors.muted,lineHeight:18,marginBottom:spacing.sm},inputLabel:{fontSize:9,fontWeight:'800',letterSpacing:1.2,color:colors.gold,marginBottom:5},input:{height:44,borderRadius:radius.sm,borderWidth:1,borderColor:colors.line,backgroundColor:colors.canvas,paddingHorizontal:spacing.sm,fontSize:14,color:colors.ink,marginBottom:spacing.sm},notes:{height:72,paddingTop:spacing.sm,textAlignVertical:'top'},addCard:{marginTop:spacing.xxl,padding:spacing.lg,borderRadius:radius.lg,borderWidth:1,borderStyle:'dashed',borderColor:'#C9B99F',alignItems:'center'},addIcon:{width:42,height:42,borderRadius:21,backgroundColor:'#EFE6D8',alignItems:'center',justifyContent:'center'},addTitle:{...typography.cardTitle,fontSize:20,marginTop:spacing.sm},addRow:{flexDirection:'row',marginTop:spacing.md},addInput:{flex:1,marginBottom:0,borderTopRightRadius:0,borderBottomRightRadius:0},addButton:{width:48,height:44,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center',borderTopRightRadius:radius.sm,borderBottomRightRadius:radius.sm},modalOverlay:{flex:1,backgroundColor:colors.overlay,justifyContent:'flex-end'},sheet:{maxHeight:'93%',backgroundColor:colors.surface,borderTopLeftRadius:radius.xl,borderTopRightRadius:radius.xl,padding:spacing.lg},sheetHandle:{width:44,height:4,borderRadius:2,backgroundColor:colors.line,alignSelf:'center',marginBottom:spacing.md},sheetTitle:{...typography.title,color:colors.ink},sheetSubtitle:{...typography.caption,color:colors.muted,marginTop:4,marginBottom:spacing.md},profileField:{},toggle:{height:42,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:colors.line},toggleLabel:{...typography.label,color:colors.ink},sheetActions:{flexDirection:'row',gap:spacing.sm,marginTop:spacing.md},cancelButton:{height:50,flex:1,borderRadius:radius.pill,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},cancelText:{fontWeight:'800',color:colors.ink},saveButton:{height:50,flex:2,borderRadius:radius.pill,backgroundColor:colors.gold,alignItems:'center',justifyContent:'center'},saveText:{fontWeight:'800',color:colors.forest},
});