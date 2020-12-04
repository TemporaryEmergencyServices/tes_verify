import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native';

import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';


export default function CreateClockRecordsScreen({  navigation  }) {
  const [dateState,setDateState] = useState('')
  const[inTimeState,setInTimeState] = useState('')
  const[outTimeState,setOutTimeState] = useState('')
  const[userIdState,setUserIdState] = useState('')
  const[isValidEmail, setIsValidEmail] = useState(false)
  const [ethnicityState, setEthnicityState] = useState('')
  const [sexState, setSexState] = useState('')
  const [firstNameState, setFirstNameState] = useState('')
  const [lastNameState, setLastNameState] = useState('')
  
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username

  const dispatch = useDispatch()  
  const handleApply = async () => {

    const appStateSubscriber = await firebase.firestore()
       .collection('volunteers')
       .where('userid' , '==', userIdState.toLowerCase())
       .onSnapshot(querySnapshot => {
        if(querySnapshot.empty) {
          setIsValidEmail(false)
          Alert.alert(
            'Error! Invalid Email',
            'Enter an email address with an approved application.',
             [
               {text: 'OK', onPress: () => {console.log('OK Pressed'); }},
             ],
             {cancelable: false},
           );
        } else {
         const queryDocumentSnapshot = querySnapshot.docs[0];
         const queryDocumentSnapshotData = queryDocumentSnapshot.data()
         if (queryDocumentSnapshotData.approved!='approved') {
          Alert.alert(
            'Error! Invalid Email',
            'Enter an email address with an approved application.',
             [
               {text: 'OK', onPress: () => {console.log('OK Pressed'); }},
             ],
             {cancelable: false},
           );
         }
         else{
          var errorMessage = ''
          if (dateState.length != 10) {errorMessage = 'Please enter date in format YYYY-MM-DD.'}
          if (dateState.substring(4,5) != '-' || dateState.substring(7,8) != '-') {
            errorMessage = 'Please enter date in format YYYY-MM-DD.'
          }
          if (dateState == '') {errorMessage = 'Please enter the record date.'}
          if (inTimeState == '') {errorMessage = 'Please enter the clock in time.'}
          if (inTimeState.substring(2, 3) != ':' || inTimeState.length != 8 || outTimeState.substring(5,6) != ' ' || (inTimeState.substring(6,8) != 'AM' && inTimeState.substring(6,8) != 'PM')) 
            {errorMessage = 'Please enter the clock in time in the format HH:MM AM/PM. Example: 01:35 PM'}
          if (outTimeState == '') {errorMessage = 'Please enter the clock out time.'}
          if (outTimeState.substring(2, 3) != ':' || outTimeState.length != 8 || outTimeState.substring(5,6) != ' ' || (outTimeState.substring(6,8) != 'AM' && outTimeState.substring(6,8) != 'PM'))
           {errorMessage = 'Please enter the clock out time in the format HH:MM AM/PM. Example: 01:35 PM'}
          if (userIdState == '') {errorMessage = 'Please enter the volunteer email address'}
          if (!userIdState.includes('@')) {errorMessage = 'Please enter a valid email address.'}
          
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
            const in_approved = "approved"
            const out_approved = "approved"

            var inAMPM = inTimeState.substring(6,8);
            var inHours = parseInt(inTimeState.substring(0,2));
        
            if(inAMPM == 'PM' && inHours!=12) {inHours = inHours + 12}
            if(inAMPM == 'AM' && inHours==12) {inHours = 0}
            var inMins = parseInt(inTimeState.substring(3,5));
            
            var outAMPM = outTimeState.substring(6,8);
            var outHours = parseInt(outTimeState.substring(0,2));
        
            if(outAMPM == 'PM' && outHours!=12) {outHours = outHours + 12}
            if(outAMPM == 'AM' && outHours==12) {outHours = 0}
            var outMins = parseInt(outTimeState.substring(3,5));

            var hoursElapsed = outHours - inHours;
            var minutesElapsed = outMins - inMins;
            
            if (minutesElapsed < 0){
              minutesElapsed += 60;
              hoursElapsed -= 1;
            }

            var snap = firebase.firestore().collection('ClockInsOuts').add({
                    currently_clocked_in: currently_clocked_in,
                    date: dateState,
                    in_approved: in_approved,
                    in_time: inTimeState,
                    out_approved: out_approved,
                    out_date: dateState,
                    out_time: outTimeState,
                    userid: userIdState.toLowerCase(),
                    firstName: queryDocumentSnapshotData.firstName,
                    lastName: queryDocumentSnapshotData.lastName,
                    sex: queryDocumentSnapshotData.sex,
                    ethnicity: queryDocumentSnapshotData.ethnicity,
                    minutesElapsed: minutesElapsed,
                    hoursElapsed: hoursElapsed
            });
      
            Alert.alert(
            'Record Submitted',
            "You may view record using the search functinality.",
              [
                {text: 'OK', onPress: () => {console.log('OK Pressed'); navigation.goBack() }},
              ],
              {cancelable: false},
            );
          }
    
         }
        }
     });
    

  
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
      {/*<View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Date (YYYY-MM-DD)" 
          placeholderTextColor="white"
          onChangeText={text => setDateState(text)}/>
      </View> */}
      <DatePicker
          style={styles.datePickerStyle}
          date = {dateState}
          mode="date" //The enum of date, datetime and time
          placeholder="Date"
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
            setDateState(date);
          }}
        />
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="In Time (HH:MM AM/PM)" 
          placeholderTextColor="white"
          onChangeText={text => setInTimeState(text)}/>

      </View>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="Out Time (HH:MM AM/PM)" 
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
  datePickerStyle: {
    width: 200,
    marginTop: 0,
    marginBottom: 20,
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