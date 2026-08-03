import { useState } from 'react';

import { ExploreScreen } from '@/components/explore/ExploreScreen';
import { HomeScreen } from '@/components/home/HomeScreen';
import { MovingAbroadScreen } from '@/components/moving/MovingAbroadScreen';
import { SavedScreen } from '@/components/saved/SavedScreen';

export default function IndexRoute() {
  const [tab, setTab] = useState('Home');
  if (tab === 'Explore') return <ExploreScreen onTabChange={setTab} />;
  if (tab === 'Saved') return <SavedScreen onTabChange={setTab} />;
  if (tab === 'Move') return <MovingAbroadScreen onTabChange={setTab} />;
  return <HomeScreen onTabChange={setTab} />;
}
