import Mapbox from '@rnmapbox/maps';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, shadows, spacing } from '@/lib/theme';

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (accessToken) {
  Mapbox.setAccessToken(accessToken);
}

const points = [
  { id: 'scala', coordinate: [14.5258, 40.6558], image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=240' },
  { id: 'amalfi', coordinate: [14.6029, 40.634], image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=240' },
  { id: 'minori', coordinate: [14.6269, 40.6507], image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=240' },
] as const;

export function ExploreMap() {
  if (!accessToken) {
    return <View style={styles.missing}><Text style={styles.missingTitle}>Mapbox token required</Text><Text style={styles.missingText}>Add EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local and restart Expo.</Text></View>;
  }

  return (
    <View style={styles.root} accessibilityLabel="Interactive map of the Amalfi Coast">
      <Mapbox.MapView style={StyleSheet.absoluteFill} styleURL={Mapbox.StyleURL.Outdoors} logoEnabled={false} attributionEnabled={false} scaleBarEnabled={false}>
        <Mapbox.Camera defaultSettings={{ centerCoordinate: [14.59, 40.645], zoomLevel: 11.4 }} />
        <Mapbox.UserLocation visible />
        {points.map(point => (
          <Mapbox.PointAnnotation id={point.id} key={point.id} coordinate={[...point.coordinate]}>
            <View style={styles.photoPin}><Image source={point.image} style={styles.pinImage}/><View style={styles.pinTail}/></View>
          </Mapbox.PointAnnotation>
        ))}
        <Mapbox.PointAnnotation id="featured-amalfi" coordinate={[14.6029, 40.634]}>
          <View style={styles.heroPin}><Icon name="sparkle" color={colors.white} size={29}/><View style={[styles.pinTail,{borderTopColor:colors.gold}]}/></View>
        </Mapbox.PointAnnotation>
      </Mapbox.MapView>
      <View style={styles.mapActions}><AnimatedPressable accessibilityLabel="Find my location" style={styles.mapButton}><Icon name="locate"/></AnimatedPressable><AnimatedPressable accessibilityLabel="Change map layers" style={styles.mapButton}><Icon name="layers"/></AnimatedPressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,minHeight:310,overflow:'hidden'},missing:{flex:1,minHeight:310,alignItems:'center',justifyContent:'center',padding:spacing.xl,backgroundColor:'#DCE4CE'},missingTitle:{fontFamily:'Georgia',fontSize:22,fontWeight:'700',color:colors.ink},missingText:{maxWidth:300,marginTop:spacing.sm,textAlign:'center',lineHeight:20,color:colors.muted},photoPin:{alignItems:'center'},pinImage:{width:52,height:52,borderRadius:26,borderWidth:3,borderColor:colors.white},pinTail:{width:0,height:0,borderLeftWidth:7,borderRightWidth:7,borderTopWidth:10,borderLeftColor:'transparent',borderRightColor:'transparent',borderTopColor:'#A89B86',marginTop:-2},heroPin:{width:52,height:52,borderRadius:26,backgroundColor:colors.gold,borderWidth:3,borderColor:colors.white,alignItems:'center',justifyContent:'center',...shadows.floating},mapActions:{position:'absolute',right:spacing.lg,bottom:spacing.lg,gap:10},mapButton:{width:48,height:48,borderRadius:24,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',...shadows.soft},
});