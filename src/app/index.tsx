import { useState } from 'react';

import { AppMenu } from '@/components/navigation/AppMenu';
import { AppMenuProvider } from '@/components/navigation/AppMenuContext';
import { AIPlannerScreen } from '@/components/planner/AIPlannerScreen';

import { ExploreScreen } from '@/components/explore/ExploreScreen';
import { HomeScreen } from '@/components/home/HomeScreen';
import { MovingAbroadScreen } from '@/components/moving/MovingAbroadScreen';
import { CountryGuideScreen } from '@/components/moving/CountryGuideScreen';
import { VisaExplorerScreen } from '@/components/moving/VisaExplorerScreen';
import { CityComparisonScreen } from '@/components/moving/CityComparisonScreen';
import { CostCalculatorScreen } from '@/components/moving/CostCalculatorScreen';
import { MovingChecklistScreen } from '@/components/moving/MovingChecklistScreen';
import { CountryMatchScreen } from '@/components/country-match/CountryMatchScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { SavedScreen } from '@/components/saved/SavedScreen';
import { countryGuides, type SupportedGuideCountry } from '@/lib/countryGuides';

export default function IndexRoute() {
  const [tab, setTab] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideCountry, setGuideCountry] = useState<SupportedGuideCountry>('Italy');
  const openGuide = (country: string) => {
    if (country in countryGuides) {
      setGuideCountry(country as SupportedGuideCountry);
      setTab('CountryGuide');
    }
  };
  let screen;
  if (tab === 'CountryGuide') screen = <CountryGuideScreen key={guideCountry} guide={countryGuides[guideCountry]} onBack={() => setTab('Move')} />;
  else if (tab === 'VisaExplorer') screen = <VisaExplorerScreen onBack={() => setTab('Move')} />;
  else if (tab === 'CityComparison') screen = <CityComparisonScreen onBack={() => setTab('Move')} />;
  else if (tab === 'CostCalculator') screen = <CostCalculatorScreen onBack={() => setTab('Move')} />;
  else if (tab === 'MovingChecklist') screen = <MovingChecklistScreen onBack={() => setTab('Move')} />;
  else if (tab === 'CountryMatch') screen = <CountryMatchScreen onBack={() => setTab('Move')} />;
  else if (tab === 'Planner') screen = <AIPlannerScreen onBack={() => setTab('Home')} onOpenGuide={openGuide} />;
  else if (tab === 'Explore') screen = <ExploreScreen onTabChange={setTab} />;
  else if (tab === 'Saved') screen = <SavedScreen onTabChange={setTab} />;
  else if (tab === 'Move') screen = <MovingAbroadScreen onTabChange={setTab} onOpenCountry={openGuide} onOpenVisa={() => setTab('VisaExplorer')} onOpenComparison={() => setTab('CityComparison')} onOpenCalculator={() => setTab('CostCalculator')} onOpenChecklist={() => setTab('MovingChecklist')} onOpenCountryMatch={() => setTab('CountryMatch')} />;
  else if (tab === 'Profile') screen = <ProfileScreen onTabChange={setTab} />;
  else screen = <HomeScreen onTabChange={setTab} />;
  return <AppMenuProvider onOpen={() => setMenuOpen(true)}>{screen}<AppMenu visible={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={setTab}/></AppMenuProvider>;
}
