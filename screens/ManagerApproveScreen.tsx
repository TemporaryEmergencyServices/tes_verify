import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react'

import '@firebase/firestore';

import { Text, View } from '../components/Themed';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

export default function ClockInScreen() {
  const [uniqueClockID, setUniqueClockID] = useState('')
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.email

  useEffect(() => {

  }, [])

  /*
    TODO: 
    - create manager approved navigator
  */

  return (
    <View style={styles.container}>
      <Text>Manager Approvals</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
