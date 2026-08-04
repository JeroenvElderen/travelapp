import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/lib/theme';
import type { ExplorePlace } from '@/lib/explorePlaces';

type Props = { places: ExplorePlace[]; selectedPlaceId?: string; onSelectPlace: (place: ExplorePlace) => void };

export function ExploreMap({ places, onSelectPlace }: Props) {
  return <View style={styles.root}><View style={styles.coast}/><Text style={styles.title}>Native map preview</Text><Text style={styles.text}>Mapbox needs an iOS or Android development build. Use the accessible list for all {places.length} results on web.</Text><View style={styles.previewPins}>{places.slice(0,5).map(place => <Text accessibilityRole="button" onPress={() => onSelectPlace(place)} key={place.id} style={styles.pin}>●</Text>)}</View></View>;
}

const styles = StyleSheet.create({root:{flex:1,minHeight:420,alignItems:'center',justifyContent:'center',padding:spacing.xl,backgroundColor:'#DCE4CE',overflow:'hidden'},coast:{position:'absolute',width:'140%',height:'45%',right:'-35%',bottom:'-8%',borderTopLeftRadius:220,backgroundColor:'#A9C9C7',transform:[{rotate:'-9deg'}]},title:{fontFamily:'Georgia',fontSize:22,fontWeight:'700',color:colors.ink},text:{maxWidth:330,marginTop:spacing.sm,textAlign:'center',lineHeight:20,color:colors.muted},previewPins:{position:'absolute',left:'18%',right:'15%',bottom:'25%',flexDirection:'row',justifyContent:'space-between'},pin:{fontSize:32,color:colors.forest,textShadowColor:colors.white,textShadowRadius:4}});