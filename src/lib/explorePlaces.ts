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
  recommendation: string;
  duration: string;
  price: string;
  bestTime: string;
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
  { id:'amalfi-cathedral', name:'Amalfi Cathedral', region:'Amalfi, Campania', distance:'2.4 km', rating:4.8, description:'A striped medieval cathedral overlooking Amalfi’s historic piazza.', image:'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900', coordinate:[14.6026,40.6342], tags:['History','Architecture','Culture'], layer:'attractions', recommendation:'Best for a first taste of Amalfi history', duration:'45–60 min', price:'€', bestTime:'Early morning' },
  { id:'villa-rufolo', name:'Villa Rufolo', region:'Ravello, Campania', distance:'5.8 km', rating:4.7, description:'Historic gardens and terraces with sweeping views across the sea.', image:'https://images.unsplash.com/photo-1544986581-efac024faf62?w=900', coordinate:[14.6122,40.6491], tags:['Gardens','Views','History'], layer:'attractions', recommendation:'Best garden terraces on the coast', duration:'1–2 hr', price:'€€', bestTime:'Late afternoon' },
  { id:'fiordo-di-furore', name:'Fiordo di Furore', region:'Furore, Campania', distance:'8.6 km', rating:4.6, description:'A dramatic narrow inlet and small beach beneath the coastal road.', image:'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900', coordinate:[14.5399,40.6136], tags:['Beach','Scenic','Photography'], layer:'beaches', recommendation:'Most dramatic swim and photo stop', duration:'1–2 hr', price:'Free', bestTime:'Before 10 AM' },
  { id:'sentiero-degli-dei', name:'Path of the Gods', region:'Agerola, Campania', distance:'11.2 km', rating:4.9, description:'A celebrated cliffside trail linking villages above the Amalfi Coast.', image:'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=900', coordinate:[14.5477,40.6292], tags:['Hiking','Nature','Views'], layer:'hiking', recommendation:'The coast’s essential panoramic hike', duration:'3–5 hr', price:'Free', bestTime:'Cool, clear morning' },
  { id:'paper-museum', name:'Paper Museum', region:'Amalfi, Campania', distance:'2.8 km', rating:4.5, description:'A small museum preserving Amalfi’s centuries-old paper-making tradition.', image:'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=900', coordinate:[14.6022,40.6374], tags:['Museum','Craft','History'], layer:'museums', recommendation:'Best rainy-day cultural stop', duration:'45 min', price:'€', bestTime:'Midday' },
  { id:'marina-grande', name:'Marina Grande', region:'Amalfi, Campania', distance:'2.2 km', rating:4.6, description:'Local seafood and terrace dining beside Amalfi’s waterfront.', image:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900', coordinate:[14.6011,40.6328], tags:['Seafood','Local','Dining'], layer:'restaurants', recommendation:'Best waterfront lunch atmosphere', duration:'1–2 hr', price:'€€€', bestTime:'Lunch' },
  { id:'villa-cimbrone', name:'Villa Cimbrone', region:'Ravello, Campania', distance:'6.4 km', rating:4.8, description:'Romantic gardens ending at the celebrated Terrace of Infinity.', image:'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=900', coordinate:[14.6110,40.6440], tags:['Gardens','Views','Romantic'], layer:'attractions', recommendation:'Most romantic clifftop viewpoint', duration:'1–2 hr', price:'€€', bestTime:'Golden hour' },
  { id:'atrani', name:'Atrani Village', region:'Atrani, Campania', distance:'3.1 km', rating:4.7, description:'A tiny maze of lanes and arches gathered around an intimate piazza.', image:'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900', coordinate:[14.6086,40.6361], tags:['Village','Local','Architecture'], layer:'attractions', recommendation:'Best quiet wander near Amalfi', duration:'1–2 hr', price:'Free', bestTime:'Early evening' },
  { id:'duoglio-beach', name:'Duoglio Beach', region:'Amalfi, Campania', distance:'1.8 km', rating:4.6, description:'Clear water and a steep stairway keep this cove quieter than town beaches.', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900', coordinate:[14.5839,40.6236], tags:['Beach','Swimming','Quiet'], layer:'beaches', recommendation:'Best clear-water swim near Amalfi', duration:'2–4 hr', price:'€€', bestTime:'Morning' },
  { id:'castiglione-beach', name:'Castiglione Beach', region:'Ravello, Campania', distance:'4.4 km', rating:4.5, description:'A compact cliff-backed beach reached by steps below Castiglione.', image:'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=900', coordinate:[14.6144,40.6330], tags:['Beach','Swimming','Cliffs'], layer:'beaches', recommendation:'Best sheltered afternoon beach', duration:'2–3 hr', price:'€', bestTime:'Afternoon' },
  { id:'valle-ferriere', name:'Valle delle Ferriere', region:'Scala, Campania', distance:'5.6 km', rating:4.8, description:'A green reserve of waterfalls, ruins, and rare ferns above Amalfi.', image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900', coordinate:[14.5935,40.6571], tags:['Hiking','Waterfalls','Nature'], layer:'hiking', recommendation:'Best cool escape on a hot day', duration:'3–4 hr', price:'€', bestTime:'Morning' },
  { id:'ravello-minori-walk', name:'Ravello to Minori Walk', region:'Ravello, Campania', distance:'7.2 km', rating:4.7, description:'Stone lanes and lemon terraces descend from Ravello toward the sea.', image:'https://images.unsplash.com/photo-1551634979-2b11f8c946fe?w=900', coordinate:[14.6227,40.6507], tags:['Hiking','Villages','Views'], layer:'hiking', recommendation:'Best village-to-village walk', duration:'2–3 hr', price:'Free', bestTime:'Morning' },
  { id:'roman-villa', name:'Roman Villa Museum', region:'Minori, Campania', distance:'8.1 km', rating:4.4, description:'Ancient rooms and mosaics from a seaside Roman residence.', image:'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=900', coordinate:[14.6266,40.6498], tags:['Museum','Roman','History'], layer:'museums', recommendation:'Best compact archaeology stop', duration:'45 min', price:'Free', bestTime:'Midday' },
  { id:'coral-museum', name:'Coral Museum', region:'Ravello, Campania', distance:'6.0 km', rating:4.4, description:'A small collection devoted to coral jewelry, cameos, and local craft.', image:'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=900', coordinate:[14.6120,40.6487], tags:['Museum','Craft','Jewelry'], layer:'museums', recommendation:'Best hidden craft collection', duration:'30–45 min', price:'Free', bestTime:'Afternoon' },
  { id:'minori-pastry', name:'Sal de Riso', region:'Minori, Campania', distance:'8.0 km', rating:4.6, description:'Celebrated pastries inspired by local lemons, ricotta, and hazelnuts.', image:'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900', coordinate:[14.6268,40.6499], tags:['Pastry','Local','Dessert'], layer:'restaurants', recommendation:'Best stop for lemon dessert', duration:'30–60 min', price:'€€', bestTime:'Late afternoon' },
  { id:'ravello-dining', name:'Ravello Garden Table', region:'Ravello, Campania', distance:'6.1 km', rating:4.7, description:'Seasonal Campanian cooking served on a leafy terrace above the coast.', image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900', coordinate:[14.6137,40.6495], tags:['Dining','Romantic','Local'], layer:'restaurants', recommendation:'Best special-occasion dinner', duration:'2 hr', price:'€€€', bestTime:'Dinner' },
  { id:'lemon-tour', name:'Amalfi Lemon Farm Tour', region:'Amalfi, Campania', distance:'3.0 km', rating:4.8, description:'Walk through terraced groves and taste products made with sfusato lemons.', image:'https://images.unsplash.com/photo-1590502593747-42a996133562?w=900', coordinate:[14.5987,40.6421], tags:['Experience','Food','Farm'], layer:'experiences', recommendation:'Best hands-on local food experience', duration:'2 hr', price:'€€', bestTime:'Morning' },
  { id:'sunset-boat', name:'Sunset Coast Boat Trip', region:'Amalfi, Campania', distance:'2.1 km', rating:4.9, description:'A small-group cruise past coves and villages as the coast turns golden.', image:'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900', coordinate:[14.6000,40.6311], tags:['Experience','Boat','Sunset'], layer:'experiences', recommendation:'Best splurge for sunset views', duration:'2–3 hr', price:'€€€', bestTime:'Sunset' },
  { id:'cooking-class', name:'Coastal Cooking Class', region:'Minori, Campania', distance:'8.3 km', rating:4.8, description:'Prepare fresh pasta and a seasonal sauce in a welcoming local kitchen.', image:'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900', coordinate:[14.6281,40.6505], tags:['Experience','Cooking','Food'], layer:'experiences', recommendation:'Best social evening activity', duration:'3 hr', price:'€€€', bestTime:'Late afternoon' },
  { id:'ceramics-workshop', name:'Vietri Ceramics Workshop', region:'Vietri sul Mare, Campania', distance:'16.8 km', rating:4.7, description:'Paint a traditional tile with guidance from a family-run ceramics studio.', image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900', coordinate:[14.7281,40.6712], tags:['Experience','Craft','Family'], layer:'experiences', recommendation:'Best creative take-home memory', duration:'2 hr', price:'€€', bestTime:'Rainy afternoon' },
];