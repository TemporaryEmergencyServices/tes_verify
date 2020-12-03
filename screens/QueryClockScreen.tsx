import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native';

import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
//date picker code from https://snack.expo.io/@aboutreact/date-picker-example?session_id=snack-session-TT5a8E!7q

export default function QueryClockScreen({ navigation }) {
  const today = new Date()
  const [startDateState,setStartDateState] = useState(today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0'))
  const [stopDateState,setStopDateState] = useState(today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0'))
  const [userIdState,setUserIdState] = useState('')
  const [ethnicityState, setEthnicityState] = useState('')
  const [sexState, setSexState] = useState('')
  const [firstNameState, setFirstNameState] = useState('')
  const [lastNameState, setLastNameState] = useState('')


  const handleSearch = () => {
    navigation.push('DisplayQueryClockScreen', {
        firstName: firstNameState,
        lastName: lastNameState,
        userId: userIdState.toLowerCase(),
        ethnicity: ethnicityState,
        sex: sexState,
        startDate: startDateState,
        stopDate: stopDateState
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Search for records by name, userid, gender, ethnicity, and/or date.</Text>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="First Name" 
          placeholderTextColor="grey"
          onChangeText={text => setFirstNameState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Last Name" 
          placeholderTextColor="grey"
          onChangeText={text => setLastNameState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Volunteer Email" 
          placeholderTextColor="grey"
          onChangeText={text => setUserIdState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Ethnicity" 
          placeholderTextColor="grey"
          onChangeText={text => setEthnicityState(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Gender (M/F)" 
          placeholderTextColor="grey"
          onChangeText={text => setSexState(text)}/>
      </View>
      <Text style={styles.dateRange}> Date Range (from, to): </Text>
      <DatePicker
          style={styles.datePickerStyle}
          date = {startDateState}
          mode="date" //The enum of date, datetime and time
          placeholder={startDateState}
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              //display: 'none',
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={(date) => {
            setStartDateState(date);
          }}
        />
       
        <DatePicker
          style={styles.datePickerStyle}
          date = {stopDateState}
          mode="date" //The enum of date, datetime and time
          placeholder={stopDateState}
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              //display: 'none',
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={(date) => {
            setStopDateState(date);
          }}
        />
      
      <TouchableOpacity style={styles.loginBtn} onPress={handleSearch}>
        <Text style={styles.signUpText} >SEARCH</Text>
      </TouchableOpacity>

      <Button 
        title="LEAVE PAGE" 
        color = "#1C5A7D" 
        onPress={() => navigation.goBack()} />

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
    dateRange:{
      fontSize:16,
      fontWeight: 'bold',
      color:"black",
      marginBottom:7,
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
      marginTop: 20,
      marginBottom: 5
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
    },
    datePickerStyle: {
        width: 200,
        marginTop: 7,
        marginBottom: 7,
      },
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