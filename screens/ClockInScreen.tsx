import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, Platform } from 'react-native';
import {  ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import SettingsScreen from './SettingsScreen.js';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { Permissions } from 'expo';

export default function ClockInScreen() {
  const [clockedIn, setClockedIn] = useState(false)
  const [inTime, setInTime] = useState('')
  const [outTime, setOutTime] = useState('')
  const [uniqueClockID, setUniqueClockID] = useState('')

  const [fbClockedIn, setFbClockedIn] = useState('')
  const [fbInTime, setFbInTime] = useState('')
  const [fbOutTime, setFbOutTime] = useState('')

  const[hasAccess,setHasAccess] = useState(false)
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username
  const [loading, setLoading] = useState(true)
  
  const [appState, setAppState] = useState("none")

  const [hasCamPermission, setHasCamPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [validQR, setValidQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  useEffect(() => {

    // QR scanning permissions
    if (Platform.OS !== 'web'){
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCamPermission(status === 'granted');
    })();}

    let unmounted = false

    //clock ins
    const subscriber = firebase.firestore()
       .collection('ClockInsOuts')
       .where('userid' , '==', userEmail)
       .where('currently_clocked_in', '==', true)
       .limit(1)
       .onSnapshot(querySnapshot => {
         if(querySnapshot.empty) {
          setClockedIn(false)

         }
         else{
           const queryDocumentSnapshot = querySnapshot.docs[0];
           const queryDocumentSnapshotData = queryDocumentSnapshot.data()
           setUniqueClockID(queryDocumentSnapshot.id)
           setInTime(queryDocumentSnapshotData.in_time)
           setClockedIn(true)
           
           //do stuff for resume - set clocked in to true
           //set in time
           //set unique clock id
         }
     });
     let unmounted2 = false
     /*const roleSubscriber = firebase.firestore()
       .collection('roles')
       .where('username' , '==', userEmail)
       .limit(1)
       .onSnapshot(querySnapshot => {
         if(querySnapshot.empty) {
          setHasAccess(false)
         }
         else{
           const queryDocumentSnapshot = querySnapshot.docs[0];
           const queryDocumentSnapshotData = queryDocumentSnapshot.data()
           if (queryDocumentSnapshotData.role == 'volunteer'){
              setHasAccess(true)
              setLoading(false)
            }
          else {
            setHasAccess(false)
            setLoading(false)
          }
         }
     }); */
     const appStateSubscriber = firebase.firestore()
       .collection('volunteers')
       .where('userid' , '==', userEmail)
       .onSnapshot(querySnapshot => {
        if(querySnapshot.empty) {
          setAppState("none")
          setLoading(false)
        } else {
         const queryDocumentSnapshot = querySnapshot.docs[0];
         const queryDocumentSnapshotData = queryDocumentSnapshot.data()
         setAppState(queryDocumentSnapshotData.approved)
         setLoading(false)
        }
     });
    return () => {subscriber(); appStateSubscriber(); unmounted = true; unmounted2 = true };
  } ,[]);

  const isValidQR = (data : string) => {
    var isValid = false;
    const docRef = firebase.firestore()
         .collection('QRcodes')
         .doc(data).get()
         .then((doc) => {console.log(doc.data().active);setValidQR("enabled" == doc.data().active)})
         .then(() => {
            if (validQR){
              toggleClockIn();
              alert(`valid QR code!`);
            }
            else {
              alert(`QR code not valid!`);
            }
         });
  }

  const handleBarCodeScanned = ({type, data}) => {
    setScanned(true);
    isValidQR(data);
    
    setShowScanner(false);
    setScanned(false);
  };

  

  const toggleClockIn = () => {
    //get the time
    //if you are not clocked in, do clock in function
        //set in time 
        // create firebase entry
    //if you are clocked in, do clock out function
        //set in time
        //create firebase entry
    const today = new Date()
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
     // + " " + (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    const date = today.toISOString().substring(0,10)
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

  if (loading) {
      return (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#E11383" />
            </View>
      )
  }

  else {
    if (appState != 'approved'){
    return (
    <View style={styles.container}>
      <Text style={styles.instructionsText}> You must have an approved volunteer application to clock in. Please speak with a TES manager.</Text>
    </View>
    )
  }

  // based on https://docs.expo.io/versions/latest/sdk/bar-code-scanner/
  // if on mobile, check permissions
  if (Platform.OS !== 'web'){
    if (hasCamPermission === null){
      return <Text> Requesting for camera permission</Text>;
    }
    if (hasCamPermission === false) {
      return <Text>No access to camera</Text>;
    }
  }

  if (clockedIn) {return (

    <View style={styles.container}>
      <Text style={styles.instructionsText}> You clocked in at </Text>
      <Text style={styles.instructionsText}> {inTime}. </Text>
      <Text style={styles.instructionsText}> Use the button below to clock out and end your volunteer session. </Text>
      <TouchableOpacity 
        style={[styles.clockInOutButton, styles.clockOutButton]} onPress={() => {
          if (hasCamPermission){
            setShowScanner(true);
          }
          else if (Platform.OS === 'web'){
            toggleClockIn();
          }
        }}>
        <Text style={styles.clockInOutText}>Clock Out</Text>
      </TouchableOpacity>
      {Platform.OS === 'web' ? <Text> Barcode scanner ignored for web version!</Text>
      : hasCamPermission === null ? <Text>Requesting for camera permission</Text> 
      : hasCamPermission === false ? <Text> no camera permission :( </Text>
      : showScanner === false ? <Text> Press clock in to scan a QR code</Text>
      : <View style={styles.scanner}> 
          <TouchableOpacity style={styles.scannerCloseButton} onPress={() => setShowScanner(false)}  >
            <Text>Close Camera</Text>
          </TouchableOpacity>
          <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        </View>
      }

    </View>
  )}
  else {
    return (
    <View style={styles.container}>
      <Text style={styles.instructionsText}> If you are checking in, press the clock in button! </Text>
      <TouchableOpacity accessibilityLabel="clock in button"
        style={[styles.clockInOutButton, styles.clockInButton]} onPress={() => {
          if (hasCamPermission){
            setShowScanner(true);
          }
          else if (Platform.OS === 'web'){
            toggleClockIn();
          }
        }}>
        <Text style={styles.clockInOutText}>Clock In</Text>
      </TouchableOpacity>

      {Platform.OS === 'web' ? <Text> Barcode scanner ignored for web version!</Text>
      : hasCamPermission === null ? <Text>Requesting for camera permission</Text> 
      : hasCamPermission === false ? <Text> no camera permission :( </Text>
      : showScanner === false ? <Text> Press clock in to scan a QR code</Text>
      : <View style={styles.scannerView}> 
          <TouchableOpacity style={styles.scannerCloseButton} onPress={() => setShowScanner(false)}  >
            <Text>Close Camera</Text>
          </TouchableOpacity>
          <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        </View>
      }
    </View>
  )}
}
}



/* was resume button 
<TouchableOpacity 
        style={[styles.clockInOutButton, styles.clockInResumeButton]} onPress={determineAlreadyClockedIn}>
        <Text style={styles.clockInOutText}>Resume</Text>
      </TouchableOpacity> */

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
  centerContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
  },

  scannerView: {
    height: "90%",
    alignItems: "center"
  },

  scannerCloseButton: {
    height: "10%",
    alignContent: "center"
  },

  scanner: {
    height: "100%",
    alignContent:"center"
  },
});
