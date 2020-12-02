import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native';

import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';

export default function QueryClockScreen({ navigation }) {

  const [startDateState,setStartDateState] = useState('')
  const [stopDateState,setStopDateState] = useState('')
  const [userIdState,setUserIdState] = useState('')
  const [ethnicityState, setEthnicityState] = useState('')
  const [sexState, setSexState] = useState('')
  const [firstNameState, setFirstNameState] = useState('')
  const [lastNameState, setLastNameState] = useState('')

  const handleSearch = () => {
    Alert.alert(
        'HELLO',
        'HELLO:)',
         [
           {text: 'OK', onPress: () => {console.log('OK Pressed'); }},
         ],
         {cancelable: false},
       );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Search for records by name, userid, gender, ethnicity, and/or date.</Text>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="First Name" 
          placeholderTextColor="white"
          onChangeText={text => setFirstNameState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Last Name" 
          placeholderTextColor="white"
          onChangeText={text => setLastNameState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Volunteer Email" 
          placeholderTextColor="white"
          onChangeText={text => setEthnicityState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Ethnicity" 
          placeholderTextColor="white"
          onChangeText={text => setEthnicityState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Gender (M/F)" 
          placeholderTextColor="white"
          onChangeText={text => setSexState(text)}/>
      </View>
      
      
      
      <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
        <Text style={styles.signUpText} >SEARCH</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
    scrollview: {
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: 60,
      paddingBottom: 15,
      color: "#1C5A7D",
      
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      width: 300
    },
  
    logo:{
      fontWeight:"bold",
      fontSize:24,
      color:"#1C5A7D",
      textAlign: 'center',
      marginTop: 60,
      paddingRight: 30, 
      paddingLeft: 30
    },
  
    instructions:{
      fontSize:18,
      color:"#1C5A7D",
      marginBottom:40,
      textAlign: 'center',
      paddingRight: 7,
      paddingLeft: 7
    },
    inputView:{
      width:270,
      backgroundColor:"#2B2E32",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding: 20,
      paddingRight: 40,
      
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
      fontWeight: "bold", 
    },
    input: {
      margin: 5,
      padding: 6,
      borderRadius: 8,
      marginBottom: 8,
      paddingHorizontal: 10,
      backgroundColor: "#eceff1",
    }
  })
  
  const modalstyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "black",
      fontWeight: "bold",
      textAlign: "left",
      fontSize: 18
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });