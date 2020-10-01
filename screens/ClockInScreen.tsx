import * as React from 'react';
import { StyleSheet, Dimensions, Button } from 'react-native';
import { useEffect, useState } from 'react'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions';
import MapView, { AnimatedRegion } from 'react-native-maps'
import { Marker } from 'react-native-maps'
import TabTwoScreen from './TabTwoScreen';


export default function ClockInScreen() {
  const [clockedIn, setClockedIn] = useState(true)
  
  useEffect(() => {

  }, [])

  return (
    <View>
      <Button
        // onPress={}
        title="Clock In"
        color="#13AA52"
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
