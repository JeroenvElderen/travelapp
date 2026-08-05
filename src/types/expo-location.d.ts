declare module 'expo-location' {
  export type PermissionStatus = 'granted' | 'denied' | 'undetermined';
  export type PermissionResponse = { status: PermissionStatus };
  export type LocationObject = { coords: { latitude: number; longitude: number } };
  export type LocationGeocodedLocation = { latitude: number; longitude: number };

  export function requestForegroundPermissionsAsync(): Promise<PermissionResponse>;
  export function getCurrentPositionAsync(options?: object): Promise<LocationObject>;
  export function geocodeAsync(address: string): Promise<LocationGeocodedLocation[]>;
}