import firebase from '../firebase.js'
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import Navigation from '../navigation/index.js';
import SignUpScreen from '../screens/SignUpScreen'
import ForgotPassword from '../screens/ForgotPasswordScreen'

import { login } from '../actions'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

/*
 * Code is loosely based on the following tutorials: 
 * https://reactnativemaster.com/react-native-login-screen-tutorial
 * https://heartbeat.fritz.ai/how-to-build-an-email-authentication-app-with-firebase-firestore-and-react-native-a18a8ba78574#cbbf
*/

//gives warning for navigation - this goes away if you uncomments the 'noImplicitAny' line from tsconfig
//unsure of other impacts of having that line, so uncommenting may be a bad idea
export default function SignInScreen({ navigation }) {
  const dispatch = useDispatch()
  const [emailState, setEmailState] = useState('')
  const [passwordState, setPasswordState] = useState('')

  const handleLogin = () => {
    firebase.auth()
      .signInWithEmailAndPassword(emailState.toLowerCase(),passwordState)
      .then((response) => {
        firebase.firestore()
        .collection('roles')
        .where('username' , '==', response.user.email)
        .limit(1)
        .onSnapshot(querySnapshot => {
          if (!querySnapshot.empty) {
            const queryDocumentSnapshot = querySnapshot.docs[0];
            const queryDocumentSnapshotData = queryDocumentSnapshot.data()
            dispatch(login(queryDocumentSnapshotData))
            goToMainBody(queryDocumentSnapshotData.role)
          }
        })
      })
      .catch(error => {
        Alert.alert(
          "Error",
          error.message,
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      })
  }

  const goToSignUp = () => navigation.replace('SignUpScreen')
  const goToForgotPassword = () => navigation.replace('ForgotPasswordScreen')
  const goToMainBody = (role) => {
    console.log('role', role)
    if (role == "superuser") {
      console.log('user', role)
      navigation.replace('SuperuserBottomTabNavigator')
    } else if (role == "administrator") {
      navigation.replace('ManagerBottomTabNavigator')
    } else if (role == "volunteer") {
      navigation.replace('BottomTabNavigator')
    } else if (role == "display_qr") {
      navigation.replace('DisplayQRScreen')
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TES Verify</Text>
      <View style={styles.inputView} >
        <TextInput  
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.inputText}
          placeholder="Email..." 
          placeholderTextColor="white"
          onChangeText={text => setEmailState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          keyboardType="visible-password"
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..." 
          placeholderTextColor="white"
          value={passwordState}
          onChangeText={text => setPasswordState(text)}/>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createAccountBtn} onPress = {goToSignUp}>
        <Text style={styles.loginText}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgot} onPress={goToForgotPassword}>
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#1C5A7D",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#2B2E32",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"black",
    fontSize:11,
    width:"80%",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#E11383",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  createAccountBtn:{
    width:"80%",
    backgroundColor:"#E11383",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10
  },
  loginText:{
    color:"white",
    fontSize: 18,
    fontWeight: "bold"
  }
});