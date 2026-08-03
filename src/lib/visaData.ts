export type VisaPathway = {
  id: string;
  country: string;
  flag: string;
  title: string;
  shortTitle: string;
  tag: string;
  summary: string;
  intendedFor: string;
  conditions: string[];
  stay: string;
  renewal: string;
  workRights: string;
  family: string;
  finances: string;
  insurance: string;
  fees: string;
  processing: string;
  documents: string[];
  submit: string;
  permanentResidence: string;
  officialUrl: string;
  reviewed: string;
};

export const purposes = ['Local employment', 'Remote work', 'Study', 'Retirement', 'Entrepreneurship', 'Investment', 'Family reunification', 'Working holiday', 'Long-term residence'];

export const visaPathways: VisaPathway[] = [
  {
    id: 'pt-d8', country: 'Portugal', flag: '🇵🇹', title: 'Temporary stay visa for remote work', shortTitle: 'Remote work visa', tag: 'STRONG POTENTIAL MATCH',
    summary: 'A temporary-stay route for employed or self-employed remote workers whose work is based outside Portugal.',
    intendedFor: 'Non-EU/EEA nationals who work remotely for an employer or clients outside Portugal and plan to stay for up to one year.',
    conditions: ['Show an active employment or service relationship outside Portugal', 'Provide evidence of average monthly income for the required reference period', 'Meet accommodation, insurance and criminal-record requirements'],
    stay: 'Up to 1 year on the temporary-stay route.', renewal: 'This route is generally issued for the intended temporary stay; confirm extension options with the issuing authority.',
    workRights: 'Remote work for entities outside Portugal. Local employment may require a different authorization.', family: 'Family arrangements may be possible, but each member’s route and documents must be confirmed.',
    finances: 'Typically based on four times Portugal’s monthly minimum wage. The exact threshold changes; verify the current amount before applying.', insurance: 'Travel medical insurance covering urgent care and repatriation is normally requested for the visa stage.',
    fees: 'Consular and service-centre fees vary by location. Confirm with the consulate handling your application.', processing: 'Timing varies by consulate and season; apply well ahead of travel.',
    documents: ['Valid passport and photos', 'Application form', 'Employment contract or client/service evidence', 'Recent income evidence', 'Accommodation evidence', 'Travel medical insurance', 'Criminal-record certificate and consent for checks'],
    submit: 'The Portuguese consulate or its authorized visa application centre serving your place of legal residence.', permanentResidence: 'This temporary-stay visa is not, by itself, a direct permanent-residence route. A residence visa is a distinct pathway.',
    officialUrl: 'https://vistos.mne.gov.pt/en/national-visas/general-information/type-of-visa', reviewed: '3 August 2026',
  },
  {
    id: 'pt-d7', country: 'Portugal', flag: '🇵🇹', title: 'Residence visa for remote work', shortTitle: 'Remote work residence', tag: 'WORTH EXPLORING',
    summary: 'An entry visa used to apply for a Portuguese residence permit for remote work after arrival.',
    intendedFor: 'Non-EU/EEA remote workers seeking residence in Portugal rather than a temporary stay.',
    conditions: ['Remote employment or independent activity must be based outside Portugal', 'Income, accommodation and background requirements apply', 'A residence-permit appointment is required after entry'],
    stay: 'The visa enables entry for the residence-permit process; the permit controls the longer stay.', renewal: 'Residence permits may be renewable when conditions continue to be met.',
    workRights: 'Designed for remote work performed for employers or clients outside Portugal. Confirm any local-work restrictions.', family: 'Family reunification may be available under the residence framework, subject to separate requirements.',
    finances: 'Typically based on four times Portugal’s monthly minimum wage, with current evidence. Verify the live threshold.', insurance: 'Travel insurance is normally needed for entry; Portuguese health-coverage evidence may be needed later.',
    fees: 'Visa, service-centre and residence-permit fees are charged separately and can change.', processing: 'Consular processing and residence appointments vary substantially by location.',
    documents: ['Passport and national-visa form', 'Remote employment or service contracts', 'Income and bank evidence', 'Portuguese accommodation evidence', 'Insurance', 'Criminal-record certificate', 'Tax and social-security evidence where requested'],
    submit: 'Apply through the Portuguese consulate or authorized centre responsible for your legal residence, then complete the permit process in Portugal.',
    permanentResidence: 'Qualifying periods of lawful residence may count toward permanent residence, but continuity and other statutory conditions apply.',
    officialUrl: 'https://vistos.mne.gov.pt/en/national-visas/general-information/type-of-visa', reviewed: '3 August 2026',
  },
  {
    id: 'pt-d2', country: 'Portugal', flag: '🇵🇹', title: 'Residence visa for people with their own income', shortTitle: 'Own-income residence', tag: 'ALTERNATIVE ROUTE',
    summary: 'A residence route commonly explored by retirees and people supported by stable income from outside Portugal.',
    intendedFor: 'People intending to live in Portugal who can demonstrate stable, sufficient means, including many retirees.',
    conditions: ['Show stable and regular resources', 'Provide suitable accommodation in Portugal', 'Satisfy insurance and background requirements'],
    stay: 'Entry visa followed by an application for a residence permit in Portugal.', renewal: 'The residence permit can generally be renewed if its conditions continue to be met.',
    workRights: 'Do not assume work is permitted solely from the entry visa; confirm rights attached to the issued residence permit.', family: 'Family reunification can potentially apply to qualifying residence-permit holders.',
    finances: 'The required means are tied to official subsistence benchmarks and household size. Confirm current formulas and amounts.', insurance: 'Travel medical insurance is generally required at visa stage; health coverage requirements continue after arrival.',
    fees: 'Consular, service and permit fees vary and may change.', processing: 'Varies by post and appointment availability.',
    documents: ['Passport and application', 'Proof of regular income and savings', 'Accommodation evidence', 'Insurance', 'Criminal-record certificate', 'Civil-status documents for accompanying family'],
    submit: 'Portuguese consulate or authorized centre serving the applicant’s legal residence; permit formalities follow in Portugal.',
    permanentResidence: 'Time as a lawful resident may contribute toward permanent residence if all statutory requirements are met.',
    officialUrl: 'https://vistos.mne.gov.pt/en/national-visas/general-information/type-of-visa', reviewed: '3 August 2026',
  },
];