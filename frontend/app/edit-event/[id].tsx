import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native'
import { Link, useLocalSearchParams, router } from 'expo-router'

type EventMode = 'Online' | 'Offline' | 'Hybrid'
type EventType = 'Workshop' | 'Seminar' | 'Guest Lecture' | 'Industrial Visit' | 'Cultural' | 'Sports'

type Organizer = { parentOrganization: string; eventOrganizer: string }
type Contact = { name: string; role: string; phone: string }

type EventForm = {
  title: string
  description: string
  imageUrl: string
  eligibility: string
  date: string
  startTime: string
  endTime: string
  mode: EventMode | ''
  venue: string
  fee: string
  organizers: Organizer[]
  contacts: Contact[]
  registrationLink: string
  type: EventType
}

const EVENT_TYPES: EventType[] = ['Workshop', 'Seminar', 'Guest Lecture', 'Industrial Visit', 'Cultural', 'Sports']
const MODES: EventMode[] = ['Online', 'Offline', 'Hybrid']

export default function EditEvent() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [form, setForm] = useState<EventForm | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Ready for API: replace with GET /api/events/:id
    // const data = await fetchEventById(id)
    // setForm(mapper(data))
    setForm({
      title: 'College Fest 2024',
      description:
        'An annual inter-college festival featuring cultural events, competitions, and workshops. Open to all college students.',
      imageUrl: 'https://images.unsplash.com/photo-1469173479606-ada03df615ac?w=600&auto=format&fit=crop',
      eligibility: 'Open to all college students',
      date: '20-07-2024',
      startTime: '10:00 AM',
      endTime: '06:00 PM',
      mode: 'Offline',
      venue: 'College Auditorium, 123 University Ave,',
      fee: '500',
      organizers: [
        { parentOrganization: 'College Name', eventOrganizer: 'Student Council' },
        { parentOrganization: 'Department of Computer Science', eventOrganizer: 'Tech Club' },
      ],
      contacts: [
        { name: 'Aarav Sharma', role: 'Event Coordinator', phone: '+91 9876543210' },
        { name: 'Diya Patel', role: 'Logistics Head', phone: '+91 8765432109' },
        { name: 'Rohan Mehta', role: 'Sponsorship Lead', phone: '+91 7654321098' },
      ],
      registrationLink: 'https://www.collegefest.com/register',
      type: 'Cultural',
    })
  }, [id])

  const onChange = <K extends keyof EventForm>(key: K, value: EventForm[K]) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev))

  const isValid = useMemo(() => !!form && form.title.trim() && form.description.trim(), [form])

  function updateOrganizer(index: number, key: keyof Organizer, value: string) {
    setForm((prev) => {
      if (!prev) return prev
      const next = [...prev.organizers]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, organizers: next }
    })
  }
  function addOrganizer() {
    setForm((prev) => (prev ? { ...prev, organizers: [...prev.organizers, { parentOrganization: '', eventOrganizer: '' }] } : prev))
  }
  function removeOrganizer(index: number) {
    setForm((prev) => (prev ? { ...prev, organizers: prev.organizers.filter((_, i) => i !== index) } : prev))
  }

  function updateContact(index: number, key: keyof Contact, value: string) {
    setForm((prev) => {
      if (!prev) return prev
      const next = [...prev.contacts]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, contacts: next }
    })
  }
  function addContact() {
    setForm((prev) => (prev ? { ...prev, contacts: [...prev.contacts, { name: '', role: '', phone: '' }] } : prev))
  }
  function removeContact(index: number) {
    setForm((prev) => (prev ? { ...prev, contacts: prev.contacts.filter((_, i) => i !== index) } : prev))
  }

  async function onSave() {
    if (!form || !isValid) {
      Alert.alert('Missing fields', 'Please fill the required fields (Title, Description)')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form }
      // Ready for API: replace with PUT /api/events/:id
      // await updateEvent(id, payload)
      console.log('Would PUT /api/events/' + id, payload)
      Alert.alert('Ready for API', `This will call PUT /api/events/${id}`)
      router.replace('/publisherHome')
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <View style={styles.container}><Text>Loading...</Text></View>

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Edit Event</Text>
        <Link href="/publisherHome" style={styles.linkBack}>Back</Link>
      </View>

      {/* Event Title */}
      <Label text="Event Title" />
      <TextInput placeholder="Enter event title" style={styles.input} value={form.title} onChangeText={(t) => onChange('title', t)} />

      {/* Event Description */}
      <Label text="Event Description" />
      <TextInput
        placeholder="Enter event description"
        style={[styles.input, styles.textarea]}
        multiline
        value={form.description}
        onChangeText={(t) => onChange('description', t)}
      />

      {/* Event Thumbnail */}
      <Label text="Event Thumbnail" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {!!form.imageUrl && <Image source={{ uri: form.imageUrl }} style={styles.thumb} />}
        <Pressable style={styles.smallBtn} onPress={() => Alert.alert('Image', 'Replace with image picker')}>
          <Text style={styles.smallBtnText}>Change</Text>
        </Pressable>
      </View>

      {/* Eligibility */}
      <Label text="Eligibility" />
      <TextInput placeholder="e.g., Open to all college students" style={styles.input} value={form.eligibility} onChangeText={(t) => onChange('eligibility', t)} />

      {/* Date */}
      <Label text="Date" />
      <TextInput placeholder="dd-mm-yyyy" style={styles.input} value={form.date} onChangeText={(t) => onChange('date', t)} />

      {/* Times */}
      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <Label text="Start Time" />
          <TextInput placeholder="--:-- --" style={styles.input} value={form.startTime} onChangeText={(t) => onChange('startTime', t)} />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Label text="End Time" />
          <TextInput placeholder="--:-- --" style={styles.input} value={form.endTime} onChangeText={(t) => onChange('endTime', t)} />
        </View>
      </View>

      {/* Mode */}
      <Label text="Mode" />
      <View style={styles.pillRow}>
        {MODES.map((m) => (
          <Pressable key={m} style={[styles.pill, form.mode === m && styles.pillActive]} onPress={() => onChange('mode', m)}>
            <Text style={[styles.pillText, form.mode === m && styles.pillTextActive]}>{m}</Text>
          </Pressable>
        ))}
      </View>

      {/* Event Type */}
      <Label text="Event Type" />
      <View style={{ height: 4 }} />
      <View style={styles.typeRow}>
        {EVENT_TYPES.map((t) => (
          <Pressable key={t} style={[styles.typePill, form.type === t && styles.typePillActive]} onPress={() => onChange('type', t)}>
            <Text style={[styles.typePillText, form.type === t && styles.typePillTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Venue */}
      <Label text="Venue" />
      <TextInput placeholder="Enter venue" style={styles.input} value={form.venue} onChangeText={(t) => onChange('venue', t)} />

      {/* Entry Fee */}
      <Label text="Entry Fee (in ₹)" />
      <TextInput placeholder="Enter amount or 0 for free entry" keyboardType="numeric" style={styles.input} value={form.fee} onChangeText={(t) => onChange('fee', t)} />

      {/* Organizers */}
      <Label text="Organizers" />
      {form.organizers.map((org, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{`Organizer ${idx + 1}`}</Text>
            {form.organizers.length > 1 && (
              <Pressable onPress={() => removeOrganizer(idx)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            )}
          </View>
          <Label text="Parent Organization" />
          <TextInput
            placeholder="e.g., College Name"
            style={styles.input}
            value={org.parentOrganization}
            onChangeText={(t) => updateOrganizer(idx, 'parentOrganization', t)}
          />
          <Label text="Event Organizer" />
          <TextInput
            placeholder="e.g., Student Council"
            style={styles.input}
            value={org.eventOrganizer}
            onChangeText={(t) => updateOrganizer(idx, 'eventOrganizer', t)}
          />
        </View>
      ))}
      <Pressable style={styles.addBtn} onPress={addOrganizer}>
        <Text style={styles.addBtnText}>+ Add Organizer</Text>
      </Pressable>

      {/* Points of Contact */}
      <Label text="Points of Contact" />
      {form.contacts.map((c, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{`Contact ${idx + 1}`}</Text>
            {form.contacts.length > 1 && (
              <Pressable onPress={() => removeContact(idx)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            )}
          </View>
          <Label text="Name" />
          <TextInput placeholder="Enter name" style={styles.input} value={c.name} onChangeText={(t) => updateContact(idx, 'name', t)} />
          <Label text="Role" />
          <TextInput placeholder="e.g., Event Coordinator" style={styles.input} value={c.role} onChangeText={(t) => updateContact(idx, 'role', t)} />
          <Label text="Contact Number" />
          <TextInput placeholder="Enter contact number" keyboardType="phone-pad" style={styles.input} value={c.phone} onChangeText={(t) => updateContact(idx, 'phone', t)} />
        </View>
      ))}
      <Pressable style={styles.addBtn} onPress={addContact}>
        <Text style={styles.addBtnText}>+ Add Contact</Text>
      </Pressable>

      {/* Registration Link */}
      <Label text="Registration Link" />
      <TextInput placeholder="Enter registration link" style={styles.input} value={form.registrationLink} onChangeText={(t) => onChange('registrationLink', t)} />

      {/* Save CTA */}
      <Pressable disabled={saving || !isValid} onPress={onSave} style={[styles.saveBtn, (saving || !isValid) && { opacity: 0.6 }]}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  )
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '900', color: '#991b1b' },
  linkBack: { color: '#0ea5e9', fontWeight: '700' },
  label: { marginTop: 12, marginBottom: 6, color: '#334155', fontWeight: '700' },
  subtle: { color: '#64748b' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  textarea: { height: 120, textAlignVertical: 'top' },

  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#e2e8f0' },

  row2: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: '#e2e8f0' },
  pillActive: { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
  pillText: { color: '#334155' },
  pillTextActive: { color: '#991b1b', fontWeight: '800' },

  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontWeight: '900', color: '#991b1b' },
  removeText: { color: '#9b1c1c', fontWeight: '800' },

  addBtn: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: { color: '#0f172a', fontWeight: '800' },

  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  typePill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#e2e8f0' },
  typePillActive: { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
  typePillText: { color: '#334155' },
  typePillTextActive: { color: '#991b1b', fontWeight: '800' },

  smallBtn: { borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff' },
  smallBtnText: { color: '#0f172a', fontWeight: '800' },

  saveBtn: {
    marginTop: 16,
    backgroundColor: '#9e0202',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  saveText: { color: '#fff', fontWeight: '900' },
})


