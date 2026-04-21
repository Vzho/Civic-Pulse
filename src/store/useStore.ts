import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventType = 'Event' | 'Opportunity';

export interface CivicEvent {
  id: string;
  title: string;
  dateStr: string;
  location: string;
  topic: string;
  type: EventType;
  organization: string;
  description: string;
  attendees: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

interface UserConfig {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
  onboardingComplete: boolean;
  topicsId: string[];
  points: number;
  rsvps: string[]; // event IDs
}

const mockEvents: CivicEvent[] = [
  {
    id: '1',
    title: 'The Future of Rent Control in Oakland',
    dateStr: 'Thu Apr 24 · 6:30 PM',
    location: 'Laney College, Rm 204',
    topic: 'Speaker series',
    type: 'Event',
    organization: 'Oakland Housing Coalition',
    description: 'An open forum discussing the upcoming rent control measures and how they affect local residents.',
    attendees: 47,
  },
  {
    id: '2',
    title: 'Berkeley City Council — Budget Session',
    dateStr: 'Mon Apr 28 · 7:00 PM',
    location: 'City Hall, Council Chamber',
    topic: 'City council',
    type: 'Event',
    organization: 'Berkeley City Council',
    description: 'Public session regarding the annual city budget allocation. Open for public comment.',
    attendees: 132,
  },
  {
    id: '3',
    title: 'Streetside Pantry Volunteer Day',
    dateStr: 'Sat May 3 · 9:00 AM',
    location: 'West Oakland BART Plaza',
    topic: 'Local org',
    type: 'Opportunity',
    organization: 'Streetside Pantry',
    description: 'Help us distribute food and essential items to unhoused neighbors.',
    attendees: 28,
  },
  {
    id: '4',
    title: 'East Bay Climate Action Coalition — Monthly Meetup',
    dateStr: 'Tue Apr 22 · 6:00 PM',
    location: 'Online + Oakland Hub',
    topic: 'Climate',
    type: 'Event',
    organization: 'EBCAC',
    description: 'Monthly gathering to plan our upcoming climate resilience initiatives.',
    attendees: 89,
  },
  {
    id: '5',
    title: 'Public Comment: MTC Regional Housing Mandate',
    dateStr: 'Wed Apr 23 · 10:00 AM',
    location: 'Oakland City Hall',
    topic: 'City council',
    type: 'Event',
    organization: 'Metropolitan Transportation Commission',
    description: 'Open to public comment regarding the newly proposed housing mandate.',
    attendees: 0,
  },
  {
    id: '6',
    title: 'Community Food Bank Volunteer Drive',
    dateStr: 'Sat May 10 · 9:00 AM',
    location: 'Oakland Convention Center',
    topic: 'Local orgs',
    type: 'Opportunity',
    organization: 'Bay Area Food Bank',
    description: 'Help sort and package meals for families in need around the Bay Area.',
    attendees: 145,
  },
  {
    id: '7',
    title: 'Teachers Union Contract Negotiation Update',
    dateStr: 'Tue May 13 · 6:00 PM',
    location: 'Berkeley High School Auditorium',
    topic: 'Labor',
    type: 'Event',
    organization: 'Unified Teachers Association',
    description: 'An update on the ongoing negotiations with the school district regarding class sizes and fair pay.',
    attendees: 320,
  },
  {
    id: '8',
    title: 'Affordable Housing Zoning Proposal',
    dateStr: 'Thu May 15 · 7:30 PM',
    location: 'Fremont City Hall',
    topic: 'Housing',
    type: 'Event',
    organization: 'City of Fremont',
    description: 'Public hearing and presentation on the newly proposed mixed-use zoning laws to increase housing density.',
    attendees: 210,
  },
];

interface AppState {
  user: UserConfig;
  events: CivicEvent[];
  login: (first: string, last: string, email: string) => void;
  logout: () => void;
  completeOnboarding: (topics: string[]) => void;
  toggleRsvp: (eventId: string) => void;
  addEvent: (event: CivicEvent) => void;
  updateUser: (data: Partial<UserConfig>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        firstName: '',
        lastName: '',
        email: '',
        isLoggedIn: false,
        onboardingComplete: false,
        topicsId: [],
        points: 5356,
        rsvps: [],
      },
      events: mockEvents,
      login: (first, last, email) =>
        set((state) => ({
          user: { ...state.user, firstName: first, lastName: last, email, isLoggedIn: true },
        })),
      logout: () =>
        set((state) => ({
          user: { ...state.user, isLoggedIn: false, onboardingComplete: false },
        })),
      completeOnboarding: (topics) =>
        set((state) => ({
          user: { ...state.user, onboardingComplete: true, topicsId: topics },
        })),
      toggleRsvp: (eventId) =>
        set((state) => {
          const isRsvpd = state.user.rsvps.includes(eventId);
          const newRsvps = isRsvpd
            ? state.user.rsvps.filter((id) => id !== eventId)
            : [...state.user.rsvps, eventId];
            
          // Also update attendee count locally
          const newEvents = state.events.map(e => {
            if (e.id === eventId) {
                return { ...e, attendees: isRsvpd ? e.attendees - 1 : e.attendees + 1 }
            }
            return e;
          });

          return { user: { ...state.user, rsvps: newRsvps }, events: newEvents };
        }),
      addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'civicpulse-storage',
      merge: (persistedState: any, currentState) => {
        const state = { ...currentState, ...persistedState };
        // Ensure any new mock events missing from the user's cached storage are appended
        if (persistedState?.events) {
          const missingEvents = mockEvents.filter(
            (me) => !persistedState.events.some((se: CivicEvent) => se.id === me.id)
          );
          state.events = [...persistedState.events, ...missingEvents];
        }
        return state;
      },
    }
  )
);
