export type Range = { low: number; expected: number; high: number };

export type CalculatorInput = {
  name: string;
  currentCity: string;
  destinationCity: string;
  adults: number;
  children: number;
  monthlyIncome: number;
  housing: 'Apartment' | 'House' | 'Shared home';
  bedrooms: number;
  location: 'City center' | 'Suburban';
  transport: 'Public transport' | 'Car';
  childcare: 'None' | 'Part-time' | 'Full-time';
  education: 'Public' | 'Private' | 'International';
  healthcare: 'Public' | 'Private' | 'Employer covered';
  lifestyle: 'Essential' | 'Comfortable' | 'Premium';
  movingDate: string;
  pets: number;
};

export type Estimate = {
  currency: 'EUR';
  monthly: Record<string, Range>;
  moving: Record<string, Range>;
  monthlyTotal: Range;
  movingTotal: Range;
  assumptions: string[];
  sources: string[];
  updated: string;
};

const cityFactors: Record<string, { rent: number; daily: number }> = {
  lisbon: { rent: 1.35, daily: 1.16 }, porto: { rent: 1.05, daily: 1.02 },
  braga: { rent: 0.76, daily: 0.88 }, madrid: { rent: 1.2, daily: 1.08 },
  barcelona: { rent: 1.3, daily: 1.12 }, paris: { rent: 1.75, daily: 1.35 },
  berlin: { rent: 1.28, daily: 1.15 }, amsterdam: { rent: 1.7, daily: 1.3 },
};

const range = (value: number, spread = .16): Range => ({
  low: Math.round(value * (1 - spread)), expected: Math.round(value), high: Math.round(value * (1 + spread)),
});

const sum = (items: Record<string, Range>): Range => Object.values(items).reduce((total, item) => ({
  low: total.low + item.low, expected: total.expected + item.expected, high: total.high + item.high,
}), { low: 0, expected: 0, high: 0 });

export const defaultCalculatorInput: CalculatorInput = {
  name: 'Living in Lisbon', currentCity: 'New York', destinationCity: 'Lisbon', adults: 1,
  children: 0, monthlyIncome: 4500, housing: 'Apartment', bedrooms: 1, location: 'City center',
  transport: 'Public transport', childcare: 'None', education: 'Public', healthcare: 'Public',
  lifestyle: 'Comfortable', movingDate: '2027-03-01', pets: 0,
};

export function calculateCost(input: CalculatorInput): Estimate {
  const factor = cityFactors[input.destinationCity.trim().toLowerCase()] ?? { rent: 1, daily: 1 };
  const people = input.adults + input.children;
  const lifestyle = input.lifestyle === 'Essential' ? .78 : input.lifestyle === 'Premium' ? 1.45 : 1;
  const location = input.location === 'City center' ? 1.18 : .9;
  const home = input.housing === 'House' ? 1.28 : input.housing === 'Shared home' ? .68 : 1;
  const childcare = input.childcare === 'Full-time' ? 720 : input.childcare === 'Part-time' ? 360 : 0;
  const education = input.education === 'International' ? 950 : input.education === 'Private' ? 520 : 55;
  const healthcare = input.healthcare === 'Private' ? 145 : input.healthcare === 'Employer covered' ? 35 : 70;
  const monthly = {
    Rent: range((760 + input.bedrooms * 320) * factor.rent * location * home, .22),
    Utilities: range((105 + people * 28) * factor.daily, .2),
    Groceries: range((190 * input.adults + 125 * input.children) * factor.daily * lifestyle, .18),
    'Public transportation': range(input.transport === 'Public transport' ? 46 * input.adults * factor.daily : 12, .15),
    'Car ownership': range(input.transport === 'Car' ? (390 + 45 * people) * factor.daily : 0, .24),
    Phone: range(22 * Math.max(input.adults, 1) * factor.daily, .12),
    Internet: range(38 * factor.daily, .12),
    Healthcare: range(healthcare * people * factor.daily, .25),
    Insurance: range((55 + 18 * people) * factor.daily, .22),
    Childcare: range(childcare * input.children * factor.daily, .28),
    Education: range(education * input.children * factor.daily, .25),
    Entertainment: range(115 * Math.max(people, 1) * factor.daily * lifestyle, .3),
    'Estimated taxes': range(Math.max(input.monthlyIncome * .18, 0), .35),
    Miscellaneous: range((95 + 45 * people) * factor.daily * lifestyle, .25),
  };
  const monthlyTotal = sum(monthly);
  const moving = {
    'Visa fees': range(210 * people, .35), 'Document translation': range(180 + 65 * people, .3),
    Flights: range(520 * people, .35), 'Shipping belongings': range(950 + input.bedrooms * 600, .4),
    'Temporary accommodation': range(105 * 14 * factor.daily, .3), 'Rental deposit': range(monthly.Rent.expected * 2, .15),
    Furniture: range((900 + input.bedrooms * 700) * home, .38), 'Pet relocation': range(input.pets * 850, .45),
    Insurance: range(190 + people * 55, .25), 'Emergency fund': range(monthlyTotal.expected * 3, .18),
    'Currency-conversion buffer': range(Math.max(input.monthlyIncome * 1.5 * .03, 120), .3),
  };
  return {
    currency: 'EUR', monthly, moving, monthlyTotal, movingTotal: sum(moving),
    assumptions: [
      `${input.adults} adult${input.adults === 1 ? '' : 's'} and ${input.children} child${input.children === 1 ? '' : 'ren'}`,
      `${input.bedrooms}-bedroom ${input.housing.toLowerCase()} in a ${input.location.toLowerCase()} area`,
      `${input.transport.toLowerCase()}, ${input.lifestyle.toLowerCase()} lifestyle`,
      `${input.healthcare.toLowerCase()} healthcare and ${input.education.toLowerCase()} education`,
      'Taxes are a planning allowance, not personal tax advice',
    ],
    sources: ['Eurostat household expenditure benchmarks', 'Numbeo city cost indices', 'Local rental-market asking-price averages', 'Official immigration fee schedules'],
    updated: '3 August 2026',
  };
}