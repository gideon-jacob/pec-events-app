export type EventItem = {
  id: string
  type: 'Workshop' | 'Seminar' | 'Guest Lecture' | 'Industrial Visit' | 'Cultural' | 'Sports'
  title: string
  date?: string
  time?: string
  description: string
  venue?: string
  eligibility?: string
  fee?: string
  image?: { uri: string }
}

// Source of truth for Student Home events
export const homeEvents: EventItem[] = [
  {
    id: '1',
    type: 'Workshop',
    title: 'AI & Machine Learning',
    date: 'Aug 05, 2024',
    time: '9:00 AM',
    venue: 'Microsoft Lab',
    eligibility: 'All',
    fee: 'Free',
    description:
      'Hands-on workshop on the fundamentals of AI and Machine Learning. Register now!',
    image: { uri: 'https://aiml.events/media/CACHE/images/image/d5/dc/d5dc86c7ec324d1c94f38e2b23673ca0/f9ad0ca478d0e37368318bf638c155d9.jpg' },
  },
  {
    id: '2',
    type: 'Seminar',
    title: 'Future of Blockchain',
    date: 'Aug 12, 2024',
    time: '2:00 PM',
    venue: 'Seminar Hall',
    eligibility: 'CyberSecurity',
    fee: 'Free',
    description:
      'An insightful seminar on the impact and future of blockchain technology across industries.',
    image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn_AL1vlSWkCOi__gJWjaR5QOUKVcvYCXqh3cLMYRDIUfqpTE_6ALXnf7YvAW-Wihb7V4&usqp=CAU' },
  },
  {
    id: '3',
    type: 'Guest Lecture',
    title: 'Entrepreneurship Talk',
    date: 'Aug 20, 2024',
    time: '11:00 AM',
    venue: 'Seminar Hall',
    eligibility: 'All',
    fee: 'Free',
    description:
      'Listen to the journey of a successful entrepreneur and get inspired. Q&A session included.',
    image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMSwJRS_XHaPYH9TaQOAvE58qH6UK_3hsDyg&s' },
  },
  {
    id: '4',
    type: 'Industrial Visit',
    title: 'Visit to Tech Park',
    date: 'Aug 28, 2024',
    time: '10:00 AM',
    venue: 'Ground',
    eligibility: 'Computer Science',
    fee: '2000',
    description:
      'An exciting industrial visit to a leading tech park to witness innovation in action.',
    image: { uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjvZqYTVAjPzmJrgLSsJAb8mI8vny87DqpoQ&s'},
  },
]

export type SearchEvent = {
  id: string
  title: string
  description: string
  category: EventItem['type']
  department: 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'EEE'
  image?: { uri: string }
  // Optional details for eventDetail page
  date?: string
  time?: string
  venue?: string
  eligibility?: string
  fee?: string
}

// Existing search-only events
const extraSearchEvents: SearchEvent[] = [
  {
    id: 'e1',
    title: 'AI & Machine Learning Workshop',
    description: 'Learn the basics of AI and machine learning in this hands-on session.',
    category: 'Workshop',
    department: 'CSE',
    image: { uri: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop' },
  },
  {
    id: 'e2',
    title: 'Photography Exhibition',
    description: 'Showcase your best shots and view stunning photography from peers.',
    category: 'Cultural',
    department: 'CIVIL',
    image: { uri: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop' },
  },
  {
    id: 'e3',
    title: 'Inter–College Basketball Tournament',
    description: 'Cheer on your team or participate in this exciting basketball tournament.',
    category: 'Sports',
    department: 'MECH',
    image: { uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
  },
]

// Convert home events into SearchEvent entries so Student Home events appear in Search
const mappedHomeToSearch: SearchEvent[] = homeEvents.map((e, idx) => ({
  id: `h${e.id}`,
  title: e.title,
  description: e.description,
  category: e.type,
  department: 'CSE',
  image: e.image,
  date: e.date,
  time: e.time,
  venue: e.venue,
  eligibility: e.eligibility,
  fee: e.fee,
}))

export const searchEvents: SearchEvent[] = [...mappedHomeToSearch, ...extraSearchEvents]


