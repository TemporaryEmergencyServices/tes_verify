import * as React from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useEffect, useState, Component, useLayoutEffect} from 'react'

import firebase from '../firebase.js'

import { Text, View } from '../components/Themed';
// import { analytics } from 'firebase';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

/*
Inspired By:

https://rnfirebase.io/firestore/usage-with-flatlists
https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6
*/ 
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
      setLoading(false)
    });
  //}


  return () => {isCancelled = true}
  });


  return (
    <View style={styles.container}>
      <Text style={styles.titleFlatList}>Volunteer Records for {userEmail}</Text>
      <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportText} >Export as PDF</Text>
      </TouchableOpacity>  
      { 
        loading ? 
          <ActivityIndicator size="large" color="#E11383" />
        : 
          <FlatList
            data={records}
            renderItem={({ item }) => (
              <View style={styles.itemStyle}>
                <View style={styles.hairline}></View>
                <Text style={styles.date}>Date: {item.date}</Text>
                <Text>In Time: {item.in_time}, {item.in_approved}</Text>
                <Text>Out Time: {item.out_time}, {item.out_approved}</Text>
                <View style={styles.hairline}></View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
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
  itemStyle: {
     height: 100,
     alignItems: 'center', 
     justifyContent: 'center'
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
  exportText:{
    color:"white",
    fontWeight: "bold",
    fontSize: 16
  },
  exportBtn:{
    width:"80%",
    backgroundColor:"#E11383",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:0,
    marginBottom:10,
  },
  date: {
    fontWeight: 'bold', 
    fontSize: 20
  }, 
  hairline: {
    backgroundColor: 'white', 
    height: 2, 
    width: Dimensions.get('window').width - 10, 
    margin: 2
  },
});
