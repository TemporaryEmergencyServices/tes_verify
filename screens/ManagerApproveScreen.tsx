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

  const[hasAccess,setHasAccess] = useState(true)


  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username
  const userRole = user.role
  //if(user.role == 'administrator') {setHasAccess(true)}

  useEffect(() => {
    let unmounted = false
    //role is now redux - should not need roleSubscriber anymore:)
    /*const roleSubscriber = firebase.firestore()
       .collection('roles')
       .where('username' , '==', userEmail)
       .limit(1)
       .onSnapshot(querySnapshot => {
         if(querySnapshot.empty) {
          setHasAccess(false)
         }
         else{
           const queryDocumentSnapshot = querySnapshot.docs[0];
           const queryDocumentSnapshotData = queryDocumentSnapshot.data()
           if (queryDocumentSnapshotData.role == 'administrator'){
              console.log("idk man")
              setHasAccess(true)
            
            }
          else {setHasAccess(false)}
         }
     }); */ 

    const subscriber = firebase.firestore()
    .collection('ClockInsOuts')
    setClockRef(subscriber)

    const clockInQuery = subscriber
    .where('in_approved' , '==', 'pending')
    // .where('out_approved', '==', 'pending')
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

    const clockOutQuery = subscriber
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

    () => clockInQuery()
    return () => {clockOutQuery(); unmounted=true};
  }, [])

  /*
    TODO: 
    - capture all pending
    - allow for option to approve/deny
    - allow for editing (separate screen?)
  */
//  console.log(hasAccess)
//  if (!hasAccess){
//    return (
//    <View style={styles.container}>
//      <Text style={styles.header}> You are not authorized :( </Text>
//    </View>
//    )
//  }
  return (
    <View style={styles.container}>
      <Text style={styles.titleFlatList}>Approve Clock Ins and Outs</Text>
      {/* TODO: show "no pending records" when records empty. 
          for some reason, it's currently populating records and then 
          immediately become empty currently
      */}
      {/* {
        records != [] ?
          <>  */}
            <View style={styles.space}></View>
            <TouchableOpacity style={styles.exportBtn} onPress={() => approveAll(records, clockRef)}>
              <Text style={styles.exportText}>Approve All</Text>
            </TouchableOpacity>
            <View style={styles.space}></View>
            <View style={styles.row}>
              <Text style={styles.header}>Date</Text>
              <Text style={styles.header}>In</Text>
              <Text style={styles.header}>Out</Text>
            </View>
          {/* </>
        :
          <Text style={styles.container}>No Pending Records!</Text>
      } */}
      
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
                  <Text style={styles.userIdText}>{item.userid}</Text>
                </View>
                <View style={styles.row2}>
                  <Text>{item.date}</Text>
                  <View>
                    <Text>{item.in_time}</Text>
                    <Text style={renderRecordStatus(item.in_approved)}>{item.in_approved}</Text>
                    {/* TODO: modularize approve/deny component */}
                    <TouchableOpacity style={styles.approvedBtn} onPress={() => {approve(item.key, "in", clockRef)}}>
                      <Text style={styles.actionText}>approve</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.denyBtn} onPress={() => {deny(item.key, "in", clockRef)}}>
                      <Text style={styles.actionText}>deny</Text>
                    </TouchableOpacity> 
                  </View>
                  <View>
                    <Text>{item.out_time}</Text>
                    <Text style={renderRecordStatus(item.out_approved)}>{item.out_approved}</Text>
                    <TouchableOpacity style={styles.approvedBtn} onPress={() => {approve(item.key, "out", clockRef)}}>
                      <Text style={styles.actionText}>approve</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity style={styles.denyBtn} onPress={() => {deny(item.key, "out", clockRef)}}>
                      <Text style={styles.actionText}>deny</Text>
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

// FIXME: this may even approve those records that 
// are no longer displaying or have been previously denied, 
// must test this
function approveAll(records: any, clockRef: any) {
  records.forEach(record => {
    approve(record.key, "in", clockRef)
    approve(record.key, "out", clockRef)
  })
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

function renderRecordStatus(status: String) {
  if (status === "approved") {
    return styles.approved
  } else if (status === "pending") {
    return styles.pending
  } else if (status === "denied") {
    return styles.denied
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
  titleFlatList: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 15,
    color: "#1C5A7D",
  },
  exportText:{
    color:"white",
    fontWeight: "bold",
    fontSize: 16
  },
  exportBtn:{
    width:"80%",
    backgroundColor:"#13AA52",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:0,
    marginBottom:10,
  },
  itemStyle: {
    height: 150,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-around', 
  }, 
  row2: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-around', 
  }, 
  userIdText: {
    margin: 15, 
    fontWeight: 'bold'
  },
  space: {
    margin: 15, 
  }, 
  bigSpace: {
    margin: 100
  }, 
  pending: {
    color: 'orange',
    fontWeight: 'bold',
  }, 
  actionText:{
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  approved: {
    color: 'green',
    fontWeight: 'bold'
  }, 
  approvedBtn: {
    backgroundColor: 'green',
    borderRadius: 15,
    height: 20,
    marginTop: 5
  }, 
  denied: {
    color: 'red',
    fontWeight: 'bold'
  }, 
  denyBtn: {
    backgroundColor: 'red',
    borderRadius: 15,
    height: 20,
    marginTop: 5
  }, 
  centerContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
  }
});
