import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const PublisherHome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publisher Dashboard</Text>
      <View style={styles.row}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/(dashboard-publisher)/create-event')}>
          <Text style={styles.primaryText}>Create Event</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/edit-event')}>
          <Text style={styles.secondaryText}>Edit Event</Text>
        </Pressable>
      </View>
      <Text style={styles.subtle}>Pages are wired and ready for API integration.</Text>
    </View>
  )
}

export default PublisherHome

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: '900', color: '#991b1b', marginBottom: 14 },
    row: { flexDirection: 'row', gap: 12 },
    primaryBtn: { backgroundColor: '#9e0202', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 18 },
    primaryText: { color: '#fff', fontWeight: '900' },
    secondaryBtn: { backgroundColor: '#fee2e2', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 18 },
    secondaryText: { color: '#991b1b', fontWeight: '900' },
    subtle: { marginTop: 12, color: '#64748b' }
})


