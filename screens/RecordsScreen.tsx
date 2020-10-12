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

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    var ref = firebase.database().ref("ClockInsOuts/")
    var test = []
    ref.on("value", function(snapshot){
      console.log(snapshot.val());
      //setRecords(snapshot.val())
     // test = snapshot.val()

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    //console.log(test)
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All clock ins and outs are currently being logged to console. Am unsure on how to get them on the screen.</Text>
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
