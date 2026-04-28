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
    mission: 'To serve the Berkeley community through responsive governance, inclusive policymaking, and equitable public services that improve quality of life for all residents.',
    category: 'Government',
    credibilityScore: 100,
    verified: true,
    contact: { email: 'council@berkeleyca.gov', website: 'https://berkeleyca.gov/', address: '2180 Milvia Street, Berkeley, CA' },
    stats: { eventsHosted: 124, volunteersEngaged: 1250 }
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
    id: '2',
    title: 'Earth Day Cleanup',
    dateStr: 'Sat Apr 18 · 9:00 AM - 11:00 AM',
    location: '160 University Ave, Berkeley, CA 94710',
    topic: 'Climate',
    type: 'Event',
    organization: 'Berkeley City Council',
    orgId: 'org2',
    description: 'Join us for a community cleanup to help remove litter, protect public spaces, and support a cleaner Berkeley.\n\nThis is a public volunteer opportunity that encourages environmental stewardship and community participation.',
    attendees: 132,
  },
  {
    id: '5',
    title: 'Public Hearing of Housing Funding Plans',
    dateStr: 'Tue April 28, 2026 · 6:00 PM',
    location: 'School District Board Room - 1231 Addison Street, Berkeley, CA 94702',
    topic: 'Housing',
    type: 'Event',
    organization: 'City of Berkeley',
    orgId: 'org2',
    description: 'Join the Berkeley City Council for a public hearing to review and discuss the city\'s housing funding plans. The hearing will cover proposed allocations for affordable housing, emergency solutions, and the Housing Trust Fund, including how funds will be prioritized, distributed, and measured for impact. Community members are encouraged to attend, listen, and provide public comment to help shape the city\'s investment in housing stability and equity.',
    attendees: 210,
  },
  {
    id: '1',
    title: 'Arbor Day + Spring Planting Events',
    dateStr: 'Saturday, April 18, 2026 · 9:00 AM - 11:00 AM',
    location: '160 University Ave, Berkeley, CA 94710',
    topic: 'Climate',
    type: 'Event',
    organization: 'Berkeley City Council',
    orgId: 'org2',
    description: 'Join a community planting event focused on greening Berkeley through tree planting, habitat restoration, and hands-on environmental stewardship.\n\nParticipants will help improve local public space, support pollinators, and contribute to a healthier urban ecosystem. Come early, dress for outdoor work, and be ready to volunteer.',
    attendees: 47,
  },
  {
    id: 'mtc-housing',
    title: 'Public Comment: MTC Regional Housing Mandate',
    dateStr: 'Wed Apr 23, 2026 · 10:00 AM',
    location: 'Oakland City Hall',
    topic: 'City council',
    type: 'Event',
    organization: 'Metropolitan Transportation Commission',
    orgId: 'org-mtc',
    description: 'Provide public comment on the MTC Regional Housing Mandate. This meeting will discuss housing allocation strategies for the region.',
    attendees: 0,
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
];

interface AppState {
  user: UserConfig;
  events: CivicEvent[];
  organizations: Organization[];
  theme: 'light' | 'dark';
  login: (first: string, last: string, email: string) => void;
  logout: () => void;
  completeOnboarding: (topics: string[]) => void;
  toggleRsvp: (eventId: string) => void;
  addEvent: (event: CivicEvent) => void;
  updateUser: (data: Partial<UserConfig>) => void;
  toggleTheme: () => void;
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
        rsvps: ['1', '2'],
        status: 'Active now',
      },
      events: mockEvents,
      organizations: mockOrgs,
      theme: 'light',
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
            
          return { user: { ...state.user, rsvps: newRsvps } };
        }),
      addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'rallypoint-storage-v9',
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
