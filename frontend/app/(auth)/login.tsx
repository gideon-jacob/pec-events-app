import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { router } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApiBaseUrl } from '../../src/config/api'


//Themed Components
import Spacer from "../../components/spacer"
import ThemedTextInput from "../../components/ThemedTextInput"


const Login = () => {
  const { signIn } = useAuth()

  const [registerNumber, setRegisterNumber] = useState('')
  const [password, setPassword] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Using centralized API configuration from src/config/api

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    setAuthError(null)
    const usernameEmpty = registerNumber.trim().length === 0
    const passwordEmpty = password.trim().length === 0
    if (usernameEmpty || passwordEmpty) return

    try {
      setLoading(true)
      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerNumber.trim(), password: password.trim() })
      })

      if (!response.ok) {
        let message = 'Invalid credentials'
        try {
          const errJson = await response.json()
          if (errJson?.error) message = String(errJson.error)
        } catch {}
        throw new Error(message)
      }

      type LoginResponse = {
        success: boolean
        token: string
        userRole: string
        message?: string
      }

      const data: LoginResponse = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Invalid credentials')
      }

      const mappedRole = data.userRole === 'publisher' ? 'publisher' : 'user'

      if (mappedRole === 'publisher' && data.token) {
        try {
          await AsyncStorage.setItem('auth:publisher:jwt', data.token)
        } catch (e) {
          console.warn('Failed to persist publisher JWT token', e)
        }
      }

      await signIn({
        role: mappedRole,
        registerNumber: registerNumber.trim(),
      })
      router.replace('/')
    } catch (err: any) {
      console.error('Login error:', err)
      setAuthError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    try {
      setLoading(true)
      await signIn({
        role: 'user',
        name: 'Guest User',
      })
      router.replace('/')
    } catch (err: any) {
      console.error('Guest login error:', err)
      setAuthError(err?.message || 'Guest login failed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <View style={styles.container}>

    <Icon name="calendar-outline" size={100} color="#9e0202" />

    <Spacer/>

    <Text style={styles.title}>Prathyusha Events</Text>

    <Spacer height={10}/>

    <Text>Sign in to continue</Text>

    <Spacer height={40}/>
    {authError ? (
      <View style={styles.errorRow}>
        <Icon name="information-circle" size={16} color="#9e0202" />
        <Text style={styles.errorText}>{authError}</Text>
      </View>
    ) : null}
    
    <View style={styles.inputContainer}>
      <Icon name='person' size={20} style={[{marginHorizontal: 10}, {color: '#65758c'}]}/>
      <ThemedTextInput placeholder="Username" placeholderTextColor={'#65758c'} style={{width:"80%"}}
      onChangeText={setRegisterNumber} value={registerNumber}/>
    </View>
    {submitAttempted && registerNumber.trim().length === 0 ? (
      <View style={styles.errorRow}>
        <Icon name="information-circle" size={16} color="#9e0202" />
        <Text style={styles.errorText}>Username is required</Text>
      </View>
    ) : null}

    <Spacer height={20}/>

    <View style={styles.inputContainer}>
      <FontAwesome name='lock' size={20} style={[{marginHorizontal: 10}, {color: '#65758c'}]}/>
      <ThemedTextInput placeholder="Password" placeholderTextColor={'#65758c'} style={{width:"80%"}}
      onChangeText={setPassword} value={password} secureTextEntry/>
    </View>
    {submitAttempted && password.trim().length === 0 ? (
      <View style={styles.errorRow}>
        <Icon name="information-circle" size={16} color="#9e0202" />
        <Text style={styles.errorText}>Password is required</Text>
      </View>
    ) : null}

    <Spacer height={40}/>

    <Pressable disabled={loading} onPress={handleSubmit} style={({pressed}) => [styles.btn, pressed && styles.pressed, loading && styles.btnDisabled] }>
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.btnText}>Login</Text>
      )}
    </Pressable>

    <Spacer height={20}/>

    <Pressable disabled={loading} onPress={handleGuestLogin} style={({pressed}) => [styles.guestBtn, pressed && styles.pressed, loading && styles.btnDisabled] }>
      {loading ? (
        <ActivityIndicator color="#9e0202" />
      ) : (
        <Text style={styles.guestBtnText}>Continue as Guest</Text>
      )}
    </Pressable>

    <Spacer height={30}/>

    {/* <Text style={{color:'#9e0202'}}> Forgot Password?</Text> */}

    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
      marginTop: 6,
      gap: 6,
    },
    errorText: {
      color: '#9e0202',
      fontSize: 12,
      fontWeight: '600',
    },

    inputContainer:{
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor:"#e6e6e6",
      color: "black",
      padding: 10,
      borderRadius: 10,
      width: '80%'
    },

    title: {
        fontWeight: "bold",
        fontSize: 28,
    },
    btnText:{
      textAlign:"center",
      fontWeight:"bold",
      color: '#ffffff'
    },
    btn:{
      backgroundColor: '#9e0202',
      width: '80%',
      borderRadius: 10,
      padding: 15,
    },
    btnDisabled:{
      opacity: 0.6
    },
    pressed:{
      opacity: 0.7
    },
    guestBtn:{
      backgroundColor: '#e6e6e6',
      width: '80%',
      borderRadius: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: '#65758c',
    },
    guestBtnText:{
      textAlign:"center",
      fontWeight:"bold",
      color: '#65758c'
    }
})