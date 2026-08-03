import { useState } from 'react';

import { ExploreScreen } from '@/components/explore/ExploreScreen';
import { HomeScreen } from '@/components/home/HomeScreen';

export default function IndexRoute() {
  const [tab, setTab] = useState('Home');
  return tab === 'Explore' ? <ExploreScreen onTabChange={setTab} /> : <HomeScreen onTabChange={setTab} />;
}
