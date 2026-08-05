import { useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExploreMap } from '@/components/explore/ExploreMap';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useAppMenu } from '@/components/navigation/AppMenuContext';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import { distanceFromRouteKm, exploreLayers, explorePlaces, type ExploreLayerId, type ExplorePlace } from '@/lib/explorePlaces';

type Props = { onOpenPlace: (place: ExplorePlace) => void };

const initialLayers: ExploreLayerId[] = ['attractions', 'beaches', 'hiking', 'museums', 'restaurants', 'experiences'];
const detourOptions = [2, 5, 10, 25];
type Coordinate = readonly [number, number];
type RouteState = { origin: Coordinate; destination: Coordinate; geometry: Coordinate[]; label: string; distanceMeters: number; durationSeconds: number };
type DirectionsResponse = { code?: string; routes?: Array<{ distance: number; duration: number; geometry: { type: 'LineString'; coordinates: Coordinate[] } }> };

export function ExploreScreen({ onOpenPlace }: Props) {
  const insets = useSafeAreaInsets();
  const openMenu = useAppMenu();
  const [query, setQuery] = useState('');
  const [layersOpen, setLayersOpen] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState<ExploreLayerId[]>(initialLayers);
  const [selectedPlace, setSelectedPlace] = useState<ExplorePlace | null>(null);
  const [route, setRoute] = useState<RouteState | null>(null);
  const [routeStatus, setRouteStatus] = useState('');
  const [detourKm, setDetourKm] = useState(10);

  const places = useMemo(() => {
    const term = route ? '' : query.trim().toLowerCase();
    return explorePlaces.filter(place => enabledLayers.includes(place.layer)
      && (!term || `${place.name} ${place.region} ${place.tags.join(' ')}`.toLowerCase().includes(term))
      && (!route || distanceFromRouteKm(place.coordinate, route.geometry) <= detourKm));
  }, [detourKm, enabledLayers, query, route]);

  const planRoute = async () => {
    const destination = query.trim();
    if (!destination) {
      setRouteStatus('Enter a destination first, for example Galway.');
      return;
    }

    try {
      setRouteStatus('Requesting location access…');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setRoute(null);
        setRouteStatus('Location permission was denied. Enable it in phone settings to draw a route.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setRouteStatus(`Finding ${destination}…`);
      const matches = await Location.geocodeAsync(destination);
      const match = matches[0];
      if (!match) {
        setRoute(null);
        setRouteStatus(`We could not find ${destination}. Try a more specific destination.`);
        return;
      }

      const origin: Coordinate = [currentLocation.coords.longitude, currentLocation.coords.latitude];
      const destinationCoordinate: Coordinate = [match.longitude, match.latitude];
      const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!accessToken) {
        setRoute(null);
        setRouteStatus('A Mapbox access token is required to calculate a road route.');
        return;
      }

      setRouteStatus(`Calculating the best driving route to ${destination}…`);
      const coordinates = `${origin.join(',')};${destinationCoordinate.join(',')}`;
      const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordinates}?alternatives=false&geometries=geojson&overview=full&steps=false&access_token=${encodeURIComponent(accessToken)}`);
      const directions = await response.json() as DirectionsResponse;
      const bestRoute = directions.routes?.[0];
      if (!response.ok || directions.code !== 'Ok' || !bestRoute) {
        setRoute(null);
        setRouteStatus(`We could not find a driving route to ${destination}.`);
        return;
      }

      setRoute({
        origin,
        destination: destinationCoordinate,
        geometry: bestRoute.geometry.coordinates,
        label: destination,
        distanceMeters: bestRoute.distance,
        durationSeconds: bestRoute.duration,
      });
      setSelectedPlace(null);
      setRouteStatus(`Route to ${destination} · adjust nearby places in layers.`);
    } catch {
      setRoute(null);
      setRouteStatus('Could not get your location or destination right now. Please try again.');
    }
  };

  const toggleLayer = (id: ExploreLayerId, available: boolean) => {
    if (!available) return;
    setEnabledLayers(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ExploreMap places={places} selectedPlaceId={selectedPlace?.id} onSelectPlace={setSelectedPlace} route={route} detourKm={detourKm}/>

      <View style={[styles.topControls, { top: insets.top + spacing.sm }]}>
        <AnimatedPressable accessibilityHint="Opens navigation to every section" accessibilityLabel="Open main menu" onPress={openMenu} style={styles.roundButton}><Icon name="menu" color={colors.white}/></AnimatedPressable>
        <View style={styles.search}>
          <Icon name="search" size={21}/>
          <TextInput value={query} onChangeText={setQuery} accessibilityLabel="Search places in the visible map area" placeholder="Where do you want to explore?" placeholderTextColor={colors.muted} style={styles.input}/>
          {!!query && <AnimatedPressable accessibilityLabel="Clear search" hitSlop={8} onPress={() => { setQuery(''); setRouteStatus(''); }} style={styles.clearSearch}><Text style={styles.clearSearchText}>×</Text></AnimatedPressable>}
        </View>
        <AnimatedPressable accessibilityLabel="Open map layers" accessibilityState={{ expanded: layersOpen }} onPress={() => setLayersOpen(value => !value)} style={[styles.roundButton, layersOpen && styles.filterActive]}><Icon name="layers" color={colors.white}/></AnimatedPressable>
      </View>

      {!!query && !route && <AnimatedPressable accessibilityLabel="Use my location and navigate to the searched destination" onPress={planRoute} style={[styles.navigatePill, { top: insets.top + 76 }]}><Icon name="locate" size={16} color={colors.white}/><Text numberOfLines={1} style={styles.navigateText}>Route to {query.trim() || 'destination'}</Text></AnimatedPressable>}
      {!!routeStatus && <View style={[styles.statusPill, { top: insets.top + (query && !route ? 126 : 76) }]}><Text numberOfLines={2} style={styles.routeStatus}>{routeStatus}</Text>{route && <AnimatedPressable accessibilityLabel="Clear destination route" onPress={() => { setRoute(null); setRouteStatus(''); }}><Text style={styles.clearRouteText}>Clear</Text></AnimatedPressable>}</View>}

      {layersOpen && <View style={[styles.layerPanel, { top: insets.top + 76 }]} accessibilityLabel="Map layer selector">
        <View style={styles.panelHeading}><View><Text style={styles.panelTitle}>Map layers</Text><Text style={styles.panelSubtitle}>Choose what appears on your map.</Text></View><AnimatedPressable accessibilityLabel="Close layers" onPress={() => setLayersOpen(false)}><Text style={styles.close}>×</Text></AnimatedPressable></View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {route && <View style={styles.detourSection}>
            <View style={styles.detourHeading}><View><Text style={styles.detourTitle}>Places near your route</Text><Text style={styles.detourSubtitle}>Maximum distance from the navigation line</Text></View><Text style={styles.nearbyCount}>{places.length} nearby</Text></View>
            <View style={styles.detourOptions}>{detourOptions.map(distance => <AnimatedPressable key={distance} accessibilityLabel={`Show places within ${distance} kilometers of the route`} accessibilityState={{ selected: detourKm === distance }} onPress={() => setDetourKm(distance)} style={[styles.detourChip, detourKm === distance && styles.detourChipActive]}><Text style={[styles.detourChipText, detourKm === distance && styles.detourChipTextActive]}>{distance} km</Text></AnimatedPressable>)}</View>
          </View>}
          {(['Travel', 'Relocation'] as const).map(group => <View key={group}><Text style={styles.groupLabel}>{group}</Text><View style={styles.layerGrid}>{exploreLayers.filter(layer => layer.group === group).map(layer => { const active = enabledLayers.includes(layer.id); return <AnimatedPressable key={layer.id} accessibilityState={{ checked: active, disabled: !layer.available }} onPress={() => toggleLayer(layer.id, layer.available)} style={[styles.layerChip, active && styles.layerChipActive, !layer.available && styles.layerChipDisabled]}><View style={[styles.dot,{backgroundColor:layer.available ? layer.color : '#B8B8B5'}]}/><Text style={[styles.layerText,active && styles.layerTextActive]}>{layer.label}</Text>{!layer.available && <Text style={styles.noData}>No data</Text>}</AnimatedPressable>; })}</View></View>)}
        </ScrollView>
      </View>}

      <View pointerEvents="none" style={styles.resultPill}><Text style={styles.resultText}>{places.length} places</Text></View>

      {selectedPlace && <AnimatedPressable accessibilityHint="Opens the place details screen" accessibilityLabel={`View details for ${selectedPlace.name}`} onPress={() => onOpenPlace(selectedPlace)} style={styles.placeCard}>
        <Image source={selectedPlace.image} style={styles.cardImage}/><View style={styles.details}><View style={styles.detailTop}><Text style={styles.eyebrow}>{exploreLayers.find(layer => layer.id === selectedPlace.layer)?.label.toUpperCase()}</Text></View><Text style={styles.cardTitle}>{selectedPlace.name}</Text><Text style={styles.locationText}>{selectedPlace.region} · ★ {selectedPlace.rating} · {selectedPlace.duration}</Text><Text numberOfLines={2} style={styles.description}>{selectedPlace.recommendation}</Text><Text style={styles.viewDetails}>View details →</Text></View>
      </AnimatedPressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},topControls:{position:'absolute',left:spacing.sm,right:spacing.sm,zIndex:7,flexDirection:'row',alignItems:'center',gap:8},roundButton:{width:52,height:52,borderRadius:26,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center',...shadows.soft},search:{height:52,flex:1,backgroundColor:'rgba(255,252,247,.96)',borderRadius:radius.pill,flexDirection:'row',alignItems:'center',paddingLeft:spacing.md,paddingRight:spacing.sm,...shadows.soft},input:{flex:1,fontSize:15,color:colors.ink,paddingHorizontal:spacing.sm},clearSearch:{width:28,height:28,alignItems:'center',justifyContent:'center'},clearSearchText:{fontSize:25,lineHeight:26,color:colors.muted},filterActive:{backgroundColor:colors.gold},navigatePill:{position:'absolute',alignSelf:'center',zIndex:6,maxWidth:'78%',paddingVertical:9,paddingHorizontal:15,borderRadius:radius.pill,backgroundColor:colors.forest,flexDirection:'row',alignItems:'center',gap:7,...shadows.soft},navigateText:{fontSize:12,fontWeight:'800',color:colors.white},statusPill:{position:'absolute',alignSelf:'center',zIndex:6,maxWidth:'82%',paddingVertical:8,paddingHorizontal:13,borderRadius:radius.pill,backgroundColor:'rgba(255,252,247,.96)',flexDirection:'row',alignItems:'center',gap:10,...shadows.soft},clearRouteText:{fontSize:12,fontWeight:'800',color:colors.gold},routeStatus:{flexShrink:1,fontSize:11,fontWeight:'600',color:colors.muted,textAlign:'center'},detourSection:{marginTop:spacing.md,paddingBottom:spacing.md,borderBottomWidth:1,borderBottomColor:colors.line},detourHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},detourTitle:{fontSize:13,fontWeight:'800',color:colors.ink},detourSubtitle:{fontSize:10,color:colors.muted,marginTop:2},nearbyCount:{fontSize:11,fontWeight:'800',color:colors.forest},detourOptions:{flexDirection:'row',gap:7,marginTop:10},detourChip:{flex:1,alignItems:'center',paddingVertical:7,borderRadius:radius.pill,backgroundColor:'#EAE4DB'},detourChipActive:{backgroundColor:colors.forest},detourChipText:{fontSize:11,fontWeight:'800',color:colors.muted},detourChipTextActive:{color:colors.white},layerPanel:{position:'absolute',left:spacing.sm,right:spacing.sm,maxHeight:'62%',zIndex:8,padding:spacing.lg,borderRadius:radius.xl,backgroundColor:colors.surface,...shadows.floating},panelHeading:{flexDirection:'row',justifyContent:'space-between'},panelTitle:{...typography.title,color:colors.ink},panelSubtitle:{fontSize:12,color:colors.muted,marginTop:2},close:{fontSize:30,lineHeight:30,color:colors.muted,paddingHorizontal:5},groupLabel:{marginTop:spacing.lg,marginBottom:spacing.xs,fontSize:12,fontWeight:'800',letterSpacing:1.2,color:colors.gold,textTransform:'uppercase'},layerGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},layerChip:{height:38,paddingHorizontal:11,borderRadius:radius.pill,borderWidth:1,borderColor:colors.line,flexDirection:'row',alignItems:'center',gap:6},layerChipActive:{backgroundColor:colors.forest,borderColor:colors.forest},layerChipDisabled:{opacity:.55,backgroundColor:'#EFEDEA'},dot:{width:9,height:9,borderRadius:5},layerText:{fontSize:12,fontWeight:'600',color:colors.ink},layerTextActive:{color:colors.white},noData:{fontSize:9,color:colors.muted},resultPill:{position:'absolute',left:spacing.md,bottom:108,zIndex:2,paddingVertical:8,paddingHorizontal:13,borderRadius:radius.pill,backgroundColor:'rgba(255,252,247,.94)',...shadows.soft},resultText:{fontSize:11,fontWeight:'800',color:colors.ink},placeCard:{position:'absolute',left:spacing.sm,right:spacing.sm,bottom:108,height:164,padding:10,borderRadius:26,backgroundColor:colors.surface,flexDirection:'row',zIndex:5,...shadows.floating},cardImage:{width:'39%',height:'100%',borderRadius:19},details:{flex:1,padding:8,paddingLeft:13,justifyContent:'center'},detailTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},eyebrow:{fontSize:10,color:colors.gold,fontWeight:'800',letterSpacing:.7},cardTitle:{...typography.cardTitle,fontSize:20,color:colors.ink,marginTop:3},locationText:{fontSize:11,color:colors.muted,marginTop:2},description:{fontSize:12,lineHeight:16,color:colors.ink,marginTop:6,fontWeight:'600'},viewDetails:{fontSize:11,fontWeight:'800',color:colors.forest,marginTop:6},
});