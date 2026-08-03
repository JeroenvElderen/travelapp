export type MatchAnswer = Record<string, string>;

export type MatchQuestion = {
  id: string;
  eyebrow: string;
  title: string;
  helper: string;
  options: { label: string; value: string; detail: string }[];
};

export type CountryMatchProfile = {
  id: string;
  country: string;
  flag: string;
  monthlyBudget: number;
  budgetLabel: string;
  tags: string[];
  strengths: string[];
  compromises: string[];
  visaPathways: string[];
  cities: string[];
  unavailable: string[];
};

export type CountryMatchResult = CountryMatchProfile & {
  score: number;
  matchedAnswers: string[];
};