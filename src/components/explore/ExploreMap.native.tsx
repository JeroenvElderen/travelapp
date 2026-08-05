import Mapbox from '@rnmapbox/maps';
import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Icon } from '@/components/ui/Icon';
import { colors, shadows, spacing } from '@/lib/theme';
import type { ExplorePlace } from '@/lib/explorePlaces';

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (accessToken) {
  Mapbox.setAccessToken(accessToken);
}

type Coordinate = readonly [number, number];
type RouteState = { origin: Coordinate; destination: Coordinate; geometry: Coordinate[]; label: string; distanceMeters: number; durationSeconds: number };
type Props = { places: ExplorePlace[]; selectedPlaceId?: string; onSelectPlace: (place: ExplorePlace) => void; route?: RouteState | null };
type ShapeSourcePressEvent = Parameters<NonNullable<ComponentProps<typeof Mapbox.ShapeSource>['onPress']>>[0];

function MarkerImage({ place }: { place: ExplorePlace }) {
  const image = useRef<{ refresh: () => void }>(null);

  return (
    <Mapbox.Image ref={image} name={`place-${place.id}`}>
      <View collapsable={false} style={styles.markerImageMask}>
        <Image
          contentFit="cover"
          onLoad={() => image.current?.refresh()}
          source={place.image.replace('w=900', 'w=120&h=120&fit=crop')}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </Mapbox.Image>
  );
}

