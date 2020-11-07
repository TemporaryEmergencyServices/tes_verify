import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
// import { ManagerStatusButtons } from '../components/ManagerStatusButtons'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

export default function ManagerApproveApplicationScreen() {

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const [clockRef, setClockRef] = useState({})

  const[hasAccess,setHasAccess] = useState(false)


  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.email

  useEffect(() => {
    let unmounted = false
    const roleSubscriber = firebase.firestore()
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
              setHasAccess(true)
            
            }
          else {setHasAccess(true)}//FIXME: set to false when not debugging
         }
     });

     const subscriber = firebase.firestore()
     .collection('volunteers')
     setClockRef(subscriber)

    const pendingQuery = subscriber
    .where('approved','==','pending')
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
    return () => {pendingQuery(); roleSubscriber(); unmounted=true};
  }, [])

  /*
    TODO: 
    - capture all pending
    - allow for option to approve/deny
    - allow for editing (separate screen?)
  */
 console.log(hasAccess)
 if (!hasAccess){
   return (
   <View style={styles.container}>
     <Text style={styles.header}> You are not authorized :( </Text>
   </View>
   )
 }
  return (
    <View style={styles.container}>
      <Text style={styles.titleFlatList}>Manager Approvals</Text>
      {/* TODO: show "no pending records" when records empty. 
          for some reason, it's currently populating records and then 
          immediately become empty currently
      */}
      {/* {
        records != [] ?
          <>  */}
            <View style={styles.space}></View>
            <TouchableOpacity style={styles.exportBtn} onPress={() => approveAll(records, clockRef,userEmail)}>
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
                  <Text style={styles.space}>{item.userid}</Text>
                </View>
                <View style={styles.row}>
                  <Text>{item.date}</Text>
                  <View>
                    <Text>{item.in_time}</Text>
                    <Text style={renderRecordStatus(item.approved)}>{item.approved}</Text>
                    {/* TODO: modularize approve/deny component */}
                    <TouchableOpacity onPress={() => {approve(item.key, "in", clockRef,userEmail)}}>
                      <Text style={styles.approved}>approve</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={() => {deny(item.key, "in", clockRef)}}>
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

// FIXME: this may even approve those records that 
// are no longer displaying or have been previously denied, 
// must test this
function approveAll(records: any, clockRef: any, userEmail: String) {
  records.forEach(record => {
    approve(record.key, "in", clockRef, userEmail)
    approve(record.key, "out", clockRef, userEmail)
  })
}

function approve(key: String, type: String, appRef: any, userEmail: String) {
    appRef.doc(key).set({
      approved: "approved",
      approvedBy: userEmail,
    }, { merge: true })

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
