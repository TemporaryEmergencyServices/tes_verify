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
 * https://heartbeat.fritz.ai/how-to-implement-forgot-password-feature-in-react-native-and-firebase-app-890b572d9759
 * */

//gives warning for navigation - this goes away if you uncomments the 'noImplicitAny' line from tsconfig
//unsure of other impacts of having that line, so uncommenting may be a bad idea
function ForgotPasswordScreen({  navigation  }) {
  const [emailState, setEmailState] = useState('')
  const goToSignIn = () => navigation.replace('SignInScreen')
  const handlePasswordReset = () => {
    firebase.auth()
      .sendPasswordResetEmail(emailState)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TES Verify</Text>
      <View style={styles.inputView} >
        <TextInput  
          autoCapitalize="none"
          style={styles.inputText}
          placeholder="Email..." 
          placeholderTextColor="white"
          onChangeText={text => setEmailState(text)}/>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handlePasswordReset}>
        <Text style={styles.signUpText} >Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress = {goToSignIn}>
        <Text style={styles.returnToSignInText}>Return to Sign In</Text>
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
)(ForgotPasswordScreen);
