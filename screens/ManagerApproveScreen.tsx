import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
// import { ManagerStatusButtons } from '../components/ManagerStatusButtons'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

export default function ManagerApproveScreen() {

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
 
  return (
    <View style={styles.container}>
      <Text>Manager Approvals</Text>
      <View style={styles.space}></View>
      <View style={styles.row}>
        <Text style={styles.header}>Date</Text>
        <Text style={styles.header}>In</Text>
        <Text style={styles.header}>Out</Text>
      </View>
      { 
        loading ? 
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#E11383" />
          </View>
        :
          <FlatList
            data={records}
            renderItem={({ item }) => (
              <View style={styles.itemStyle}>
                <View style={styles.row}>
                  <Text>{item.date}</Text>
                  <View>
                    <Text>{item.in_time}</Text>
                    <Text style={styles.pending}>{item.in_approved}</Text>
                    {/* TODO: modularize approve/deny component */}
                    <TouchableOpacity onPress={() => {approve(item.key, "in", clockRef)}}>
                      <Text style={styles.approved}>approve</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={() => {deny(item.key, "in", clockRef)}}>
                      <Text style={styles.denied}>deny</Text>
                    </TouchableOpacity> 
                  </View>
                  <View>
                    <Text>{item.out_time}</Text>
                    <Text style={styles.pending}>{item.out_approved}</Text>
                    <TouchableOpacity onPress={() => {approve(item.key, "out", clockRef)}}>
                      <Text style={styles.approved}>approve</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={() => {deny(item.key, "out", clockRef)}}>
                      <Text style={styles.denied}>deny</Text>
                    </TouchableOpacity> 
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        }
    </View>
  )
}

function approve(key: String, type: String, clockRef: any) {
  if (type == "in") {
    clockRef.doc(key).set({
      in_approved: "approved"
    }, { merge: true })
  } else {
    clockRef.doc(key).set({
      out_approved: "approved"
    }, { merge: true })
  }
}

function deny(key: String, type: String, clockRef: any) {
  if (type == "in") {
    clockRef.doc(key).set({
      in_approved: "denied"
    }, { merge: true })
  } else {
    clockRef.doc(key).set({
      out_approved: "denied"
    }, { merge: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  header: {
    fontWeight: 'bold', 
    fontSize: 20
  }, 
  itemStyle: {
    height: 100,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-around', 
  }, 
  space: {
    margin: 15
  }, 
  bigSpace: {
    margin: 100
  }, 
  pending: {
    color: 'orange'
  }, 
  approved: {
    color: 'green'
  }, 
  denied: {
    color: 'red'
  }, 
  centerContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
  }
});
