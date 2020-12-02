import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Alert, Button, Platform } from 'react-native';

import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

export default function ReApplyScreen({ route, navigation  }) {
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
  const [profileImage, setProfileImage] = useState(null)
  
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username
  const {applicationID} = route.params

  const dispatch = useDispatch()  
  
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    else { alert('Sorry, we can only upload on mobile!'); return; }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setProfileImage(result.uri);
      uploadImage(result.uri)
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
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(userEmail + `-profile-image`);
    return ref.put(blob);
  };
  const handleReApply = async () => {
    
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
      var snap = await firebase.firestore().collection('volunteers').doc(applicationID).update({
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
      { profileImage
        ? <><Image source={{ uri: profileImage }} style={styles.profileImg} />
            <TouchableOpacity style={styles.uploadImgBtn} onPress={pickImage}>
              <Text style={styles.uploadImgText}>Change Profile Image</Text>
            </TouchableOpacity></>
        : <TouchableOpacity style={styles.uploadImgBtn} onPress={pickImage}>
            <Text style={styles.uploadImgText} >Upload Profile Image</Text>
          </TouchableOpacity> }
     

      </ScrollView>
      <TouchableOpacity style={styles.loginBtn} onPress={handleReApply}>
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
  },,
  uploadImgBtn:{
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
    backgroundColor: "#eceff1",
  },
  uploadImgText:{
    marginTop:10,
    color:"white",
    justifyContent: 'center',
    alignContent: 'center',
    fontWeight :'bold',
    fontSize: 18, 
    paddingBottom: 10
  },
  profileImg: {
    width: 200,
    height: 200
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