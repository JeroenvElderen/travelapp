import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { CollaborativePlansScreen } from '@/components/collaboration/CollaborativePlansScreen';
import { CountryMatchScreen } from '@/components/country-match/CountryMatchScreen';
import { ExploreScreen } from '@/components/explore/ExploreScreen';
import { HomeScreen } from '@/components/home/HomeScreen';
import { BottomNavigation } from '@/components/home/navigation/BottomNavigation';
import { AppMenu } from '@/components/navigation/AppMenu';
import { AppMenuProvider } from '@/components/navigation/AppMenuContext';
import { CityComparisonScreen } from '@/components/moving/CityComparisonScreen';
import { CostCalculatorScreen } from '@/components/moving/CostCalculatorScreen';
import { CountryGuideScreen } from '@/components/moving/CountryGuideScreen';
import { MovingAbroadScreen } from '@/components/moving/MovingAbroadScreen';
import { MovingChecklistScreen } from '@/components/moving/MovingChecklistScreen';
import { VisaExplorerScreen } from '@/components/moving/VisaExplorerScreen';
import { AIPlannerScreen } from '@/components/planner/AIPlannerScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { SavedScreen } from '@/components/saved/SavedScreen';
import { countryGuides, type SupportedGuideCountry } from '@/lib/countryGuides';

const bottomTabs = new Set(['Home', 'Explore', 'Planner', 'Saved', 'Profile']);

export default function IndexRoute() {
  const [history, setHistory] = useState(['Home']);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideCountry, setGuideCountry] = useState<SupportedGuideCountry>('Italy');
  const tab = history[history.length - 1];
  const canGoBack = history.length > 1;

  const navigate = useCallback((nextTab: string) => {
    setHistory(current => current[current.length - 1] === nextTab ? current : [...current, nextTab]);
  }, []);

  const goBack = useCallback(() => {
    setHistory(current => current.length > 1 ? current.slice(0, -1) : current);
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menuOpen) {
        setMenuOpen(false);
        return true;
      }
      if (!canGoBack) return false;
      goBack();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack, goBack, menuOpen]);

  const backSwipe = Gesture.Pan()
    .activeOffsetX(16)
    .failOffsetY([-18, 18])
    .onEnd(event => {
      if (event.translationX > 64 || event.velocityX > 450) goBack();
    })
    .runOnJS(true);

  const openGuide = (country: string) => {
    if (country in countryGuides) {
      setGuideCountry(country as SupportedGuideCountry);
      navigate('CountryGuide');
    }
  };

  let screen;
  if (tab === 'CountryGuide') screen = <CountryGuideScreen key={guideCountry} guide={countryGuides[guideCountry]} onBack={goBack} />;
  else if (tab === 'VisaExplorer') screen = <VisaExplorerScreen onBack={goBack} />;
  else if (tab === 'CityComparison') screen = <CityComparisonScreen onBack={goBack} />;
  else if (tab === 'CostCalculator') screen = <CostCalculatorScreen onBack={goBack} />;
  else if (tab === 'MovingChecklist') screen = <MovingChecklistScreen onBack={goBack} />;
  else if (tab === 'CountryMatch') screen = <CountryMatchScreen onBack={goBack} />;
  else if (tab === 'Planner') screen = <AIPlannerScreen onBack={goBack} onOpenGuide={openGuide} />;
  else if (tab === 'Explore') screen = <ExploreScreen onTabChange={navigate} />;
  else if (tab === 'Saved') screen = <SavedScreen onTabChange={navigate} />;
  else if (tab === 'Move') screen = <MovingAbroadScreen onTabChange={navigate} onOpenCountry={openGuide} onOpenVisa={() => navigate('VisaExplorer')} onOpenComparison={() => navigate('CityComparison')} onOpenCalculator={() => navigate('CostCalculator')} onOpenChecklist={() => navigate('MovingChecklist')} onOpenCountryMatch={() => navigate('CountryMatch')} />;
  else if (tab === 'Profile') screen = <ProfileScreen onTabChange={navigate} />;
  else if (tab === 'Collaborate') screen = <CollaborativePlansScreen />;
  else screen = <HomeScreen onTabChange={navigate} />;

  const activeBottomTab = bottomTabs.has(tab) ? tab : undefined;

  return (
    <AppMenuProvider onOpen={() => setMenuOpen(true)}>
      <View style={styles.root}>
        {screen}
        {canGoBack && (
          <GestureDetector gesture={backSwipe}>
            <View accessibilityLabel="Swipe right to go back" style={styles.backSwipeEdge} />
          </GestureDetector>
        )}
        <BottomNavigation active={activeBottomTab} onChange={navigate} />
        <AppMenu visible={menuOpen} activeTab={tab} onClose={() => setMenuOpen(false)} onNavigate={navigate} />
      </View>
    </AppMenuProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backSwipeEdge: { position: 'absolute', left: 0, top: 0, bottom: 100, width: 28, zIndex: 9 },
});