export function ExploreMap({ places, selectedPlaceId, onSelectPlace, route }: Props) {
  const camera = useRef<Mapbox.Camera>(null);
  const source = useRef<Mapbox.ShapeSource>(null);
  const shape = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(() => ({
    type: 'FeatureCollection',
    features: places.map(place => ({
      type: 'Feature',
      id: place.id,
      geometry: { type: 'Point', coordinates: [...place.coordinate] },
      properties: { id: place.id, imageId: `place-${place.id}` },
    })),
  }), [places]);
  const routeShape = useMemo<GeoJSON.Feature<GeoJSON.LineString> | null>(() => route ? ({
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: route.geometry.map(coordinate => [...coordinate]) },
    properties: { label: route.label },
  }) : null, [route]);

  useEffect(() => {
    if (!route?.geometry.length) return;
    const longitudes = route.geometry.map(([longitude]) => longitude);
    const latitudes = route.geometry.map(([, latitude]) => latitude);
    camera.current?.fitBounds(
      [Math.max(...longitudes), Math.max(...latitudes)],
      [Math.min(...longitudes), Math.min(...latitudes)],
      [80, 45, 180, 45],
      700,
    );
  }, [route]);

  if (!accessToken) {
    return <View style={styles.missing}><Text style={styles.missingTitle}>Mapbox token required</Text><Text style={styles.missingText}>Add EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local and restart Expo.</Text></View>;
  }

  const handlePress = async (event: ShapeSourcePressEvent) => {
    const feature = event.features[0];
    if (!feature) return;

    if (feature.properties?.cluster) {
      const zoomLevel = await source.current?.getClusterExpansionZoom(feature);
      if (zoomLevel !== undefined && feature.geometry.type === 'Point') {
        camera.current?.setCamera({ centerCoordinate: feature.geometry.coordinates, zoomLevel, animationDuration: 350 });
      }
      return;
    }

    const place = places.find(item => item.id === feature.properties?.id);
    if (place) onSelectPlace(place);
  };

  return (
    <View style={styles.root} accessibilityLabel="Interactive map of the Amalfi Coast">
      <Mapbox.MapView style={StyleSheet.absoluteFill} styleURL={Mapbox.StyleURL.Outdoors} logoEnabled attributionEnabled scaleBarEnabled={false}>
        <Mapbox.Camera ref={camera} defaultSettings={{ centerCoordinate: [14.59, 40.645], zoomLevel: 11.4 }} />
        <Mapbox.UserLocation visible />
        {routeShape && <Mapbox.ShapeSource id="destination-route" shape={routeShape}>
          <Mapbox.LineLayer id="destination-route-outline" style={{ lineColor: colors.white, lineWidth: 8, lineOpacity: 0.9 }} />
          <Mapbox.LineLayer id="destination-route-line" style={{ lineColor: colors.forest, lineWidth: 5, lineOpacity: 0.95, lineCap: 'round', lineJoin: 'round' }} />
        </Mapbox.ShapeSource>}
        {route && <Mapbox.PointAnnotation id="destination-point" coordinate={[...route.destination]}>
          <View style={styles.destinationMarker}><Icon name="pin" size={16} color={colors.white}/></View>
        </Mapbox.PointAnnotation>}
        <Mapbox.Images>{places.map(place => <MarkerImage key={place.id} place={place} />)}</Mapbox.Images>
        <Mapbox.ShapeSource ref={source} id="explore-places" shape={shape} cluster clusterRadius={54} clusterMaxZoomLevel={14} onPress={handlePress} hitbox={{ width: 52, height: 52 }}>
          <Mapbox.CircleLayer id="place-clusters" filter={['has', 'point_count']} style={{ circleRadius: 23, circleColor: colors.forest, circleStrokeWidth: 3, circleStrokeColor: colors.white }} />
          <Mapbox.SymbolLayer id="place-cluster-count" filter={['has', 'point_count']} style={{ textField: ['get', 'point_count_abbreviated'], textSize: 14, textColor: colors.white, textAllowOverlap: true }} />
          <Mapbox.SymbolLayer id="place-pointers" filter={['!', ['has', 'point_count']]} style={{ textField: '▼', textSize: ['case', ['==', ['get', 'id'], selectedPlaceId ?? ''], 28, 25], textColor: colors.gold, textHaloColor: colors.white, textHaloWidth: 2, textTranslate: [0, -8], textAllowOverlap: true, textIgnorePlacement: true }} />
          <Mapbox.CircleLayer id="place-photo-border" filter={['!', ['has', 'point_count']]} style={{ circleRadius: ['case', ['==', ['get', 'id'], selectedPlaceId ?? ''], 25, 23], circleColor: colors.white, circleStrokeWidth: 2, circleStrokeColor: colors.gold, circleTranslate: [0, -30] }} />
          <Mapbox.SymbolLayer id="place-photos" filter={['!', ['has', 'point_count']]} style={{ iconImage: ['get', 'imageId'], iconSize: ['case', ['==', ['get', 'id'], selectedPlaceId ?? ''], 0.83, 0.76], iconTranslate: [0, -30], iconAllowOverlap: true, iconIgnorePlacement: true }} />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>
      {route && <View style={styles.routeBadge}><Text style={styles.routeBadgeText}>Your location → {route.label}</Text><Text style={styles.routeDetails}>{Math.round(route.distanceMeters / 1000)} km · {Math.max(1, Math.round(route.durationSeconds / 60))} min by car</Text></View>}
      <View style={styles.mapActions}><AnimatedPressable accessibilityLabel="Find my location" style={styles.mapButton}><Icon name="locate"/></AnimatedPressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,minHeight:420,overflow:'hidden'},missing:{flex:1,minHeight:420,alignItems:'center',justifyContent:'center',padding:spacing.xl,backgroundColor:'#DCE4CE'},missingTitle:{fontFamily:'Georgia',fontSize:22,fontWeight:'700',color:colors.ink},missingText:{maxWidth:300,marginTop:spacing.sm,textAlign:'center',lineHeight:20,color:colors.muted},markerImageMask:{width:60,height:60,borderRadius:30,overflow:'hidden'},mapActions:{position:'absolute',right:spacing.lg,bottom:190,gap:10},mapButton:{width:48,height:48,borderRadius:24,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center',...shadows.soft},destinationMarker:{width:30,height:30,borderRadius:15,backgroundColor:colors.forest,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:colors.white},routeBadge:{position:'absolute',left:spacing.lg,right:spacing.lg,top:spacing.md,paddingVertical:9,paddingHorizontal:13,borderRadius:18,backgroundColor:'rgba(255,252,247,.96)',...shadows.soft},routeBadgeText:{fontSize:12,fontWeight:'800',color:colors.ink,textAlign:'center'},routeDetails:{marginTop:3,fontSize:11,fontWeight:'600',color:colors.muted,textAlign:'center'},
});