import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
// import { ManagerStatusButtons } from '../components/ManagerStatusButtons'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { RadioButton } from 'react-native-paper';
export default function ManagerApproveApplicationScreen({navigation}) {

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const [appRef, setAppRef] = useState({})
  
  const[hasAccess,setHasAccess] = useState(false)
  const[viewtype,setViewType] = useState('pending')

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
          else {setHasAccess(false)}//FIXME: set to false when not debugging
         }
     });

     const subscriber = firebase.firestore()
     .collection('volunteers')
     setAppRef(subscriber)

    const pendingQuery = subscriber
    .where('approved','==',viewtype)
    .onSnapshot(querySnapshot => {
        console.log(viewtype)
        console.log("in the query^")
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
    () => pendingQuery();
    return () => {pendingQuery(); roleSubscriber(); unmounted=false};
  }, [viewtype])//need to pass the viewtype variable to useEffect so it uses the latest state value

  /*
    TODO: 
    - capture all pending
    - allow for option to approve/deny
    - allow for editing (separate screen?)
  */
 console.log(viewtype)
 if (!hasAccess){
   return (
   <View style={styles.container}>
     <Text style={styles.header}> You are not authorized :( </Text>
   </View>
   )
 }
  console.log(records)
  return (
    <View style={styles.container}>
      <Text style={styles.titleFlatList}>Pending Volunteer Application Approvals</Text>
      {/*<Button title="Go back" onPress={() => navigation.goBack()} /> */}
      {/* TODO: show "no pending records" when records empty. 
          for some reason, it's currently populating records and then 
          immediately become empty currently
      */}
      {/* {
        records != [] ?
          <>  */}
            <View style={styles.space}></View>
            <View>
                <RadioButton.Group onValueChange={value=> {setViewType(value)}} value={viewtype}>
                    <RadioButton.Item labelStyle={styles.pending} label="Pending" value="pending"/>
                    <RadioButton.Item labelStyle={styles.approved} label="Approved" value="approved"/>
                    <RadioButton.Item labelStyle={styles.denied} label="Denied" value="denied"/>
                </RadioButton.Group>
            </View>
            <TouchableOpacity style={styles.exportBtn} onPress={() => approveAll(records, appRef,userEmail)}>
              <Text style={styles.exportText}>Approve All</Text>
            </TouchableOpacity>
            <View style={styles.space}></View>
            <View style={styles.row}>
              <Text style={styles.header}>Application</Text>
              <Text style={styles.header}>Actions</Text>
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
                  <Text style={{fontSize: 16}}>
                    <Text style={{fontWeight: 'bold'}}>
                      {item.firstName} {item.lastName}</Text>
                      {"\n"}{item.userid}{"\n"}
                      <Text style={renderRecordStatus(item.approved)}>Status: {item.approved}</Text> </Text>
                  <View>
                    {/*<Text style={renderRecordStatus(item.approved)}>Status: {item.approved}</Text>*/}
                    {/* TODO: modularize approve/deny component */}
                    <TouchableOpacity onPress={() => {approve(item.key, appRef,userEmail)}}>
                      <Text style={styles.approved}>approve</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={() => {deny(item.key,  appRef, userEmail)}}>
                      <Text style={styles.denied}>deny</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={() => {view(item.key,  appRef, userEmail)}}>
                      <Text style={styles.view}>VIEW</Text>
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
function approveAll(records: any, appRef: any, userEmail: String) {
  records.forEach(record => {
    approve(record.key,  appRef, userEmail)
    approve(record.key,  appRef, userEmail)
  })
}

function approve(key: String, appRef: any, userEmail: String) {
    const today = new Date()
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    const dateTime = date+ " " + time
    appRef.doc(key).set({
      approved: "approved",
      approvedBy: userEmail,
      approvedDate: dateTime
    }, { merge: true })

}

function deny(key: String, appRef: any, userEmail: String) {
    const today = new Date()
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    const dateTime = date+ " " + time
    appRef.doc(key).set({
        approved: "denied",
        approvedBy: userEmail,
        approvedDate: dateTime
      }, { merge: true })
}

function view(key: String, appRef: any, userEmail: String) { 
  Alert.alert(
    'test',
    'this will hopefully work eventually',
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    {cancelable: false},
  );
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
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
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
  view: {
    color: 'blue', 
    fontSize: 20
  }, 
  centerContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
  }
});
