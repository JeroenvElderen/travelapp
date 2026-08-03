export type ExplorePlace = {
  id: string;
  name: string;
  region: string;
  distance: string;
  rating: number;
  description: string;
  image: string;
  coordinate: readonly [number, number];
  tags: readonly string[];
};

// Real places and coordinates around the Amalfi Coast, ready to be replaced by
// Supabase rows once the backend is connected.
export const explorePlaces: ExplorePlace[] = [
  {
    id: 'amalfi-cathedral',
    name: 'Amalfi Cathedral',
    region: 'Amalfi, Campania',
    distance: '2.4 km',
    rating: 4.8,
    description: 'A striped medieval cathedral overlooking Amalfi’s historic Piazza del Duomo.',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900',
    coordinate: [14.6026, 40.6342],
    tags: ['History', 'Architecture', 'Culture'],
  },
  {
    id: 'villa-rufolo',
    name: 'Villa Rufolo',
    region: 'Ravello, Campania',
    distance: '5.8 km',
    rating: 4.7,
    description: 'Historic gardens and terraces with sweeping views across the Tyrrhenian Sea.',
    image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=900',
    coordinate: [14.6122, 40.6491],
    tags: ['Gardens', 'Views', 'History'],
  },
  {
    id: 'fiordo-di-furore',
    name: 'Fiordo di Furore',
    region: 'Furore, Campania',
    distance: '8.6 km',
    rating: 4.6,
    description: 'A dramatic narrow inlet and small beach tucked beneath the coastal road.',
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900',
    coordinate: [14.5399, 40.6136],
    tags: ['Beach', 'Scenic', 'Photography'],
  },
  {
    id: 'sentiero-degli-dei',
    name: 'Path of the Gods',
    region: 'Agerola, Campania',
    distance: '11.2 km',
    rating: 4.9,
    description: 'A celebrated cliffside trail linking mountain villages above the Amalfi Coast.',
    image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=900',
    coordinate: [14.5477, 40.6292],
    tags: ['Hiking', 'Nature', 'Views'],
  },
];