import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import { exploreLayers, type ExplorePlace } from '@/lib/explorePlaces';

type Props = { place: ExplorePlace; onBack: () => void };

export function PlaceDetailsScreen({ place, onBack }: Props) {
  const category = exploreLayers.find(layer => layer.id === place.layer);
  return <View style={styles.root}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image source={place.image} style={StyleSheet.absoluteFill}/>
        <View style={styles.scrim}/>
        <AnimatedPressable accessibilityLabel="Back to explore" onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></AnimatedPressable>
        <View style={styles.heroCopy}><Text style={styles.eyebrow}>{category?.label.toUpperCase()}</Text><Text style={styles.title}>{place.name}</Text><Text style={styles.location}>{place.region} · ★ {place.rating}</Text></View>
      </View>
      <View style={styles.body}>
        <Text style={styles.recommendation}>{place.recommendation}</Text>
        <View style={styles.facts}>
          <Fact icon="clock" label="TIME" value={place.duration}/><Fact icon="wallet" label="PRICE" value={place.price}/><Fact icon="sun" label="BEST TIME" value={place.bestTime}/>
        </View>
        <Text style={styles.sectionTitle}>Why go</Text><Text style={styles.description}>{place.description} Chosen as one of our 20 essential Amalfi Coast recommendations for its distinctive sense of place and memorable setting.</Text>
        <Text style={styles.sectionTitle}>Good to know</Text>
        <View style={styles.tip}><Icon name="sparkle" color={colors.gold}/><Text style={styles.tipText}>Allow extra time for the steep lanes and coastal traffic. Hours and prices can change seasonally, so verify before setting out.</Text></View>
        <Text style={styles.source}>Recommendation details are editorial sample content. Place and map data should be verified with the attributed provider before production use.</Text>
      </View>
    </ScrollView>
    <View style={styles.actions}><AnimatedPressable style={styles.save}><Icon name="bookmark"/><Text style={styles.saveText}>Save</Text></AnimatedPressable><AnimatedPressable style={styles.plan}><Icon name="plus" color={colors.white}/><Text style={styles.planText}>Add to plan</Text></AnimatedPressable></View>
  </View>;
}

function Fact({ icon, label, value }: { icon: 'clock'|'wallet'|'sun'; label: string; value: string }) { return <View style={styles.fact}><Icon name={icon} size={20} color={colors.forest}/><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},content:{paddingBottom:120},hero:{height:390,justifyContent:'flex-end',backgroundColor:colors.forest},scrim:{position:'absolute',top:0,right:0,bottom:0,left:0,backgroundColor:'rgba(5,20,15,.38)'},back:{position:'absolute',top:54,left:spacing.lg,width:46,height:46,borderRadius:23,backgroundColor:'rgba(255,252,247,.94)',alignItems:'center',justifyContent:'center',...shadows.soft},backText:{fontSize:38,lineHeight:40,color:colors.ink,marginTop:-3},heroCopy:{padding:spacing.xl,paddingBottom:spacing.xxl},eyebrow:{fontSize:11,fontWeight:'800',letterSpacing:1.4,color:'#F4CB83'},title:{...typography.display,fontSize:40,color:colors.white,marginTop:5},location:{color:colors.white,fontSize:14,marginTop:8},body:{padding:spacing.xl},recommendation:{...typography.title,fontSize:27,color:colors.ink},facts:{flexDirection:'row',gap:8,marginVertical:spacing.xl},fact:{flex:1,minHeight:100,padding:12,borderRadius:radius.md,backgroundColor:colors.surface,...shadows.soft},factLabel:{fontSize:9,fontWeight:'800',letterSpacing:.8,color:colors.muted,marginTop:10},factValue:{fontSize:13,fontWeight:'700',color:colors.ink,marginTop:3},sectionTitle:{...typography.cardTitle,color:colors.ink,marginTop:spacing.lg,marginBottom:spacing.sm},description:{...typography.body,color:colors.muted},tip:{padding:spacing.md,borderRadius:radius.md,backgroundColor:'#F0E7D8',flexDirection:'row',gap:12},tipText:{flex:1,fontSize:14,lineHeight:21,color:colors.ink},source:{fontSize:11,lineHeight:16,color:colors.muted,marginTop:spacing.xl},actions:{position:'absolute',left:0,right:0,bottom:0,padding:spacing.md,paddingBottom:28,flexDirection:'row',gap:10,backgroundColor:'rgba(248,245,239,.97)',borderTopWidth:1,borderTopColor:colors.line},save:{height:52,paddingHorizontal:22,borderRadius:radius.md,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',gap:8},saveText:{fontWeight:'800',color:colors.ink},plan:{height:52,flex:1,borderRadius:radius.md,backgroundColor:colors.forest,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},planText:{fontWeight:'800',color:colors.white},
});