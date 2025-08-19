import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Icon from 'react-native-vector-icons/Ionicons'
import { useEffect, useMemo, useState } from 'react'
import { mockApi } from '../services/mockApi'
import { type EventItem, type SearchEvent } from '../data/events'

const EditEvent = () => {
  const params = useLocalSearchParams<{ id?: string }>()
  const [fetched, setFetched] = useState<(EventItem | SearchEvent) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (params.id) {
          const ev = await mockApi.getPublisherEventById(params.id)
          setFetched(ev)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  // Derived, with sensible fallbacks so UI remains intact
  // Define a proper interface for the event data
  interface EventData {
    title?: string
    description?: string
    date?: string
    time?: string
    type?: string
    category?: string
    venue?: string
    eligibility?: string
    fee?: string
    registrationLink?: string
    organizers?: Array<{ name: string; subtitle: string; icon: string }>
    creator?: { name: string; subtitle: string; icon: string }
    contacts?: Array<{ name: string; role: string; phone: string; icon: string }>
  }

  const eventData = useMemo(() => {
    const ev = fetched as any
    if (!ev) {
      return {
        title: 'Event',
        bannerTitle: 'Event',
        description: '',
        dateTime: '',
        venue: '',
        eligibility: '',
        eventType: 'Seminar',
        entryFee: '',
        registrationLink: '',
        organizers: [],
        creator: { name: '', subtitle: '', icon: 'person' },
        contacts: [],
      }
    }

    const date: string = ev?.date || ''
    const time: string = ev?.time || ev?.startTime || ''
    const dateTime = date && time ? `${date}, ${time}` : (date || time || '')

    return {
      title: ev?.title || 'Event',
      bannerTitle: ev?.title || 'Event',
      description: ev?.description || '',
      dateTime,
      venue: ev?.venue || '',
      eligibility: ev?.eligibility || '',
      eventType: ev?.type || ev?.category || ev?.eventType || 'Seminar',
      entryFee: ev?.fee || '',
      registrationLink: ev?.registrationLink || '',
      organizers: Array.isArray(ev?.organizers) ? ev.organizers : [],
      creator: ev?.creator || (ev?.publisher ? { name: ev.publisher.name || '', subtitle: ev.publisher.department || '', icon: 'person' } : { name: '', subtitle: '', icon: 'person' }),
      contacts: Array.isArray(ev?.contacts) ? ev.contacts : [],
    }
  }, [fetched])

  const handleEditEvent = () => {
    const id = (params.id as string) || (fetched as any)?.id || ''
    router.push({ pathname: '/(dashboard-publisher)/edit-event-form', params: { id } })
  }

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`)
  }

  const handleWhatsApp = (phone: string) => {
    Linking.openURL(`whatsapp://send?phone=${phone.replace(/\s/g, '')}`)
  }

  const handleRegistrationLink = () => {
    Linking.openURL(eventData.registrationLink)
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/(dashboard-publisher)/publisherHome')}>
              <Icon name="arrow-back" size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Event Details</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={{ padding: 16, color: '#64748b' }}>Loading...</Text>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(dashboard-publisher)/publisherHome')}>
            <Icon name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Event Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
            <Text style={styles.bannerTitle}>{eventData.bannerTitle}</Text>
            <Text style={styles.bannerSubtitle}>ORGANIZER</Text>
          </View>
          <View style={styles.bannerTriangle} />
        </View>
        {/* Event Title */}
        <Text style={styles.eventTitle}>{eventData.title}</Text>

        {/* Event Description */}
        <Text style={styles.description}>{eventData.description}</Text>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          <DetailItem icon="calendar" text={eventData.dateTime} />
          <DetailItem icon="location" text={eventData.venue} />
          <DetailItem icon="school" text={eventData.eligibility} />
          <DetailItem icon="pricetag" text={eventData.eventType} />
          <DetailItem icon="pricetag" text={eventData.entryFee} />
        </View>

        {/* Organizers */}
        <Section title="Organizers">
          {eventData.organizers.map((organizer: { name: string; subtitle: string; icon: string }, index: number) => (
            <ContactItem
              key={index}
              name={organizer.name}
              subtitle={organizer.subtitle}
              icon={organizer.icon}
            />
          ))}
        </Section>

        {/* Event Creator */}
        <Section title="Event Creator">
          <ContactItem
            name={eventData.creator.name}
            subtitle={eventData.creator.subtitle}
            icon={eventData.creator.icon}
          />
        </Section>

        {/* Point of Contact */}
        <Section title="Point of Contact">
          {eventData.contacts.map((contact: { name: string; role: string; phone: string; icon: string }, index: number) => (
            <View key={index} style={styles.contactContainer}>
              <ContactItem
                name={contact.name}
                subtitle={contact.role}
                icon={contact.icon}
              />
              <Text style={styles.phoneNumber}>{contact.phone}</Text>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCall(contact.phone)}
                >
                  <Icon name="call" size={16} color="#dc2626" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleWhatsApp(contact.phone)}
                >
                  <Icon name="logo-whatsapp" size={16} color="#16a34a" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Section>

        {/* Registration Link */}
        <Section title="Registration Link">
          <TouchableOpacity style={styles.linkContainer} onPress={handleRegistrationLink}>
            <Icon name="link" size={20} color="#64748b" />
            <Text style={styles.linkText}>{eventData.registrationLink}</Text>
          </TouchableOpacity>
        </Section>

        {/* Edit Event Button */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditEvent}>
          <Icon name="create" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const DetailItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.detailItem}>
    <Icon name={icon} size={20} color="#dc2626" />
    <Text style={styles.detailText}>{text}</Text>
  </View>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
)

const ContactItem = ({ name, subtitle, icon }: { name: string; subtitle: string; icon: string }) => (
  <View style={styles.contactItem}>
    <Icon name={icon} size={20} color="#64748b" />
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{name}</Text>
      <Text style={styles.contactSubtitle}>{subtitle}</Text>
    </View>
  </View>
)

export default EditEvent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  banner: {
    height: 200,
    backgroundColor: '#0f766e',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  bannerTriangle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderRightWidth: 0,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  detailsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfo: {
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  contactContainer: {
    marginBottom: 16,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 32,
    marginBottom: 8,
  },
  contactActions: {
    flexDirection: 'row',
    marginLeft: 32,
    gap: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  linkText: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline',
    marginLeft: 8,
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
})
