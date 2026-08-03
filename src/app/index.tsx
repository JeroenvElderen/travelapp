import { useState } from 'react';

import { ExploreScreen } from '@/components/explore/ExploreScreen';
import { HomeScreen } from '@/components/home/HomeScreen';
import { SavedScreen } from '@/components/saved/SavedScreen';

export default function IndexRoute() {
  const [tab, setTab] = useState('Home');
  if (tab === 'Explore') return <ExploreScreen onTabChange={setTab} />;
  if (tab === 'Saved') return <SavedScreen onTabChange={setTab} />;
  return <HomeScreen onTabChange={setTab} />;
}
