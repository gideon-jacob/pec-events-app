import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { router } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'


//Themed Components
import Spacer from "../../components/spacer"
import ThemedTextInput from "../../components/ThemedTextInput"


const Login = () => {
  const { signIn } = useAuth()

  const [registerNumber, setRegisterNumber] = useState('')
  const [password, setPassword] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    const usernameEmpty = registerNumber.trim().length === 0
    const passwordEmpty = password.trim().length === 0
    if (usernameEmpty || passwordEmpty) return

    // Demo logic: infer role; replace with real auth API
    const isPublisher = registerNumber.trim().toLowerCase().includes('publisher')
    await signIn({ role: isPublisher ? 'publisher' : 'user', registerNumber })
    // Send to the index route which will redirect based on role
    router.replace('/')
  }


  return (
    <View style={styles.container}>

    <Icon name="calendar-outline" size={100} color="#9e0202" />

    <Spacer/>

    <Text style={styles.title}>Prathyusha Events</Text>

    <Spacer height={10}/>

    <Text>Sign in to continue</Text>

    <Spacer height={40}/>
    
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

    <Pressable onPress={handleSubmit} style={({pressed}) => [styles.btn, pressed && styles.pressed] }>
      <Text style={styles.btnText}>Login</Text>
    </Pressable>

    <Spacer height={30}/>

    <Text style={{color:'#9e0202'}}> Forgot Password?</Text>

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
    pressed:{
      opacity: 0.7
    }
})