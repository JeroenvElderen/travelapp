export type IconName = 'menu'|'search'|'tune'|'compass'|'mountain'|'walk'|'city'|'sun'|'more'|'heart'|'pin'|'arrow'|'home'|'explore'|'profile'|'sparkle'|'camera'|'layers'|'locate'|'bookmark';
export interface Category { id: string; label: string; icon: IconName }
export interface Place { id: string; name: string; country: string; rating: number; image: string }
export interface Collection { id: string; title: string; count: number; image: string }
export interface UserProfile { firstName: string; avatar: string }
