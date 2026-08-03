import type { Collection, Place } from '@/types/travel';

export type SavedPlace = Place & { category: string };
export type SavedExperience = { id: string; title: string; country: string; duration: string; group: string; price: number; image: string };

export const savedPlaces: SavedPlace[] = [
  { id: 'santorini', name: 'Santorini', country: 'Greece', rating: 4.9, category: 'City', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700' },
  { id: 'braies', name: 'Lake Braies', country: 'Italy', rating: 4.8, category: 'Nature', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700' },
  { id: 'kelingking', name: 'Kelingking Beach', country: 'Indonesia', rating: 4.8, category: 'Beach', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700' },
  { id: 'petra', name: 'Petra', country: 'Jordan', rating: 4.7, category: 'Culture', image: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=700' },
];

export const savedCollections: Collection[] = [
  { id: 'epic', title: 'Epic Adventures', count: 24, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=900' },
  { id: 'nature', title: 'Nature Escapes', count: 18, image: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900' },
];

export const savedExperiences: SavedExperience[] = [
  { id: 'turtles', title: 'Snorkeling with Turtles', country: 'Maldives', duration: '3h', group: 'Small group', price: 89, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500' },
  { id: 'aurora', title: 'Northern Lights Tour', country: 'Iceland', duration: '4–6h', group: 'Max 12', price: 120, image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=500' },
  { id: 'machu', title: 'Guided Hike to Machu Picchu', country: 'Peru', duration: 'Full day', group: 'Max 8', price: 150, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=500' },
];