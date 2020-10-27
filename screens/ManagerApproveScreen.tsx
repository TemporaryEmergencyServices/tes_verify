import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

export default function ClockInScreen() {

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const [clockRef, setClockRef] = useState({})

  useEffect(() => {
    const subscriber = firebase.firestore()
    .collection('ClockInsOuts')
    setClockRef(subscriber)

    const query = subscriber
    .where('in_approved' , '==', 'pending')
    .where('out_approved', '==', 'pending')
    .onSnapshot(querySnapshot => {
      const helperRecords = [] as any;
      querySnapshot.forEach(documentSnapshot => {
        helperRecords.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id
        });
      });
      setRecords(helperRecords);
      setLoading(false);
    });
    return () => query();
  }, [])

  /*
    TODO: 
    - capture all pending
    - allow for option to approve/deny
    - allow for editing (separate screen?)
  */
  if (loading) {
    return (
      <View>
        <Text>Sorry, I'm still loading...</Text>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Text>Manager Approvals</Text>
        <Text>{JSON.stringify(records)}</Text>
      </View>
    )
  }
}

function approve(id: String) {

}

function deny(id: String) {

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
