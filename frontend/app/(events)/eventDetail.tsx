import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useLocalSearchParams } from 'expo-router'

type Params = {
  id?: string
  title?: string
  description?: string
  date?: string
  time?: string
  venue?: string
  type?: string
  eligibility?: string
  fee?: string
  imageUrl?: string
}

const LabelRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrap}>
      <Icon name={icon} size={18} color="#b91c1c" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
)

export default function EventDetail() {
  const params = useLocalSearchParams<Params>()

  const coverSrc = params.imageUrl
    ? { uri: params.imageUrl }
    : { uri: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600&auto=format&fit=crop' }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cover */}
      <Image source={coverSrc} style={styles.cover} />

      {/* Title + Description */}
      <Text style={styles.title}>{params.title || 'Event Title'}</Text>
      <Text style={styles.description}>
        {params.description ||
          'Join us for an insightful session covering key strategies and tools to help you succeed. Whether you are a student or an aspiring professional, this event is for you.'}
      </Text>

      {/* Info list */}
      <LabelRow icon="calendar-outline" label="Date & Time" value={`${params.date || 'July 20, 2024'}, ${params.time || '10:00 AM – 1:00 PM'}`} />
      <LabelRow icon="location-outline" label="Venue" value={params.venue || 'College Auditorium (Offline)'} />
      <LabelRow icon="people-outline" label="Eligibility" value={params.eligibility || 'Open to all students'} />
      <LabelRow icon="pricetag-outline" label="Event Type" value={params.type || 'Seminar'} />
      <LabelRow icon="cash-outline" label="Entry Fee" value={params.fee || 'Free'} />

      {/* Organizers */}
      <Text style={styles.sectionTitle}>Organizers</Text>
      <View style={styles.orgRow}>
        <View style={styles.orgAvatar}><Icon name="business-outline" size={18} color="#94a3b8" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orgName}>Prathyusha Engineering College</Text>
          <Text style={styles.orgSub}>Department of Computer Science</Text>
        </View>
      </View>
      <View style={styles.orgRow}>
        <View style={styles.orgAvatar}><Icon name="people-circle-outline" size={18} color="#94a3b8" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orgName}>Entrepreneurship Cell</Text>
          <Text style={styles.orgSub}>In association with IIC</Text>
        </View>
      </View>

      {/* Point of Contact */}
      <Text style={styles.sectionTitle}>Point of Contact</Text>
      <View style={styles.pocCard}>
        <View style={styles.pocLeft}>
          <View style={styles.pocAvatar}><Icon name="person" size={18} color="#94a3b8" /></View>
          <View>
            <Text style={styles.pocName}>Rohan Sharma</Text>
            <Text style={styles.pocRole}>Student Coordinator</Text>
            <Text style={styles.pocPhone}>+91 98765 43210</Text>
          </View>
        </View>
        <View style={styles.pocActions}>
          <View style={styles.circleBtn}><Icon name="call" size={16} color="#0f172a" /></View>
          <View style={[styles.circleBtn, styles.circleBtnGreen]}><Icon name="logo-whatsapp" size={16} color="#16a34a" /></View>
        </View>
      </View>
      <View style={styles.pocCard}>
        <View style={styles.pocLeft}>
          <View style={styles.pocAvatar}><Icon name="person" size={18} color="#94a3b8" /></View>
          <View>
            <Text style={styles.pocName}>Priya Singh</Text>
            <Text style={styles.pocRole}>Faculty Coordinator</Text>
            <Text style={styles.pocPhone}>+91 98765 43211</Text>
          </View>
        </View>
        <View style={styles.pocActions}>
          <View style={styles.circleBtn}><Icon name="call" size={16} color="#0f172a" /></View>
          <View style={[styles.circleBtn, styles.circleBtnGreen]}><Icon name="logo-whatsapp" size={16} color="#16a34a" /></View>
        </View>
      </View>

      {/* Interest CTA */}
      <Text style={styles.sectionTitleCentered}>Are you interested?</Text>
      <View style={styles.interestRow}>
        <Pressable style={[styles.interestBtn, styles.interestYes]}><Text style={styles.interestYesText}>Yes</Text></Pressable>
        <Pressable style={[styles.interestBtn, styles.interestNo]}><Text style={styles.interestNoText}>No</Text></Pressable>
      </View>

      {/* Register CTA */}
      <Pressable style={styles.registerBtn}>
        <Text style={styles.registerText}>Register Now</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { paddingBottom: 28, backgroundColor: '#ffffff' },
  cover: { height: 170, width: '100%', backgroundColor: '#e2e8f0' },
  title: { fontSize: 22, fontWeight: '900', color: '#991b1b', paddingHorizontal: 12, marginTop: 12 },
  description: { color: '#475569', paddingHorizontal: 12, marginTop: 8, lineHeight: 20 },

  infoRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center', gap: 12 },
  infoIconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: '#64748b', fontWeight: '700' },
  infoValue: { color: '#0f172a', fontWeight: '700' },

  sectionTitle: { paddingHorizontal: 12, marginTop: 12, fontWeight: '900', color: '#991b1b' },
  orgRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 10 },
  orgAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  orgName: { fontWeight: '800', color: '#0f172a' },
  orgSub: { color: '#64748b' },

  pocCard: {
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pocLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pocAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  pocName: { fontWeight: '800', color: '#0f172a' },
  pocRole: { color: '#64748b' },
  pocPhone: { color: '#64748b' },
  pocActions: { flexDirection: 'row', gap: 10 },
  circleBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  circleBtnGreen: { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' },

  sectionTitleCentered: { textAlign: 'center', marginTop: 16, fontWeight: '900', color: '#991b1b' },
  interestRow: { flexDirection: 'row', gap: 14, paddingHorizontal: 12, marginTop: 10 },
  interestBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  interestYes: { backgroundColor: '#e7f6ea', borderColor: '#c7f0d1' },
  interestNo: { backgroundColor: '#fde7e7', borderColor: '#f5c2c2' },
  interestYesText: { color: '#166534', fontWeight: '800' },
  interestNoText: { color: '#9b1c1c', fontWeight: '800' },

  registerBtn: { marginHorizontal: 12, marginTop: 18, backgroundColor: '#9e0202', borderRadius: 12, paddingVertical: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  registerText: { color: '#fff', fontWeight: '900' },
})


