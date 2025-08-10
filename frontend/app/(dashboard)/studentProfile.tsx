import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const StudentProfile = () => {
  const handleChangePassword = () => {
    // TODO: navigate to change password
    console.log('Change password pressed')
  }

  const handleLogout = () => {
    // TODO: clear auth state and navigate to login
    console.log('Logout pressed')
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Icon name="person" size={48} color="#94a3b8" />
      </View>

      {/* Name + Reg no */}
      <Text style={styles.name}>Asta Staria</Text>
      <Text style={styles.reg}>Registration Number: 11142301AS04019</Text>

      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>Asta Staria</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>asta-staria@gmail.com</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Department</Text>
        <Text style={styles.value}>Computer Science and Engineering</Text>
      </View>

      {/* Actions */}
      <Pressable style={styles.action} onPress={handleChangePassword}>
        <Text style={styles.actionText}>Change Password</Text>
        <Icon name="chevron-forward" size={18} color="#9e0202" />
      </Pressable>

      <Pressable style={styles.action} onPress={handleLogout}>
        <Text style={styles.actionText}>Log Out</Text>
        <Icon name="exit-outline" size={18} color="#9e0202" />
      </Pressable>
    </View>
  )
}

export default StudentProfile

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
  reg: { marginTop: 6, color: '#64748b' },
  card: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  label: { color: '#64748b', fontWeight: '700', marginBottom: 4 },
  value: { color: '#0f172a', fontWeight: '800', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 6 },
  action: {
    width: '100%',
    marginTop: 14,
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
