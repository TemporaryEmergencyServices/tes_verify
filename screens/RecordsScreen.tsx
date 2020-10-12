import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useEffect, useState, Component, useLayoutEffect} from 'react'

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
    let isCancelled = false
    //if(!unmounted){
    ref.once("value", function(snapshot){
      const help = [] as any;

      snapshot.forEach(function(recordSnapshot){
        if(recordSnapshot.val().userid == userEmail) {
          const id = recordSnapshot.key
           const recorddata = recordSnapshot.val()
          recorddata['id'] = id
          help.push(recorddata)
        }
        
      });

      if(!isCancelled){
        setRecords(help) 
      }

      //return () => {isCancelled = true};
    });
  //}


  return () => {isCancelled = true}
  });

  return (
    <View style={styles.container}>
    <Text style={styles.titleFlatList}>Hi!</Text>
      <FlatList
        data={records}
        renderItem={({ item }) => (
          <View style={{ height: 80, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>User ID: {item.userid}</Text>
            <Text>Date: {item.date}</Text>
            <Text>In Time: {item.in_time}</Text>
            <Text>Out Time: {item.out_time}</Text>
          </View>
        )}
      showsVerticalScrollIndicator={false}
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
  titleFlatList: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 15,
    color: "#1C5A7D",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
