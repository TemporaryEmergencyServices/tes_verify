import * as React from 'react';
import { StyleSheet, Dimensions, Button } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'

import { Text, View } from '../components/Themed';
// import { analytics } from 'firebase';

export default function ClockInScreen() {
  const [clockedIn, setClockedIn] = useState(false)
  const [inTime, setInTime] = useState('')
  const [outTime, setOutTime] = useState('')
  const [uniqueClockID, setUniqueClockID] = useState('')

  const [fbClockedIn, setFbClockedIn] = useState('')
  const [fbInTime, setFbInTime] = useState('')
  const [fbOutTime, setFbOutTime] = useState('')
  // TODO: change this to global var using Redux
  const [username, setUsername] = useState('brandon@brandon.com')

  useEffect(() => {

  }, [])

  const toggleClockIn = () => {
    const today = new Date()
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
      + " " + (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()

    if (clockedIn)
      setOutTime(time)
    else {
      setInTime(time)

      //setOutTime('')
    }

    setClockFB(!clockedIn)
    setClockedIn(!clockedIn)
  }

  const setClockFB = async (clockingIn: any) => {
    if (clockingIn) {
      var snap = await firebase.database().ref('clock')
        .push({
          userid: username,
          in_time: inTime,
          out_time: "",
          in_approved: false,
          currently_clocked_in: true,
        })
      setUniqueClockID(snap.key)
  
    } else {
      firebase.database().ref('clock/' + uniqueClockID).update({
        out_time: outTime,
        out_approved: false,
        currently_clocked_in: false,
      });
    }
  }

  const getClockFB = () => {
    firebase.database().ref(username).on('value', (snapshot: any) => {
      setFbClockedIn(snapshot.val().clocked_in)
      setFbInTime(snapshot.val().in_time)
      setFbOutTime(snapshot.val().out_time)
    })
  }

  return (
    <View style={styles.container}>
      <Button
        title="Get FB Data"
        color="#13AA52"
        onPress={getClockFB}
      />
      <Text>{fbClockedIn ? "Clocked In: True" : "Clocked In: False"}</Text>
      {
        fbInTime != ''
          ? <Text>{fbInTime}</Text>
          : <Text>No Firebase In Time</Text>
      }
      {
        fbOutTime != ''
          ? <Text>{fbOutTime}</Text>
          : <Text>No Firebase Out Time</Text>
      }
      <Button
        title={clockedIn ? "Clock Out" : "Clock In"}
        color="#13AA52"
        onPress={toggleClockIn}
      />
      {
        inTime != '' &&
        <Text>In: {inTime}</Text>
      }
      {
        outTime != '' &&
        <Text>Out: {outTime}</Text>
      }
    </View>
  )
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
});
