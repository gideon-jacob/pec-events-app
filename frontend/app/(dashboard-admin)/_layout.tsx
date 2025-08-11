import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAuth } from '../contexts/AuthContext'

const AdminDashBoardLayout = () => {
  const { state } = useAuth()

  if (state.status === 'loading') return null
  if (state.status === 'unauthenticated') return <Redirect href="/login" />
  if (state.status === 'authenticated' && state.user.role !== 'admin') {
    return <Redirect href="/studentHome" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: '#9e0202',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { height: 64, paddingBottom: 6, paddingTop: 6 },
        tabBarLabelStyle: { marginBottom: 0, fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="adminHome"
        options={{
          title: 'Home',
          headerTitle: 'Admin Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="adminProfile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default AdminDashBoardLayout


