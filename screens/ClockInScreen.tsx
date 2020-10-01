import * as React from 'react';
import { StyleSheet, Dimensions, Button } from 'react-native';
import { useEffect, useState } from 'react'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions';
import MapView, { AnimatedRegion } from 'react-native-maps'
import { Marker } from 'react-native-maps'

export default function ClockInScreen() {
  const [clockedState, setClockedState] = useState(false)
  const [inTime, setInTime] = useState('')
  const [outTime, setOutTime] = useState('')
  
  useEffect(() => {
    
  }, [])

  const toggleClockIn = () => {
    const today = new Date()
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " " + (today.getMonth()+1) + '/' + today.getDate() + '/' + today.getFullYear()
    
    if (clockedState) 
      setOutTime(time)
    else {
      setInTime(time)
      setOutTime('')
    }

    setClockedState(!clockedState)
  }


  return (
    <View style={styles.container}>
      {
        inTime != '' && 
        <Text>In: {inTime}</Text>
      }
      {
        outTime != '' && 
        <Text>Out: {outTime}</Text>
      }
      <Button
        title={clockedState ? "Clock Out" : "Clock In"}
        color="#13AA52"
        onPress={toggleClockIn}
      />
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
