import firebase from '../firebase.js'
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import PasswordStrengthChecker from 'react-native-password-strength-checker';
import { useDispatch } from 'react-redux'
import { signup } from '../actions'

/*
 * Code is loosely based on the following tutorials: 
 * https://reactnativemaster.com/react-native-login-screen-tutorial
 * https://heartbeat.fritz.ai/how-to-build-an-email-authentication-app-with-firebase-firestore-and-react-native-a18a8ba78574#cbbf
*/

//gives warning for navigation - this goes away if you uncomments the 'noImplicitAny' line from tsconfig
//unsure of other impacts of having that line, so uncommenting may be a bad idea

export default function SignUpScreen({  navigation  }) {
  const [emailState, setEmailState] = useState('')
  const [passwordState, setPasswordState] = useState({password: '', isValid: false})

  const goToSignIn = () => navigation.replace('SignInScreen')
  const dispatch = useDispatch()
  const handleSignUp = () => {
    if (passwordState.isValid) {
      firebase.auth()
        .createUserWithEmailAndPassword(emailState,passwordState.password)
        .then((response) => dispatch(signup(response.user)))
        .then(goToSignIn)
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
    }
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TES Verify</Text>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Email..." 
          placeholderTextColor="white"
          onChangeText={text => setEmailState(text)}/>
      </View>
      <View style={styles.inputView} >
        <Text>{"\n"}</Text>
        <PasswordStrengthChecker
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..." 
          placeholderTextColor="white"
          minLength={6}
          ruleNames="symbols|words"
          strengthLevels={strengthLevels}
          tooShort={tooShort}
          minLevel={2}
          barWidthPercent={65}
          showBarOnEmpty={true}
          barColor="#ccc"
          onChangeText={(text, valid) => setPasswordState({password: text, isValid: valid })}/>
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
        <Text style={styles.signUpText} >Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress = {goToSignIn}>
        <Text style={styles.returnToSignInText}>Return to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
  
}

// Define strength level list
const strengthLevels = [
  {
    label: 'Weak',
    labelColor: '#fff',
    widthPercent: '33',
    innerBarColor: '#fe6c6c'
  },
  {
    label: 'Weak',
    labelColor: '#fff',
    widthPercent: '33',
    innerBarColor: '#fe6c6c'
  },
  {
    label: 'Fair',
    labelColor: '#fff',
    widthPercent: '67',
    innerBarColor: '#feb466'
  },
  {
    label: 'Fair',
    labelColor: '#fff',
    widthPercent: '67',
    innerBarColor: '#feb466'
  },
  {
    label: 'Strong',
    labelColor: '#fff',
    widthPercent: '100',
    innerBarColor: '#6cfeb5'
  }
];

// Define too short object
const tooShort = {
  enabled: true,
  label: 'Too short',
  labelColor: 'red'
};

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
    color:"white",
    fontSize:11
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
  returnToSignInText:{
    color:"black"
  },
  signUpText:{
    color:"white",
    fontSize: 18,
    fontWeight: "bold"
  }
})