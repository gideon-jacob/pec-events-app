import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { Link, router } from 'expo-router'

export default function EditEventEntry() {
  const [eventId, setEventId] = useState('')

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Edit Event</Text>
        <Link href="/publisherHome" style={styles.linkBack}>Back</Link>
      </View>
      <TextInput
        placeholder="Enter Event ID"
        value={eventId}
        onChangeText={setEventId}
        style={styles.input}
      />
      <Pressable
        style={[styles.goBtn, !eventId && { opacity: 0.5 }]}
        disabled={!eventId}
        onPress={() => router.push(`/edit-event/${eventId}`)}
      >
        <Text style={styles.goText}>Go</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '900', color: '#991b1b', marginBottom: 8 },
  linkBack: { color: '#0ea5e9', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  goBtn: { backgroundColor: '#9e0202', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  goText: { color: '#fff', fontWeight: '900' },
})


