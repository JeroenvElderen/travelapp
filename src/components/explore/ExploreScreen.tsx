import { useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ExploreMap } from '@/components/explore/ExploreMap';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppHeader } from '@/components/ui/AppHeader';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import { exploreLayers, explorePlaces, type ExploreLayerId, type ExplorePlace } from '@/lib/explorePlaces';

type Props = { onOpenPlace: (place: ExplorePlace) => void };

const initialLayers: ExploreLayerId[] = ['attractions', 'beaches', 'hiking', 'museums', 'restaurants', 'experiences'];
type Coordinate = readonly [number, number];
type RouteState = { origin: Coordinate; destination: Coordinate; geometry: Coordinate[]; label: string; distanceMeters: number; durationSeconds: number };
type DirectionsResponse = { code?: string; routes?: Array<{ distance: number; duration: number; geometry: { type: 'LineString'; coordinates: Coordinate[] } }> };

export function ExploreScreen({ onOpenPlace }: Props) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [layersOpen, setLayersOpen] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState<ExploreLayerId[]>(initialLayers);
  const [selectedPlace, setSelectedPlace] = useState<ExplorePlace | null>(null);
  const [areaSearches, setAreaSearches] = useState(0);
  const [route, setRoute] = useState<RouteState | null>(null);
  const [routeStatus, setRouteStatus] = useState('');

  const places = useMemo(() => {
    const term = query.trim().toLowerCase();
    return explorePlaces.filter(place => enabledLayers.includes(place.layer) && (!term || `${place.name} ${place.region} ${place.tags.join(' ')}`.toLowerCase().includes(term)));
  }, [enabledLayers, query]);
  const activeLayerData = exploreLayers.filter(layer => enabledLayers.includes(layer.id));

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
      setMode('map');
      setRouteStatus(`Showing the best driving route to ${destination}.`);
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
      <View style={styles.header}>
        <AppHeader />
        <View style={styles.search}>
          <Icon name="search" size={22}/>
          <TextInput value={query} onChangeText={setQuery} accessibilityLabel="Search places in the visible map area" placeholder="Search places or destination" placeholderTextColor={colors.muted} style={styles.input}/>
          <AnimatedPressable accessibilityLabel="Open map layers" onPress={() => setLayersOpen(value => !value)} style={[styles.filter, layersOpen && styles.filterActive]}><Icon name="layers" color={colors.white}/></AnimatedPressable>
        </View>
        <View style={styles.toolbar}>
          <View style={styles.segment}>
            {(['map', 'list'] as const).map(item => <AnimatedPressable key={item} accessibilityState={{ selected: mode === item }} onPress={() => { setMode(item); setSelectedPlace(null); }} style={[styles.segmentButton, mode === item && styles.segmentActive]}><Text style={[styles.segmentText, mode === item && styles.segmentTextActive]}>{item === 'map' ? 'Map' : 'List'}</Text></AnimatedPressable>)}
          </View>
          <AnimatedPressable onPress={() => setAreaSearches(value => value + 1)} style={styles.areaButton}><Icon name="search" size={17}/><Text style={styles.areaText}>{areaSearches ? 'Area updated' : 'Search this area'}</Text></AnimatedPressable>
        </View>
        <View style={styles.routeBar}>
          <AnimatedPressable accessibilityLabel="Use my location and calculate the best driving route to the searched destination" onPress={planRoute} style={styles.routeButton}><Icon name="locate" size={17} color={colors.white}/><Text style={styles.routeText}>Navigate from my location</Text></AnimatedPressable>
          {route && <AnimatedPressable accessibilityLabel="Clear destination route" onPress={() => { setRoute(null); setRouteStatus(''); }} style={styles.clearRoute}><Text style={styles.clearRouteText}>Clear</Text></AnimatedPressable>}
        </View>
        {!!routeStatus && <Text style={styles.routeStatus}>{routeStatus}</Text>}
      </View>

      {layersOpen && <View style={styles.layerPanel} accessibilityLabel="Map layer selector">
        <View style={styles.panelHeading}><View><Text style={styles.panelTitle}>Research layers</Text><Text style={styles.panelSubtitle}>Unavailable data is never shown as an average.</Text></View><AnimatedPressable accessibilityLabel="Close layers" onPress={() => setLayersOpen(false)}><Text style={styles.close}>×</Text></AnimatedPressable></View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {(['Travel', 'Relocation'] as const).map(group => <View key={group}><Text style={styles.groupLabel}>{group}</Text><View style={styles.layerGrid}>{exploreLayers.filter(layer => layer.group === group).map(layer => { const active = enabledLayers.includes(layer.id); return <AnimatedPressable key={layer.id} accessibilityState={{ checked: active, disabled: !layer.available }} onPress={() => toggleLayer(layer.id, layer.available)} style={[styles.layerChip, active && styles.layerChipActive, !layer.available && styles.layerChipDisabled]}><View style={[styles.dot,{backgroundColor:layer.available ? layer.color : '#B8B8B5'}]}/><Text style={[styles.layerText,active && styles.layerTextActive]}>{layer.label}</Text>{!layer.available && <Text style={styles.noData}>No data</Text>}</AnimatedPressable>; })}</View></View>)}
        </ScrollView>
      </View>}

      {mode === 'map'
        ? <ExploreMap places={places} selectedPlaceId={selectedPlace?.id} onSelectPlace={setSelectedPlace} route={route}/>
        : <FlatList data={places} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} ListHeaderComponent={<View><Text style={styles.resultsTitle}>{places.length} places in this area</Text><Text style={styles.resultsSubtitle}>The same results and actions as the interactive map.</Text></View>} ListEmptyComponent={<View style={styles.empty}><Icon name="search" size={32}/><Text style={styles.emptyTitle}>No matching places</Text><Text style={styles.emptyText}>Try another search or enable more layers.</Text></View>} renderItem={({item}) => <AnimatedPressable accessibilityLabel={`View details for ${item.name}`} onPress={() => onOpenPlace(item)} style={styles.listCard}><Image source={item.image} style={styles.listImage}/><View style={styles.listDetails}><Text style={styles.listEyebrow}>{exploreLayers.find(layer => layer.id === item.layer)?.label}</Text><Text style={styles.listTitle}>{item.name}</Text><Text style={styles.listMeta}>{item.region} · ★ {item.rating}</Text><Text numberOfLines={2} style={styles.listDescription}>{item.description}</Text></View></AnimatedPressable>}/>
      }

      {mode === 'map' && <View style={styles.legend} accessibilityLabel="Map legend"><Text style={styles.legendTitle}>LEGEND</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{activeLayerData.map(layer => <View key={layer.id} style={styles.legendItem}><View style={[styles.dot,{backgroundColor:layer.color}]}/><Text style={styles.legendText}>{layer.label}</Text></View>)}</ScrollView><Text numberOfLines={1} style={styles.source}>Sources: {Array.from(new Set(activeLayerData.map(layer => layer.source))).join(' · ') || 'No layers selected'}</Text></View>}

      {selectedPlace && <AnimatedPressable accessibilityLabel="Close place preview" onPress={() => setSelectedPlace(null)} style={styles.dismissOverlay}><View /></AnimatedPressable>}
      {selectedPlace && <AnimatedPressable accessibilityHint="Opens the place details screen" accessibilityLabel={`View details for ${selectedPlace.name}`} onPress={() => onOpenPlace(selectedPlace)} style={styles.placeCard}>
        <Image source={selectedPlace.image} style={styles.cardImage}/><View style={styles.details}><View style={styles.detailTop}><Text style={styles.eyebrow}>{exploreLayers.find(layer => layer.id === selectedPlace.layer)?.label.toUpperCase()}</Text></View><Text style={styles.cardTitle}>{selectedPlace.name}</Text><Text style={styles.locationText}>{selectedPlace.region} · ★ {selectedPlace.rating} · {selectedPlace.duration}</Text><Text numberOfLines={2} style={styles.description}>{selectedPlace.recommendation}</Text><Text style={styles.viewDetails}>View details →</Text></View>
      </AnimatedPressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.canvas},header:{backgroundColor:colors.canvas,zIndex:3},search:{height:52,marginHorizontal:spacing.lg,backgroundColor:colors.surface,borderRadius:radius.pill,flexDirection:'row',alignItems:'center',paddingLeft:spacing.md,paddingRight:4,...shadows.soft},input:{flex:1,fontSize:15,color:colors.ink,paddingHorizontal:spacing.sm},filter:{width:44,height:44,borderRadius:22,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center'},filterActive:{backgroundColor:colors.gold},toolbar:{paddingHorizontal:spacing.lg,paddingVertical:spacing.sm,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},routeBar:{paddingHorizontal:spacing.lg,paddingBottom:spacing.xs,flexDirection:'row',alignItems:'center',gap:8},routeButton:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,flex:1,paddingVertical:10,borderRadius:radius.pill,backgroundColor:colors.forest},routeText:{fontSize:13,fontWeight:'800',color:colors.white},clearRoute:{paddingVertical:10,paddingHorizontal:14,borderRadius:radius.pill,backgroundColor:'#EAE4DB'},clearRouteText:{fontSize:12,fontWeight:'800',color:colors.ink},routeStatus:{paddingHorizontal:spacing.lg,paddingBottom:spacing.sm,fontSize:12,color:colors.muted},segment:{padding:3,borderRadius:radius.pill,backgroundColor:'#EAE4DB',flexDirection:'row'},segmentButton:{paddingVertical:7,paddingHorizontal:20,borderRadius:radius.pill},segmentActive:{backgroundColor:colors.surface,...shadows.soft},segmentText:{fontSize:13,fontWeight:'700',color:colors.muted,textTransform:'uppercase'},segmentTextActive:{color:colors.ink},areaButton:{flexDirection:'row',alignItems:'center',gap:6,padding:8},areaText:{fontSize:13,fontWeight:'700',color:colors.forest},layerPanel:{position:'absolute',top:195,left:spacing.sm,right:spacing.sm,maxHeight:'58%',zIndex:8,padding:spacing.lg,borderRadius:radius.xl,backgroundColor:colors.surface,...shadows.floating},panelHeading:{flexDirection:'row',justifyContent:'space-between'},panelTitle:{...typography.title,color:colors.ink},panelSubtitle:{fontSize:12,color:colors.muted,marginTop:2},close:{fontSize:30,lineHeight:30,color:colors.muted,paddingHorizontal:5},groupLabel:{marginTop:spacing.lg,marginBottom:spacing.xs,fontSize:12,fontWeight:'800',letterSpacing:1.2,color:colors.gold,textTransform:'uppercase'},layerGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},layerChip:{height:38,paddingHorizontal:11,borderRadius:radius.pill,borderWidth:1,borderColor:colors.line,flexDirection:'row',alignItems:'center',gap:6},layerChipActive:{backgroundColor:colors.forest,borderColor:colors.forest},layerChipDisabled:{opacity:.55,backgroundColor:'#EFEDEA'},dot:{width:9,height:9,borderRadius:5},layerText:{fontSize:12,fontWeight:'600',color:colors.ink},layerTextActive:{color:colors.white},noData:{fontSize:9,color:colors.muted},legend:{position:'absolute',left:spacing.sm,right:spacing.sm,bottom:101,zIndex:2,paddingHorizontal:14,paddingVertical:10,borderRadius:radius.md,backgroundColor:'rgba(255,252,247,.94)',...shadows.soft},legendTitle:{fontSize:9,fontWeight:'800',letterSpacing:1,color:colors.muted,marginBottom:5},legendItem:{flexDirection:'row',alignItems:'center',gap:5,marginRight:14},legendText:{fontSize:11,color:colors.ink},source:{fontSize:9,color:colors.muted,marginTop:6},listContent:{paddingHorizontal:spacing.lg,paddingBottom:120},resultsTitle:{...typography.title,marginTop:spacing.sm,color:colors.ink},resultsSubtitle:{fontSize:13,color:colors.muted,marginBottom:spacing.md},listCard:{height:132,marginBottom:spacing.sm,padding:10,borderRadius:radius.lg,backgroundColor:colors.surface,flexDirection:'row',...shadows.soft},listImage:{width:112,height:112,borderRadius:radius.md},listDetails:{flex:1,padding:5,paddingLeft:13},listEyebrow:{fontSize:10,fontWeight:'800',letterSpacing:.8,color:colors.gold,textTransform:'uppercase'},listTitle:{...typography.cardTitle,fontSize:18,marginTop:2,color:colors.ink},listMeta:{fontSize:11,color:colors.muted,marginTop:2},listDescription:{fontSize:12,lineHeight:17,color:colors.muted,marginTop:7},empty:{alignItems:'center',padding:spacing.huge},emptyTitle:{...typography.cardTitle,marginTop:spacing.sm,color:colors.ink},emptyText:{color:colors.muted,marginTop:4},dismissOverlay:{position:'absolute',top:0,right:0,bottom:0,left:0,zIndex:4},placeCard:{position:'absolute',left:spacing.sm,right:spacing.sm,bottom:170,height:188,padding:12,borderRadius:28,backgroundColor:colors.surface,flexDirection:'row',zIndex:5,...shadows.floating},cardImage:{width:'39%',height:'100%',borderRadius:20},details:{flex:1,padding:10,paddingLeft:14,justifyContent:'center'},detailTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},eyebrow:{fontSize:10,color:colors.gold,fontWeight:'800',letterSpacing:.7},cardTitle:{...typography.cardTitle,fontSize:21,color:colors.ink,marginTop:4},locationText:{fontSize:11,color:colors.muted,marginTop:3},description:{fontSize:12,lineHeight:17,color:colors.ink,marginTop:7,fontWeight:'600'},viewDetails:{fontSize:11,fontWeight:'800',color:colors.forest,marginTop:8},
});