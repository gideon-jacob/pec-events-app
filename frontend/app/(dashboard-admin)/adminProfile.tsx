import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAuth } from '../contexts/AuthContext'
import { router } from 'expo-router'

const AdminProfile = () => {
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.replace('/login')
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <Icon name="person" size={48} color="#94a3b8" />
      </View>
      <Text style={styles.name}>Admin</Text>
      <Text style={styles.sub}>Administrator Account</Text>

      <Pressable style={styles.action} onPress={handleLogout}>
        <Text style={styles.actionText}>Log Out</Text>
        <Icon name="exit-outline" size={18} color="#9e0202" />
      </Pressable>
    </View>
  )
}

export default AdminProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  sub: { marginTop: 6, color: '#64748b' },
  action: {
    width: '100%',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: { color: '#9e0202', fontWeight: '800' },
})