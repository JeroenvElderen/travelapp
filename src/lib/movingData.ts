export type MovingPlan = {
  id: string;
  title: string;
  country: string;
  flag: string;
  cities: string;
  moveDate: string;
  household: string;
  budget: string;
  reason: string;
  visaRoute: string;
  note: string;
  completedSteps: number;
  totalSteps: number;
};

export const movingPlans: MovingPlan[] = [
  { id: 'portugal-2027', title: 'Move to Portugal in 2027', country: 'Portugal', flag: '🇵🇹', cities: 'Lisbon · Porto', moveDate: 'September 2027', household: '2 people', budget: '€3,200 / month', reason: 'Lifestyle & remote work', visaRoute: 'D8 Digital Nomad', note: 'Visit Porto again in spring.', completedSteps: 7, totalSteps: 12 },
  { id: 'italy-spain', title: 'Compare Italy and Spain', country: 'Italy + Spain', flag: '🇮🇹', cities: 'Valencia · Bologna', moveDate: 'Exploring 2028', household: '2 people', budget: '€2,800 / month', reason: 'Culture & climate', visaRoute: 'Under review', note: 'Compare healthcare access.', completedSteps: 2, totalSteps: 10 },
];

export const deadlines = [
  { day: '18', month: 'SEP', title: 'Passport renewal', detail: 'Allow 10–13 weeks', tone: 'gold' },
  { day: '02', month: 'OCT', title: 'Book scouting trip', detail: 'Lisbon & Porto · 8 days', tone: 'green' },
];

export const countries = [
  { flag: '🇵🇹', name: 'Portugal', match: '94%', city: 'Lisbon', monthly: '€2,780' },
  { flag: '🇪🇸', name: 'Spain', match: '91%', city: 'Valencia', monthly: '€2,430' },
  { flag: '🇮🇹', name: 'Italy', match: '87%', city: 'Bologna', monthly: '€2,560' },
];