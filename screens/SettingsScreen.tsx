import * as React from 'react';
import { StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import firebase from '../firebase.js'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { logout } from '../actions'
import { useEffect, useState, Component, useLayoutEffect} from 'react'



export default function SettingsScreen({ navigation }) {
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.email
  const dispatch = useDispatch()
  
  //appState gives application status. Can be none (has not submitted before), pending, approved, or denied.
  //the status of appState is determined in the below useEffect.

  const [appState, setAppState] = useState("none")
  

  useEffect(() => {
    const subscriber = firebase.firestore()
       .collection('volunteers')
       .where('userid' , '==', userEmail)
       .onSnapshot(querySnapshot => {
        if(querySnapshot.empty) {
          setAppState("none")
         }

        else{
         const queryDocumentSnapshot = querySnapshot.docs[0];
         const queryDocumentSnapshotData = queryDocumentSnapshot.data()
         if (queryDocumentSnapshotData.approved == 'pending'){
            console.log("has pending app")
            setAppState("pending")
          
          }
          else {
            if(queryDocumentSnapshotData.approved == 'approved') {
              console.log("has approved app")
              setAppState("approved")
            }
            if(queryDocumentSnapshotData.approved == 'denied') {
              console.log("has denied app")
              setAppState("denied")
            }
          }
        }
     });

    return () => subscriber();
  } ,[]);

  const goToApply = () => navigation.push('ApplyScreen')
  const goToSignIn = () => navigation.replace('SignInScreen')
  const goToApprove= () => navigation.navigate('ManagerApproveApplicationScreen')

  const handleApply = () => {goToApply()}
  const handleApprove = () => {goToApprove()}
  const handleLogout = () => {
    firebase.auth().signOut()
    .then(() => dispatch(logout()))
    .then(goToSignIn)
    .catch(error => {
      Alert.alert(
        "Error",
        error.message,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    })
  }

  return (
    
    <View style={styles.container}>
      
  <Text style={styles.title}> {user.email}, {appState}</Text>

      <TouchableOpacity style={styles.appBtns} onPress = {handleApply}>
        <Text style={styles.signOutText}>Apply to be a volunteer</Text>
      </TouchableOpacity> 
      
      {/* 
      <TouchableOpacity style={styles.appBtns} onPress = {handleApprove}>
        <Text style={styles.signOutText}>Approve volunteer applications</Text>
      </TouchableOpacity> 
      */}
     

      <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>  
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
    textAlign: 'center',
    color: "#1C5A7D"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  appBtns:{
    width:"80%",
    backgroundColor:"#1C5A7D",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  signOutBtn:{
    width:"80%",
    backgroundColor:"#E11383",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  signOutText:{
    marginTop:10,
    color:"white",
    justifyContent: 'center',
    alignContent: 'center',
    fontWeight :'bold',
    fontSize: 18, 
    paddingBottom: 10
  }
});
