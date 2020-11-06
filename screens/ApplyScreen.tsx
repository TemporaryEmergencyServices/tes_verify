import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import { useDispatch } from 'react-redux'

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
  const[appApproved,setAppApprovedState] = useState(false)
  const[appApprovedBy,setAppApprovedByState] = useState('')
  const[appApprovedByDate,setAppApprovedByDateState] = useState('')
  const[appSubmitDate,setAppSubmitDate] = useState('')
  
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.email

  const dispatch = useDispatch()  
  const handleApply = async () => {
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
  }//do nothing for now
    

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TES Verify</Text>
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

      <TouchableOpacity style={styles.loginBtn} onPress={handleApply}>
        <Text style={styles.signUpText} >Apply to be a volunteer</Text>
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
  },
  input: {
    margin: 5,
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: "#eceff1"
  }
})