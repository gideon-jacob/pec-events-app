import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TestRefComponent from './test-ref'
import { Link } from 'expo-router'

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PEC Event App</Text>
      <Text style={styles.subtitle}>React 19 + React Native 0.79.5</Text>

      <Link href="/login">Login Page</Link>

      <TestRefComponent />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    }
})