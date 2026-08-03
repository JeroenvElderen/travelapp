import Mapbox from '@rnmapbox/maps';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, shadows, spacing } from '@/lib/theme';
import type { ExplorePlace } from '@/lib/explorePlaces';

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (accessToken) {
  Mapbox.setAccessToken(accessToken);
}

type Props = { places: ExplorePlace[]; onSelectPlace: (place: ExplorePlace) => void };

export function ExploreMap({ places, onSelectPlace }: Props) {
  if (!accessToken) {
    return <View style={styles.missing}><Text style={styles.missingTitle}>Mapbox token required</Text><Text style={styles.missingText}>Add EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local and restart Expo.</Text></View>;
  }

  return (
    <View style={styles.root} accessibilityLabel="Interactive map of the Amalfi Coast">
      <Mapbox.MapView style={StyleSheet.absoluteFill} styleURL={Mapbox.StyleURL.Outdoors} logoEnabled attributionEnabled scaleBarEnabled={false}>
        <Mapbox.Camera defaultSettings={{ centerCoordinate: [14.59, 40.645], zoomLevel: 11.4 }} />
        <Mapbox.UserLocation visible />
        {places.map(place => (
          <Mapbox.PointAnnotation id={place.id} key={place.id} coordinate={[...place.coordinate]} anchor={{ x: 0.5, y: 1 }} onSelected={() => onSelectPlace(place)}>
            <View style={styles.photoPin}><Image source={place.image} style={styles.pinImage}/><View style={styles.pinTail}/></View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
      <View style={styles.mapActions}><AnimatedPressable accessibilityLabel="Find my location" style={styles.mapButton}><Icon name="locate"/></AnimatedPressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,minHeight:420,overflow:'hidden'},missing:{flex:1,minHeight:420,alignItems:'center',justifyContent:'center',padding:spacing.xl,backgroundColor:'#DCE4CE'},missingTitle:{fontFamily:'Georgia',fontSize:22,fontWeight:'700',color:colors.ink},missingText:{maxWidth:300,marginTop:spacing.sm,textAlign:'center',lineHeight:20,color:colors.muted},photoPin:{width:62,height:68,alignItems:'center',justifyContent:'flex-start'},pinImage:{width:56,height:56,borderRadius:28,borderWidth:3,borderColor:colors.white},pinTail:{width:0,height:0,borderLeftWidth:7,borderRightWidth:7,borderTopWidth:10,borderLeftColor:'transparent',borderRightColor:'transparent',borderTopColor:'#A89B86',marginTop:-2},mapActions:{position:'absolute',right:spacing.lg,bottom:190,gap:10},mapButton:{width:48,height:48,borderRadius:24,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',...shadows.soft},
});