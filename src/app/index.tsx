import { useState } from 'react';

import { ExploreScreen } from '@/components/explore/ExploreScreen';
import { HomeScreen } from '@/components/home/HomeScreen';
import { MovingAbroadScreen } from '@/components/moving/MovingAbroadScreen';
import { CountryGuideScreen } from '@/components/moving/CountryGuideScreen';
import { VisaExplorerScreen } from '@/components/moving/VisaExplorerScreen';
import { CityComparisonScreen } from '@/components/moving/CityComparisonScreen';
import { CostCalculatorScreen } from '@/components/moving/CostCalculatorScreen';
import { MovingChecklistScreen } from '@/components/moving/MovingChecklistScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { SavedScreen } from '@/components/saved/SavedScreen';
import { countryGuides, type SupportedGuideCountry } from '@/lib/countryGuides';

export default function IndexRoute() {
  const [tab, setTab] = useState('Home');
  const [guideCountry, setGuideCountry] = useState<SupportedGuideCountry>('Italy');
  const openGuide = (country: string) => {
    if (country in countryGuides) {
      setGuideCountry(country as SupportedGuideCountry);
      setTab('CountryGuide');
    }
  };
  if (tab === 'CountryGuide') return <CountryGuideScreen key={guideCountry} guide={countryGuides[guideCountry]} onBack={() => setTab('Move')} />;
  if (tab === 'VisaExplorer') return <VisaExplorerScreen onBack={() => setTab('Move')} />;
  if (tab === 'CityComparison') return <CityComparisonScreen onBack={() => setTab('Move')} />;
  if (tab === 'CostCalculator') return <CostCalculatorScreen onBack={() => setTab('Move')} />;
  if (tab === 'MovingChecklist') return <MovingChecklistScreen onBack={() => setTab('Move')} />;
  if (tab === 'Explore') return <ExploreScreen onTabChange={setTab} />;
  if (tab === 'Saved') return <SavedScreen onTabChange={setTab} />;
  if (tab === 'Move') return <MovingAbroadScreen onTabChange={setTab} onOpenCountry={openGuide} onOpenVisa={() => setTab('VisaExplorer')} onOpenComparison={() => setTab('CityComparison')} onOpenCalculator={() => setTab('CostCalculator')} onOpenChecklist={() => setTab('MovingChecklist')} />;
  if (tab === 'Profile') return <ProfileScreen onTabChange={setTab} />;
  return <HomeScreen onTabChange={setTab} />;
}
