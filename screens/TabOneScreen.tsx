import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useEffect, useState } from 'react'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions';
import MapView, { AnimatedRegion } from 'react-native-maps'
import { Marker } from 'react-native-maps'


export default function TabOneScreen() {
  const [location, setLocation] = useState({})
  const [errorMsg, setErrorMsg] = useState('')

  const getUserLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    
    let region
    if (status !== 'granted') {
      // default coords
      region = {
        latitude: 33.95644567711626,
        longitude: -84.78240539428366,
        latitudeDelta: 1,
        longitudeDelta: 1,
      }
    } else {
      const location = await Location.getCurrentPositionAsync({});
      region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      }
    }
    return {status, region}
  }

  useEffect(() => {
    (async () => {
      const {status, region} = await getUserLocation()
      if (status !== 'granted') {
        setErrorMsg('Location permission denied')
      }
      console.log('region', region)
      setLocation(region)
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      <Text>{JSON.stringify(location)}</Text>
      { location != null && 
        <MapView style={styles.mapStyle}
          region={location}
        >
        <Marker 
          coordinate={location}
          title={"My Location"}
          description={"desc"}
        />
      </MapView>
      }
      
    </View>
  );
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
