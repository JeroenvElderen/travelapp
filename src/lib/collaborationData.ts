export type CollaborativePlanType = 'trip' | 'move';

export type PlanMember = {
  id: string;
  initials: string;
  name: string;
  color: string;
};

export type PlanTask = {
  id: string;
  title: string;
  meta: string;
  assignee: string;
  completed: boolean;
};

export type CollaborativePlan = {
  id: string;
  type: CollaborativePlanType;
  eyebrow: string;
  title: string;
  dates: string;
  progress: number;
  members: PlanMember[];
  tasks: PlanTask[];
};

export const collaborativePlans: CollaborativePlan[] = [
  {
    id: 'portugal-summer',
    type: 'trip',
    eyebrow: 'GROUP TRIP',
    title: 'Portugal summer',
    dates: 'Jun 18–27 · 9 days',
    progress: 68,
    members: [
      { id: 'maya', initials: 'ME', name: 'Maya', color: '#C26D4F' },
      { id: 'alex', initials: 'AK', name: 'Alex', color: '#3F7464' },
      { id: 'sam', initials: 'SJ', name: 'Sam', color: '#B98942' },
    ],
    tasks: [
      { id: 'stay', title: 'Choose our Lisbon stay', meta: '3 options · Vote closes Friday', assignee: 'AK', completed: false },
      { id: 'train', title: 'Book Lisbon → Porto train', meta: 'Assigned to Maya · Jun 21', assignee: 'ME', completed: true },
      { id: 'dinner', title: 'Add a welcome dinner', meta: '2 suggestions from Sam', assignee: 'SJ', completed: false },
    ],
  },
  {
    id: 'amsterdam-move',
    type: 'move',
    eyebrow: 'MOVING PLAN',
    title: 'Our move to Amsterdam',
    dates: 'Target move · September',
    progress: 42,
    members: [
      { id: 'maya', initials: 'ME', name: 'Maya', color: '#C26D4F' },
      { id: 'leo', initials: 'LP', name: 'Leo', color: '#55799D' },
    ],
    tasks: [
      { id: 'areas', title: 'Compare three neighborhoods', meta: 'Jordaan, De Pijp, Oost', assignee: 'LP', completed: true },
      { id: 'documents', title: 'Gather registration documents', meta: '4 of 7 items ready', assignee: 'ME', completed: false },
      { id: 'budget', title: 'Review our arrival budget', meta: 'Updated yesterday by Leo', assignee: 'LP', completed: false },
    ],
  },
];