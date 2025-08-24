import React from 'react'
import { Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/Ionicons'

const EventDetailsLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen
        name="eventDetail"
        options={({ navigation }) => ({
          href: null,
          title: 'Event Details',
          headerShown: true,
          headerTitleAlign: 'center',
          tabBarButton: () => null,
          headerLeft: () => (
            <Icon
              name="chevron-back"
              size={22}
              color="#0f172a"
              style={{ marginLeft: 12 }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Tabs>
  )
}

export default EventDetailsLayout