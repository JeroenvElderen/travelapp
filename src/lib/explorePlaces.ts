export type ExploreLayerId =
  | 'attractions' | 'beaches' | 'hiking' | 'museums' | 'restaurants'
  | 'experiences' | 'saved' | 'itinerary' | 'rent' | 'transit'
  | 'walkability' | 'hospitals' | 'schools' | 'coworking' | 'internet'
  | 'air-quality' | 'climate' | 'groceries' | 'neighborhoods';

export type ExploreLayer = {
  id: ExploreLayerId;
  label: string;
  group: 'Travel' | 'Relocation';
  color: string;
  available: boolean;
  source: string;
};

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
  layer: ExploreLayerId;
};

export const exploreLayers: ExploreLayer[] = [
  { id: 'attractions', label: 'Attractions', group: 'Travel', color: '#D26945', available: true, source: 'OpenStreetMap contributors' },
  { id: 'beaches', label: 'Beaches', group: 'Travel', color: '#2789A4', available: true, source: 'OpenStreetMap contributors' },
  { id: 'hiking', label: 'Hiking routes', group: 'Travel', color: '#4F7A52', available: true, source: 'OpenStreetMap contributors' },
  { id: 'museums', label: 'Museums', group: 'Travel', color: '#8A5EA1', available: true, source: 'OpenStreetMap contributors' },
  { id: 'restaurants', label: 'Restaurants', group: 'Travel', color: '#C48A2B', available: true, source: 'OpenStreetMap contributors' },
  { id: 'experiences', label: 'Experiences', group: 'Travel', color: '#A95067', available: true, source: 'Explorixa partners' },
  { id: 'saved', label: 'Saved places', group: 'Travel', color: '#14362A', available: true, source: 'Your saved places' },
  { id: 'itinerary', label: 'Itinerary stops', group: 'Travel', color: '#E36B38', available: true, source: 'Your itinerary' },
  { id: 'rent', label: 'Typical rent', group: 'Relocation', color: '#4466A3', available: false, source: 'No verified local coverage' },
  { id: 'transit', label: 'Public transport', group: 'Relocation', color: '#356C91', available: true, source: 'OpenStreetMap contributors' },
  { id: 'walkability', label: 'Walkability', group: 'Relocation', color: '#63945E', available: false, source: 'No verified local coverage' },
  { id: 'hospitals', label: 'Hospitals', group: 'Relocation', color: '#C54E4E', available: true, source: 'OpenStreetMap contributors' },
  { id: 'schools', label: 'Schools', group: 'Relocation', color: '#7259A5', available: true, source: 'OpenStreetMap contributors' },
  { id: 'coworking', label: 'Coworking', group: 'Relocation', color: '#9A6B42', available: true, source: 'OpenStreetMap contributors' },
  { id: 'internet', label: 'Internet availability', group: 'Relocation', color: '#277B78', available: false, source: 'No verified local coverage' },
  { id: 'air-quality', label: 'Air quality', group: 'Relocation', color: '#5793A8', available: false, source: 'No verified local coverage' },
  { id: 'climate', label: 'Climate risks', group: 'Relocation', color: '#A9583F', available: false, source: 'No verified local coverage' },
  { id: 'groceries', label: 'Grocery stores', group: 'Relocation', color: '#668B3D', available: true, source: 'OpenStreetMap contributors' },
  { id: 'neighborhoods', label: 'Neighborhoods', group: 'Relocation', color: '#71685C', available: false, source: 'No verified local boundaries' },
];

// Representative real places around the Amalfi Coast. Production results should
// come from a viewport-bounded API query and retain each provider's attribution.
export const explorePlaces: ExplorePlace[] = [
  { id:'amalfi-cathedral', name:'Amalfi Cathedral', region:'Amalfi, Campania', distance:'2.4 km', rating:4.8, description:'A striped medieval cathedral overlooking Amalfi’s historic piazza.', image:'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900', coordinate:[14.6026,40.6342], tags:['History','Architecture','Culture'], layer:'attractions' },
  { id:'villa-rufolo', name:'Villa Rufolo', region:'Ravello, Campania', distance:'5.8 km', rating:4.7, description:'Historic gardens and terraces with sweeping views across the sea.', image:'https://images.unsplash.com/photo-1544986581-efac024faf62?w=900', coordinate:[14.6122,40.6491], tags:['Gardens','Views','History'], layer:'attractions' },
  { id:'fiordo-di-furore', name:'Fiordo di Furore', region:'Furore, Campania', distance:'8.6 km', rating:4.6, description:'A dramatic narrow inlet and small beach beneath the coastal road.', image:'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900', coordinate:[14.5399,40.6136], tags:['Beach','Scenic','Photography'], layer:'beaches' },
  { id:'sentiero-degli-dei', name:'Path of the Gods', region:'Agerola, Campania', distance:'11.2 km', rating:4.9, description:'A celebrated cliffside trail linking villages above the Amalfi Coast.', image:'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=900', coordinate:[14.5477,40.6292], tags:['Hiking','Nature','Views'], layer:'hiking' },
  { id:'paper-museum', name:'Paper Museum', region:'Amalfi, Campania', distance:'2.8 km', rating:4.5, description:'A small museum preserving Amalfi’s centuries-old paper-making tradition.', image:'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=900', coordinate:[14.6022,40.6374], tags:['Museum','Craft','History'], layer:'museums' },
  { id:'marina-grande', name:'Marina Grande', region:'Amalfi, Campania', distance:'2.2 km', rating:4.6, description:'Local seafood and terrace dining beside Amalfi’s waterfront.', image:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900', coordinate:[14.6011,40.6328], tags:['Seafood','Local','Dining'], layer:'restaurants' },
  { id:'castiglione-hospital', name:'Costa d’Amalfi Hospital', region:'Castiglione, Campania', distance:'5.1 km', rating:4.2, description:'Public hospital serving communities along the Amalfi Coast.', image:'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=900', coordinate:[14.6118,40.6425], tags:['Hospital','Healthcare'], layer:'hospitals' },
  { id:'amalfi-grocery', name:'Amalfi Market', region:'Amalfi, Campania', distance:'2.5 km', rating:4.4, description:'Central grocery stop for produce and everyday essentials.', image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', coordinate:[14.6040,40.6351], tags:['Groceries','Market'], layer:'groceries' },
];