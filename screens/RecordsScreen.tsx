import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useEffect, useState, Component } from 'react'

import firebase from '../firebase.js'

import { Text, View } from '../components/Themed';
// import { analytics } from 'firebase';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

export default function RecordsScreen() {

  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.email

  const [loading, setLoading] = useState(true)
  //var records:any = []
  const [records, setRecords] = useState([] as any)
  

  useEffect(() => {
    var ref = firebase.database().ref("ClockInsOuts/")

    ref.once("value", function(snapshot){
      const help = [] as any;

      snapshot.forEach(function(recordSnapshot){
        const id = recordSnapshot.key
        const recorddata = recordSnapshot.val()
        recorddata['id'] = id
        help.push(recorddata)
      })
      setRecords(help)
    
    });

    //console.log(test)
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hi!</Text>
      <FlatList
        data={records}
        renderItem={({ item }) => (
          <View style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>User ID: {item.userid}</Text>
            <Text>In Time: {item.in_time} on {item.date} </Text>
          </View>
        )}
      />
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
    justifyContent: 'center',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
