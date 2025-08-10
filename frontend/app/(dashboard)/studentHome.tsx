import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { router } from 'expo-router'


type EventItem = {
  id: string
  type: 'Workshop' | 'Seminar' | 'Guest Lecture' | 'Industrial Visit'
  title: string
  date: string
  time: string
  description: string
  venue: string
  eligibility: string
  fee: string
  image?: any
}

const events: EventItem[] = [
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
    image: { uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjvZqYTVAjPzmJrgLSsJAb8mI8vny87DqpoQ&s'}
  },
]

const getIconNameForType = (type: EventItem['type']): string => {
  switch (type) {
    case 'Workshop':
      return 'construct-outline'
    case 'Seminar':
      return 'school-outline'
    case 'Guest Lecture':
      return 'mic-outline'
    case 'Industrial Visit':
      return 'bus-outline'
    default:
      return 'information-circle-outline'
  }
}

const Badge = ({ label, type }: { label: string; type: EventItem['type'] }) => (
  <View style={styles.badge}>
    <Icon name={getIconNameForType(type)} color="#fff" size={14} />
    <Text style={styles.badgeText}>{label}</Text>
  </View>
)

const EventCard = ({ item }: { item: EventItem }) => (
  <Pressable style={styles.card} onPress={() => {
    router.push({
      pathname: '../eventDetail',
      params: {
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        time: item.time,
        type: item.type,
        venue: item.venue,
        eligibility: item.eligibility,
        fee: item.fee,
        imageUrl: item.image?.uri,
      }
    })
  }}>
    {item.image ? (
      <Image source={item.image} style={styles.cover} resizeMode="cover" />
    ) : (
      <View style={[styles.cover, styles.coverPlaceholder]}>
        <Icon name="image-outline" size={28} color="#94a3b8" />
      </View>
    )}
    <View style={styles.badgeContainer}>
      <Badge label={item.type} type={item.type} />
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubTitle}>
        {item.date} · {item.time}
      </Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </View>
  </Pressable>
)

const StudentHome = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
      </View>
      {events.map((e) => (
        <EventCard key={e.id} item={e} />
      ))}
    </ScrollView>
  )
}

export default StudentHome

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cover: {
    width: '100%',
    height: 150,
  },
  coverPlaceholder: {
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#475569',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardSubTitle: {
    color: '#475569',
    marginTop: 4,
    marginBottom: 8,
    fontWeight: '600',
  },
  cardDesc: {
    color: '#334155',
    lineHeight: 20,
  },
})
