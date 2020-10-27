import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
// import { analytics } from 'firebase';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

export default function ClockInScreen() {
  const [clockedIn, setClockedIn] = useState(false)
  const [inTime, setInTime] = useState('')
  const [outTime, setOutTime] = useState('')
  const [uniqueClockID, setUniqueClockID] = useState('')

  const [fbClockedIn, setFbClockedIn] = useState('')
  const [fbInTime, setFbInTime] = useState('')
  const [fbOutTime, setFbOutTime] = useState('')
  // TODO: change this to global var using Redux
  //const [username, setUsername] = useState('brandon@brandon.com')
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.email

  useEffect(() => {

  }, [])

  const determineAlreadyClockedIn = async () => {
    var isAlreadyClockedIn = false
    //const clockInsRef = firebase.database().ref('ClockInsOuts/')
    const clockInsRef = firebase.firestore().collection('ClockInsOuts');
    clockInsRef.where('userEmail', '==', userEmail)
               .where('currentlyClockedIn', '==', true)
    
    /*
    await clockInsRef.orderByChild('currently_clocked_in').equalTo(true).limitToLast(1).on("child_added", function(snapshot) {
      var session = snapshot.val()
      if (session.userid == userEmail) {
        setClockedIn(true)
        setInTime(session.in_time) 
        setUniqueClockID(snapshot.key)
        isAlreadyClockedIn = true
      }
    });

    if (isAlreadyClockedIn == false) {
      Alert.alert(
        'Sorry...',
        'You are not currently in a volunteer session. Please clock in.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );  

    }
    */
  }

  //var isAlreadyClockedIn = determineAlreadyClockedIn()

  const toggleClockIn = () => {
    //get the time
    //if you are not clocked in, do clock in function
        //set in time 
        // create firebase entry
    //if you are clocked in, do clock out function
        //set in time
        //create firebase entry
    const today = new Date()
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
     // + " " + (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    if (!clockedIn) {handleClockIn(date, time)}

    else { handleClockOut(date, time)}

  }

  const handleClockIn = (date: any, time: any) => {
    setInTime(time)
    writeFBClockIn(date, time)
    setClockedIn(true)
  }

  const handleClockOut = (date: any, time: any) => {
    setOutTime(time)
    writeFBClockOut(date, time)
    setClockedIn(false)
    alertOutLogged(date, time)
  }

  const writeFBClockIn = async (date: any, time: any) => {
    var snap = await firebase.firestore().collection('ClockInsOuts').add({
      userid: userEmail,
      in_time: time,
      date: date,
      in_approved: "pending",
      currently_clocked_in: true,
    });
    setUniqueClockID(snap.id)
  }

  const writeFBClockOut = async (date: any, time: any) => {
    var snap = await firebase.firestore().collection('ClockInsOuts').doc(uniqueClockID).update({
      out_time: time,
      out_approved: "pending",
      currently_clocked_in: false,
      out_date: date
    });
  }

  const alertOutLogged = (date, outTimeAlert) => 
    Alert.alert(
      'Clock Out Completed',
      'Your volunteer session starting at '+inTime+ ' and ending at '+outTimeAlert + ' has been submitted for approval on ' + date + '.', // <- this part is optional, you can pass an empty string
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );

    
  /* const getClockFB = () => {
    firebase.database().ref(userEmail).on('value', (snapshot: any) => {
      setFbClockedIn(snapshot.val().clocked_in)
      setFbInTime(snapshot.val().in_time)
      setFbOutTime(snapshot.val().out_time)
    })
  } */

    /* REMOVED BUTTONS 
     <Button
        title="Get FB Data"
        color="#13AA52"
        onPress={getClockFB}
      />
      <Text>{fbClockedIn ? "Clocked In: True" : "Clocked In: False"}</Text>

    */

  if (clockedIn) {return (

    <View style={styles.container}>
      <Text style={styles.instructionsText}> You clocked in at </Text>
      <Text style={styles.instructionsText}> {inTime}. </Text>
      <Text style={styles.instructionsText}> Use the button below to clock out and end your volunteer session. </Text>
      <TouchableOpacity 
        style={[styles.clockInOutButton, styles.clockOutButton]} onPress={() => {toggleClockIn()}}>
        <Text style={styles.clockInOutText}>Clock Out</Text>
      </TouchableOpacity>
    </View>
  )}
  else {
    return (
    <View style={styles.container}>
      <Text style={styles.instructionsText}> If you are checking in, press the clock in button. Alternatively, if you have already checked in today, select resume session. </Text>
      <TouchableOpacity 
        style={[styles.clockInOutButton, styles.clockInButton]} onPress={toggleClockIn}>
        <Text style={styles.clockInOutText}>Clock In</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.clockInOutButton, styles.clockInResumeButton]} onPress={determineAlreadyClockedIn}>
        <Text style={styles.clockInOutText}>Resume</Text>
      </TouchableOpacity>
    </View>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  clockInOutButton: {
    width:"80%",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10,
    
  }, 

  clockInButton: {
    backgroundColor: "#13AA52"
  }, 

  clockOutButton: {
    backgroundColor: "#E11383"
  },

  clockInResumeButton: {
    backgroundColor: "gray"
  },

  clockInOutText: {
    color: "white", 
    fontWeight: "bold",
    fontSize: 24
  },

  instructionsText: {
    fontWeight:"bold",
    fontSize:18,
    color:"#1C5A7D",
    marginBottom:15,
    marginHorizontal: 30,
    justifyContent: "center",
    textAlign: "center",
  },


});
