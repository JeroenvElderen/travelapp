import { countryMatchProfiles, matchQuestions } from '@/lib/countryMatchData';
import type { CountryMatchResult, MatchAnswer } from '@/types/countryMatch';

const budgetCeilings: Record<string, number> = { 'budget-low': 1800, 'budget-mid': 2800, 'budget-high': 4000, 'budget-premium': 6000 };

export function createCountryMatches(answers: MatchAnswer): CountryMatchResult[] {
  const values = Object.values(answers);
  const budget = budgetCeilings[answers.budget] ?? 2800;
  return countryMatchProfiles.map(profile => {
    const matchingTags = values.filter(value => profile.tags.includes(value));
    const budgetFit = budget >= profile.monthlyBudget ? 2 : budget >= profile.monthlyBudget * 0.82 ? 1 : 0;
    const raw = matchingTags.length + budgetFit;
    const score = Math.min(97, Math.max(62, Math.round(58 + (raw / (matchQuestions.length + 2)) * 42)));
    const matchedAnswers = matchQuestions
      .filter(question => matchingTags.includes(answers[question.id]))
      .map(question => question.options.find(option => option.value === answers[question.id])?.label)
      .filter((label): label is string => Boolean(label));
    return { ...profile, score, matchedAnswers };
  }).sort((a, b) => b.score - a.score);
}

export function describeBudgetCompatibility(selectedBudget: string, estimatedMonthly: number) {
  const ceiling = budgetCeilings[selectedBudget] ?? 2800;
  if (ceiling >= estimatedMonthly * 1.2) return 'Comfortable fit';
  if (ceiling >= estimatedMonthly) return 'Likely compatible';
  if (ceiling >= estimatedMonthly * 0.82) return 'Possible with compromises';
  return 'Likely above your budget';
}