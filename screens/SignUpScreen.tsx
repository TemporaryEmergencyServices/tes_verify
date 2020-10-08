import firebase from '../firebase.js'
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


import { bindActionCreators } from 'redux';
import {Dispatch} from 'redux';
import { connect } from 'react-redux';
import { updateEmail, updatePassword, signup } from '../actions/user';
/*
 * Code is loosely based on the following tutorials: 
 * https://reactnativemaster.com/react-native-login-screen-tutorial
 * https://heartbeat.fritz.ai/how-to-build-an-email-authentication-app-with-firebase-firestore-and-react-native-a18a8ba78574#cbbf
*/

//gives warning for navigation - this goes away if you uncomments the 'noImplicitAny' line from tsconfig
//unsure of other impacts of having that line, so uncommenting may be a bad idea

function SignUpScreen( {  navigation  }) {
  

  
  const [emailState, setEmailState] = useState('')
  const [passwordState, setPasswordState] = useState('')

  const goToSignIn = () => navigation.replace('SignInScreen')

  const handleSignUp = () => {
     firebase.auth()
       .createUserWithEmailAndPassword(emailState,passwordState)   
    //for redux:
    //signup()
    //navigate!
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TES Verify</Text>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Email..." 
          placeholderTextColor="#003f5c"
          onChangeText={text => setEmailState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..." 
          placeholderTextColor="#003f5c"
          onChangeText={text => setPasswordState(text)}/>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
        <Text style={styles.loginText} >Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress = {goToSignIn}>
        <Text style={styles.loginText}>Return to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
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
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});


//Redux logic that doesn't work (probably because this is a function component and not a class component?)
const mapDispatchToProps = (dispatch: Dispatch)=>{
  return bindActionCreators({ updateEmail, updatePassword, signup }, dispatch);
}

const  mapStateToProps = (state: any) => {
  return {
      user: state.user
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);