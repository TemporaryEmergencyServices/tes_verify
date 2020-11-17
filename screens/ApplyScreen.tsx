import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native';

import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';

export default function ApplyScreen({  navigation  }) {
  const [firstNameState,setFirstNameState] = useState('')
  const[lastNameState,setLastNameState] = useState('')
  const[phoneState,setPhoneState] = useState('')
  const[sexState,setSexState] = useState('')
  const[ethnicityState,setEthnicityState] = useState('')
  const[emergencyName1State,setEmergencyName1State] = useState('')
  const[emergencyPhone1State,setEmergencyPhone1State] = useState('')
  const[emergencyName2State,setEmergencyName2State] = useState('')
  const[emergencyPhone2State,setEmergencyPhone2State] = useState('')
  const[address1State,setAddress1State] = useState('')// Genuine question: what about homeless people?
  const[address2State,setAddress2State] = useState('')
  const[addressZip,setAddressZipState] = useState('')
  const[addressCity,setAddressCityState] = useState('')
  const[addressState,setAddressStateState] = useState('')
  const[appApproved,setAppApprovedState] = useState('pending')
  const[appApprovedBy,setAppApprovedByState] = useState('')
  const[appApprovedByDate,setAppApprovedByDateState] = useState('')
  const[appSubmitDate,setAppSubmitDate] = useState('')
  
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username

  const dispatch = useDispatch()  
  const handleApply = async () => {
    
    var errorMessage = ''
    if (addressState == '') {errorMessage = 'Please enter your state.'}
    if (addressCity == '') {errorMessage = 'Please enter your city.'}
    if (addressZip == '') {errorMessage = 'Please enter your zip code.'}
    if (address1State == '' && address2State == '') {errorMessage = 'Please enter your address.'}
    if (emergencyName2State == '' || emergencyPhone2State == '' ) {errorMessage = 'Please enter your second emergency name and phone number.'}
    if (emergencyName1State == '' || emergencyPhone1State == '' ) {errorMessage = 'Please enter your first emergency name and phone number.'}
    if (ethnicityState == '') {errorMessage = 'Please enter ethnicity.'}
    if (sexState != 'M' && sexState != 'F') {errorMessage = 'Please enter sex: M or F.'}
    if (phoneState == '') {errorMessage = 'Please enter a phone number.'}
    if (lastNameState == '') {errorMessage = 'Please enter a last name.'}
    if (firstNameState == '') {errorMessage = 'Please enter a first name.'}
    


    if (errorMessage != '') {
      Alert.alert(
        'Error! Incomplete application.',
        errorMessage,
         [
           {text: 'OK', onPress: () => {console.log('OK Pressed'); }},
         ],
         {cancelable: false},
       );
    }

    else {
      const today = new Date()
      const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
      // + " " + (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
      const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
      const dateTime = date+" " + time
      setAppSubmitDate(dateTime)
      var snap = await firebase.firestore().collection('volunteers').add({
              userid: userEmail,
              firstName: firstNameState,
              lastName: lastNameState,
              phone: phoneState,
              sex: sexState,
              ethnicity: ethnicityState,
              emergencyName1: emergencyName1State,
              emergencyPhone1: emergencyPhone1State,
              emergencyName2: emergencyName2State,
              emergencyPhone2: emergencyPhone2State,
              addressLine1: address1State,
              addressLine2: address2State,
              addressZip: addressZip,
              addressCity: addressCity,
              addressState: addressState,
              approved: appApproved,
              approvedBy: appApprovedBy,
              approvedDate: appApprovedByDate,
              appSubmitDate: appSubmitDate
  
      });

      Alert.alert(
      'Application Submitted',
      "Press OK to continue. An administrator will view your submission shortly.",
        [
          {text: 'OK', onPress: () => {console.log('OK Pressed'); navigation.goBack() }},
        ],
        {cancelable: false},
      );
    }
  }//do nothing for now
    
  /* back button; should no longer be necessary
  navigation uses push to pull up apply screen
  <Button title="Go back" onPress={() => navigation.goBack()} />
  */


  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Volunteer Approval Application</Text>
      <Text style={styles.instructions}>Please enter the information below exactly as it appeared on your paper application.</Text>

      <ScrollView 
        style={styles.scrollView}
        centerContent={true} 
        contentContainerStyle={styles.contentContainer} >

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
          placeholder="Phone number" 
          placeholderTextColor="white"
          onChangeText={text => setPhoneState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          maxLength = {1}
          placeholder="Sex (M/F)" 
          placeholderTextColor="white"
          onChangeText={text => setSexState(text)}/>
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
          placeholder="Emergency contact 1 name" 
          placeholderTextColor="white"
          onChangeText={text => setEmergencyName1State(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Emergency contact 1 phone number" 
          placeholderTextColor="white"
          onChangeText={text => setEmergencyPhone1State(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Emergency contact 2 name" 
          placeholderTextColor="white"
          onChangeText={text => setEmergencyName2State(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Emergency contact 1 phone number" 
          placeholderTextColor="white"
          onChangeText={text => setEmergencyPhone2State(text)}/>
      </View>

      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Address Line 1" 
          placeholderTextColor="white"
          onChangeText={text => setAddress1State(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Address Line 2" 
          placeholderTextColor="white"
          onChangeText={text => setAddress2State(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Zip code" 
          placeholderTextColor="white"
          onChangeText={text => setAddressZipState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="City" 
          placeholderTextColor="white"
          onChangeText={text => setAddressCityState(text)}/>
      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          maxLength = {2}
          placeholder="State" 
          placeholderTextColor="white"
          onChangeText={text => setAddressStateState(text)}/>
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
    marginTop:15,
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