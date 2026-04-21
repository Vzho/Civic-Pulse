import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventType = 'Event' | 'Opportunity';

export interface Organization {
  id: string;
  name: string;
  mission: string;
  category: string;
  credibilityScore: number; // 0-100
  verified: boolean;
  contact: {
    email: string;
    website: string;
    address: string;
  };
  stats: {
    eventsHosted: number;
    volunteersEngaged: number;
  };
}

export interface CivicEvent {
  id: string;
  title: string;
  dateStr: string;
  location: string;
  topic: string;
  type: EventType;
  organization: string;
  orgId: string;
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
  status?: string;
  isLoggedIn: boolean;
  onboardingComplete: boolean;
  topicsId: string[];
  points: number;
  rsvps: string[]; // event IDs
}

const mockOrgs: Organization[] = [
  {
    id: 'org1',
    name: 'Oakland Housing Coalition',
    mission: 'To ensure every resident of Oakland has access to safe, secure, and affordable housing through advocacy and policy reform.',
    category: 'Housing',
    credibilityScore: 94,
    verified: true,
    contact: { email: 'info@oaklandhousing.org', website: 'https://oaklandhousing.org', address: '123 Broadway, Oakland, CA' },
    stats: { eventsHosted: 124, volunteersEngaged: 1250 }
  },
  {
    id: 'org2',
    name: 'Berkeley City Council',
    mission: 'The governing body for the City of Berkeley, dedicated to serving the community through transparent governance and public service.',
    category: 'Government',
    credibilityScore: 100,
    verified: true,
    contact: { email: 'clerk@cityofberkeley.info', website: 'https://berkeleyca.gov', address: '2180 Milvia St, Berkeley, CA' },
    stats: { eventsHosted: 540, volunteersEngaged: 3000 }
  },
  {
    id: 'org3',
    name: 'Streetside Pantry',
    mission: 'A grassroots initiative providing direct food support and essentials to our unhoused neighbors in West Oakland.',
    category: 'Local Org',
    credibilityScore: 88,
    verified: true,
    contact: { email: 'hello@streetsidepantry.org', website: 'https://streetsidepantry.org', address: 'Mobile / West Oakland' },
    stats: { eventsHosted: 45, volunteersEngaged: 320 }
  },
  {
    id: 'org4',
    name: 'East Bay Climate Action Coalition',
    mission: 'Organizing for bold local climate solutions and environmental justice across the East Bay.',
    category: 'Environment',
    credibilityScore: 91,
    verified: true,
    contact: { email: 'action@ebcac.org', website: 'https://ebcac.org', address: 'Oakland Hub' },
    stats: { eventsHosted: 62, volunteersEngaged: 850 }
  },
  {
    id: 'org5',
    name: 'Metropolitan Transportation Commission',
    mission: 'Planning, financing and coordinating the Bay Area’s transportation system for a more sustainable future.',
    category: 'Government',
    credibilityScore: 98,
    verified: true,
    contact: { email: 'info@bayareametro.gov', website: 'https://mtc.ca.gov', address: '375 Beale St, San Francisco, CA' },
    stats: { eventsHosted: 210, volunteersEngaged: 4500 }
  },
  {
    id: 'org6',
    name: 'Bay Area Food Bank',
    mission: 'Connecting people with food and resources to end hunger across the Bay Area.',
    category: 'Social Services',
    credibilityScore: 96,
    verified: true,
    contact: { email: 'volunteer@bayareafoodbank.org', website: 'https://bayareafoodbank.org', address: '7750 Pardee Ln, Oakland, CA' },
    stats: { eventsHosted: 350, volunteersEngaged: 12000 }
  },
  {
    id: 'org7',
    name: 'Unified Teachers Association',
    mission: 'Representing educators and advocating for quality public education and professional respect.',
    category: 'Labor',
    credibilityScore: 89,
    verified: false,
    contact: { email: 'office@uta.org', website: 'https://uta.org', address: 'Berkeley High Center' },
    stats: { eventsHosted: 28, volunteersEngaged: 1200 }
  },
  {
    id: 'org8',
    name: 'City of Fremont',
    mission: 'Serving the residents of Fremont with essential services and community-driven urban planning.',
    category: 'Government',
    credibilityScore: 100,
    verified: true,
    contact: { email: 'planning@fremont.gov', website: 'https://fremont.gov', address: '3300 Capitol Ave, Fremont, CA' },
    stats: { eventsHosted: 420, volunteersEngaged: 5600 }
  }
];

const mockEvents: CivicEvent[] = [
  {
    id: '1',
    title: 'The Future of Rent Control in Oakland',
    dateStr: 'Thu Apr 24 · 6:30 PM',
    location: 'Laney College, Rm 204',
    topic: 'Speaker series',
    type: 'Event',
    organization: 'Oakland Housing Coalition',
    orgId: 'org1',
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
    orgId: 'org2',
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
    orgId: 'org3',
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
    orgId: 'org4',
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
    orgId: 'org5',
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
    orgId: 'org6',
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
    orgId: 'org7',
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
    orgId: 'org8',
    description: 'Public hearing and presentation on the newly proposed mixed-use zoning laws to increase housing density.',
    attendees: 210,
  },
];

interface AppState {
  user: UserConfig;
  events: CivicEvent[];
  organizations: Organization[];
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
        status: 'Active now',
      },
      events: mockEvents,
      organizations: mockOrgs,
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
        
        // Sync mock data: If an event exists in both, update the persisted one with latest mock fields (like orgId)
        if (state.events) {
          state.events = state.events.map(se => {
            const mock = mockEvents.find(me => me.id === se.id);
            return mock ? { ...se, ...mock } : se;
          });

          // Add any entirely new mock events
          const missingEvents = mockEvents.filter(
            (me) => !state.events.some((se: CivicEvent) => se.id === me.id)
          );
          state.events = [...state.events, ...missingEvents];
        }

        // Also ensure organizations are fresh
        state.organizations = mockOrgs;

        return state;
      },
    }
  )
);
