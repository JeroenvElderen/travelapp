export type ChecklistPhaseId = 'research' | 'three-six' | 'one-three' | 'arrival' | 'first-three';

export type MoveProfile = {
  destination: string;
  nationality: string;
  moveDate: string;
  visaPathway: string;
  household: string;
  employment: string;
  pets: boolean;
  education: boolean;
  driving: boolean;
};

export type ChecklistItem = {
  id: string;
  phase: ChecklistPhaseId;
  title: string;
  detail: string;
  dueDate: string;
  completed: boolean;
  notes: string;
  custom?: boolean;
};

export const phaseMeta: { id: ChecklistPhaseId; label: string; description: string }[] = [
  { id: 'research', label: 'Research phase', description: 'Build a realistic picture before committing.' },
  { id: 'three-six', label: '3–6 months before', description: 'Documents and applications take the lead.' },
  { id: 'one-three', label: '1–3 months before', description: 'Turn your plan into bookings and arrangements.' },
  { id: 'arrival', label: 'Arrival week', description: 'Get connected and complete first appointments.' },
  { id: 'first-three', label: 'First 3 months', description: 'Finish registrations and settle into local life.' },
];

export const defaultMoveProfile: MoveProfile = {
  destination: 'Portugal', nationality: 'Canadian', moveDate: '2027-09-15',
  visaPathway: 'D8 Digital Nomad', household: 'Couple', employment: 'Remote employee',
  pets: true, education: false, driving: true,
};

const offsetDate = (date: string, days: number) => {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  parsed.setDate(parsed.getDate() + days);
  return parsed.toISOString().slice(0, 10);
};

export function buildChecklist(profile: MoveProfile): ChecklistItem[] {
  const make = (id: string, phase: ChecklistPhaseId, title: string, detail: string, offset: number): ChecklistItem =>
    ({ id, phase, title, detail, dueDate: offsetDate(profile.moveDate, offset), completed: false, notes: '' });
  return [
    make('compare', 'research', `Research life in ${profile.destination}`, 'Compare cities, monthly costs and healthcare access.', -240),
    make('visa-options', 'research', 'Confirm your visa pathway', `Review official eligibility for ${profile.visaPathway} based on ${profile.nationality} nationality.`, -225),
    make('employment', 'research', 'Plan your employment setup', `Check tax, payroll and work-right implications for: ${profile.employment}.`, -210),
    make('passport', 'three-six', 'Check passport validity', 'Reference validity rules and renewal timing. Keep identity documents in your own secure storage.', -180),
    make('documents', 'three-six', 'Collect required documents', 'Create a document list from official sources; arrange certified copies and translations where required.', -165),
    make('visa-apply', 'three-six', `Apply for ${profile.visaPathway}`, 'Confirm forms, fees and appointment lead times with the relevant authority.', -150),
    ...(profile.education ? [make('schools', 'three-six', 'Shortlist schools or childcare', 'Compare admissions, calendars, language support and required records.', -140)] : []),
    ...(profile.pets ? [make('pets', 'three-six', 'Plan pet transportation', 'Check microchip, vaccination, health certificate and carrier requirements.', -135)] : []),
    make('home', 'one-three', 'Arrange initial accommodation', `Book a suitable first home for your ${profile.household.toLowerCase()}.`, -75),
    make('insurance', 'one-three', 'Obtain moving and health cover', 'Confirm coverage dates, exclusions and evidence needed for your visa.', -60),
    make('travel', 'one-three', 'Book travel and shipping', 'Confirm luggage, shipping inventory and arrival-day transport.', -45),
    make('notify', 'one-three', 'Notify banks and authorities', 'Update contact details and check whether departure notifications are required.', -30),
    make('sim', 'arrival', 'Get connected locally', 'Purchase a local SIM and public-transport pass.', 0),
    make('address', 'arrival', 'Register your address', 'Attend required government appointments and retain confirmation receipts.', 2),
    make('banking', 'arrival', 'Set up banking and utilities', 'Compare account fees and arrange essential household services.', 4),
    make('healthcare', 'first-three', 'Register for healthcare', 'Confirm public eligibility and choose any additional private coverage.', 14),
    make('tax', 'first-three', 'Obtain a tax identification number', 'Use official channels and note filing obligations.', 21),
    ...(profile.driving ? [make('licence', 'first-three', 'Convert your driving licence', 'Check recognition, exchange deadlines, testing and insurance requirements.', 35)] : []),
    make('residency', 'first-three', 'Complete residency registration', 'Review registration evidence, appointment requirements and processing times.', 45),
    make('renewals', 'first-three', 'Review renewal deadlines', 'Record permit, insurance and passport renewal dates in your calendar.', 75),
  ];
}

export function moveChecklistDates(items: ChecklistItem[], oldDate: string, newDate: string) {
  const delta = new Date(`${newDate}T12:00:00`).getTime() - new Date(`${oldDate}T12:00:00`).getTime();
  if (!Number.isFinite(delta)) return items;
  const days = Math.round(delta / 86_400_000);
  return items.map(item => item.completed ? item : { ...item, dueDate: offsetDate(item.dueDate, days) });
}