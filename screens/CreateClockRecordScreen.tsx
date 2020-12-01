import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native';

import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';

export default function CreateClockRecordsScreen({  navigation  }) {
  const [dateState,setDateState] = useState('')
  const[inTimeState,setInTimeState] = useState('')
  const[outTimeState,setOutTimeState] = useState('')
  const[userIdState,setUserIdState] = useState('')
  
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username

  const dispatch = useDispatch()  
  const handleApply = async () => {
    
    var errorMessage = ''
    if (dateState == '') {errorMessage = 'Please enter the record date.'}
    if (dateState.length != 10) {errorMessage = 'Please enter date in format YYYY-MM-DD.'}
    if (dateState.substring(4,5) != '-' || dateState.substring(7,8) != '-') {
      errorMessage = 'Please enter date in format YYYY-MM-DD.'
    }
    if (inTimeState == '') {errorMessage = 'Please enter the clock in time.'}
    if (outTimeState == '') {errorMessage = 'Please enter the clock out time.'}
    if (userIdState == '') {errorMessage = 'Please enter the volunteer email address'}
    if (!userIdState.includes('@')) {errorMessage = 'Please enter a valid email address.'}
    const today = new Date()
    const dateRaw = today.toISOString().substring(0,10)
    const timeRaw = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric',hour12: true })

  
    
    if (errorMessage != '') {
      Alert.alert(
        'Error! Incomplete submission.',
        errorMessage,
         [
           {text: 'OK', onPress: () => {console.log('OK Pressed'); }},
         ],
         {cancelable: false},
       );
    }

    else {
      const currently_clocked_in =  false
      const in_approved = "pending"
      const out_approved = "pending"
      
      var snap = await firebase.firestore().collection('ClockInsOuts').add({
              currently_clocked_in: currently_clocked_in,
              date: dateRaw,
              in_approved: in_approved,
              in_time: timeRaw,
              out_approved: out_approved,
              out_date: dateState,
              out_time: outTimeState,
              userid: userIdState
      });

      Alert.alert(
      'Record Submitted',
      "Record must still be approved. Press OK to continue.",
        [
          {text: 'OK', onPress: () => {console.log('OK Pressed'); navigation.goBack() }},
        ],
        {cancelable: false},
      );
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Clock In/Out Record Creation</Text>

      <ScrollView 
        style={styles.scrollView}
        centerContent={true} 
        contentContainerStyle={styles.contentContainer} >

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Volunteer Email" 
          placeholderTextColor="white"
          onChangeText={text => setUserIdState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Date (YYYY-MM-DD)" 
          placeholderTextColor="white"
          onChangeText={text => setDateState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="In Time" 
          placeholderTextColor="white"
          onChangeText={text => setInTimeState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Out Time" 
          placeholderTextColor="white"
          onChangeText={text => setOutTimeState(text)}/>
      </View>

      </ScrollView>
      <TouchableOpacity style={styles.loginBtn} onPress={handleApply}>
        <Text style={styles.signUpText} >SUBMIT</Text>
      </TouchableOpacity>

      <Button 
        title="LEAVE PAGE" 
        color = "#1C5A7D" 
        onPress={() => 
          {Alert.alert(
            'Leave Page?',
            "Are you sure you want to leave the page? All progress will be lost.",
             [
               {text: 'OK', onPress: () => {console.log('OK Pressed'); navigation.goBack() }},
               {text: 'Cancel', onPress: () => {console.log('Cancel Pressed'); }},

             ],
             {cancelable: false},
           );
           
          }} />
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
    marginBottom:10,
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
    width:"90%",
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