import { homeEvents, searchEvents, type EventItem, type SearchEvent } from '../data/events'

// Simple in-memory mock API layer for future backend integration
// Replace these implementations with real HTTP calls when backend is ready.

export type PublisherEvent = {
  id: string
  title: string
  date?: string
  type: EventItem['type']
  imageUrl?: string
  status: 'upcoming' | 'ongoing' | 'past'
  description?: string
  venue?: string
  fee?: string
}

export type UserProfile = {
  name: string
  role: string
  department: string
  email?: string
}

export type UpsertEventPayload = {
  title: string
  description: string
  imageUrl?: string
  eligibility?: string
  date?: string
  startTime?: string
  endTime?: string
  mode?: 'Online' | 'Offline' | 'Hybrid' | ''
  venue?: string
  fee?: string
  organizers?: { parentOrganization: string; eventOrganizer: string }[]
  contacts?: { name: string; role: string; phone: string }[]
  registrationLink?: string
  type: EventItem['type']
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function genId(prefix = 'e'): string {
  const rnd = Math.random().toString(36).slice(2, 8)
  return `${prefix}${Date.now().toString(36)}${rnd}`
}

export const mockApi = {
  async fetchUserProfile(): Promise<UserProfile> {
    await delay(300)
    return {
      name: 'Publisher',
      role: 'Publisher',
      department: 'Department of CSE',
      email: 'prathyusha@college.edu',
    }
  },

  /*
  async fetchUserProfile() {
  const { data } = await api.get('/publisher/profile');
  return data;
  } */

  async fetchPublisherEvents(status: 'upcoming' | 'ongoing' | 'past'): Promise<PublisherEvent[]> {
    await delay(250)
    // Derive a small set from searchEvents for demo purposes with pseudo status
    const derived: PublisherEvent[] = searchEvents.slice(0, 8).map((e, idx) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      type: e.category,
      imageUrl: e.image?.uri,
      status: idx % 3 === 0 ? 'past' : idx % 3 === 1 ? 'upcoming' : 'ongoing',
      description: e.description,
      venue: e.venue,
      fee: e.fee,
    }))

    return derived.filter((ev) => ev.status === status)
  },

  /*
  async fetchPublisherEvents(status: 'upcoming' | 'ongoing' | 'past') {
  const { data } = await api.get('/publisher/events', { params: { status } });
  return data;
  } */

  async deleteEvent(eventId: string): Promise<boolean> {
    await delay(250)
    const idxSearch = searchEvents.findIndex((e) => e.id === eventId)
    if (idxSearch >= 0) searchEvents.splice(idxSearch, 1)

    const normalized = eventId.startsWith('h') ? eventId.slice(1) : eventId
    const idxHome = homeEvents.findIndex((e) => e.id === normalized)
    if (idxHome >= 0) homeEvents.splice(idxHome, 1)
    return true
  },

  /*
  async deleteEvent(eventId: string): Promise<boolean> {
  const { status } = await api.delete(`/events/${eventId}`);
  return status >= 200 && status < 300;
  } */

  async listSearchEvents(): Promise<SearchEvent[]> {
    await delay(200)
    return searchEvents
  },

  /*{Example for using API}

  async listSearchEvents(): Promise<SearchEvent[]> {
  const { data } = await api.get('/events/search');
  return data; // map if backend shape differs
  } */

  async listHomeEvents(): Promise<EventItem[]> {
    await delay(200)
    return homeEvents
  },

  /*
  async listHomeEvents(): Promise<EventItem[]> {
  const { data } = await api.get('/events/home');
  return data;
  } */

  async getEventById(id: string): Promise<(EventItem | SearchEvent) | null> {
    await delay(150)
    const fromSearch = searchEvents.find((e) => e.id === id)
    if (fromSearch) return fromSearch
    const normalized = id.startsWith('h') ? id.slice(1) : id
    return homeEvents.find((e) => e.id === normalized) ?? null
  },

  /*
  async getEventById(id: string): Promise<(EventItem | SearchEvent) | null> {
  const { data } = await api.get(`/events/${id}`);
  return data ?? null;
  } */

  async createEvent(payload: UpsertEventPayload): Promise<{ id: string }> {
    await delay(350)
    const id = genId('e')
    const newSearchEvent: SearchEvent = {
      id,
      title: payload.title,
      description: payload.description,
      category: payload.type,
      department: 'CSE',
      image: payload.imageUrl ? { uri: payload.imageUrl } : undefined,
      date: payload.date,
      time: payload.startTime,
      venue: payload.venue,
      eligibility: payload.eligibility,
      fee: payload.fee,
      registrationLink: payload.registrationLink,
      organizers: payload.organizers?.map((o) => ({ name: o.eventOrganizer, subtitle: o.parentOrganization, icon: 'people' })),
      creator: { name: 'Publisher User', subtitle: 'CSE Department', icon: 'person' },
      contacts: payload.contacts?.map((c) => ({ ...c, icon: 'person' })),
    }
    searchEvents.unshift(newSearchEvent)
    return { id }
  },

  /*
  async createEvent(payload: UpsertEventPayload): Promise<{ id: string }> {
  const body = {
    title: payload.title,
    description: payload.description,
    type: payload.type,
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime,
    mode: payload.mode,
    venue: payload.venue,
    fee: payload.fee,
    organizers: payload.organizers,
    contacts: payload.contacts,
    registrationLink: payload.registrationLink,
    imageUrl: payload.imageUrl,
  };
  const { data } = await api.post('/events', body);
  return { id: data.id };
  } */

  async updateEvent(id: string, payload: UpsertEventPayload): Promise<boolean> {
    await delay(350)
    const sIdx = searchEvents.findIndex((e) => e.id === id)
    if (sIdx >= 0) {
      const curr = searchEvents[sIdx]
      searchEvents[sIdx] = {
        ...curr,
        title: payload.title || curr.title,
        description: payload.description || curr.description,
        category: payload.type || curr.category,
        image: payload.imageUrl ? { uri: payload.imageUrl } : curr.image,
        date: payload.date ?? curr.date,
        time: payload.startTime ?? curr.time,
        venue: payload.venue ?? curr.venue,
        eligibility: payload.eligibility ?? curr.eligibility,
        fee: payload.fee ?? curr.fee,
        registrationLink: payload.registrationLink ?? curr.registrationLink,
        organizers: payload.organizers
          ? payload.organizers.map((o) => ({ name: o.eventOrganizer, subtitle: o.parentOrganization, icon: 'people' }))
          : curr.organizers,
        contacts: payload.contacts
          ? payload.contacts.map((c) => ({ ...c, icon: 'person' }))
          : curr.contacts,
      }
    }

    const normalized = id.startsWith('h') ? id.slice(1) : id
    const hIdx = homeEvents.findIndex((e) => e.id === normalized)
    if (hIdx >= 0) {
      const curr = homeEvents[hIdx]
      homeEvents[hIdx] = {
        ...curr,
        title: payload.title || curr.title,
        description: payload.description || curr.description,
        type: payload.type || curr.type,
        image: payload.imageUrl ? { uri: payload.imageUrl } : curr.image,
        date: payload.date ?? curr.date,
        time: payload.startTime ?? curr.time,
        venue: payload.venue ?? curr.venue,
        eligibility: payload.eligibility ?? curr.eligibility,
        fee: payload.fee ?? curr.fee,
        registrationLink: payload.registrationLink ?? curr.registrationLink,
        organizers: payload.organizers
          ? payload.organizers.map((o) => ({ name: o.eventOrganizer, subtitle: o.parentOrganization, icon: 'people' }))
          : curr.organizers,
        creator: curr.creator ?? { name: 'Publisher User', subtitle: 'CSE Department', icon: 'person' },
        contacts: payload.contacts
          ? payload.contacts.map((c) => ({ ...c, icon: 'person' }))
          : curr.contacts,
      }
    }

    return true
  },

  /*
  async updateEvent(id: string, payload: UpsertEventPayload): Promise<boolean> {
  const { status } = await api.put(`/events/${id}`, payload);
  return status >= 200 && status < 300;
  } */
}

export default mockApi


