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
  const userEmail = user.username
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
        } else {
         const queryDocumentSnapshot = querySnapshot.docs[0];
         const queryDocumentSnapshotData = queryDocumentSnapshot.data()
         setAppState(queryDocumentSnapshotData.approved)
        }
     });

    return () => subscriber();
  } ,[]);

  const goToApply = () => navigation.push('ApplyScreen')
  const goToSignIn = () => navigation.replace('SignInScreen')
  const goToApprove= () => navigation.navigate('ManagerApproveApplicationScreen')

  const handleApply = () => {goToApply()}
  const handleApprove = () => {goToApprove()}
  const handleView = () => {
    Alert.alert(
      ":)",
      "this will be to view submitted, approved, and denied applications but isnt functional yet",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  //reapply needs to be a separate thing i think since it will be updated records.... but i could be wrong

  const handleReApply = () => {
    Alert.alert(
      ":)",
      "this will be to reapply but isnt functional yet.",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

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

  const returnForNone = (
    <View style={styles.container}>
        
        <Text style={styles.largeTitle}> Welcome! </Text>
        <Text style={styles.instructions}> Your email 
          <Text style={styles.emph}> {userEmail}</Text> does not have an associated application. Please submit one below.
          
        </Text>

        <TouchableOpacity style={styles.appBtns} onPress = {handleApply}>
          <Text style={styles.signOutText}>Create Application</Text>
        </TouchableOpacity> 
  
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>  
     
      </View>
  )

  const returnForPending = (
    <View style={styles.container}>
        
        <Text style={styles.largeTitle}> Welcome Back! </Text>
        <Text style={styles.instructions}> Your email 
          <Text style={styles.emph}> {userEmail}</Text> has a pending application. You may view the application using the button below. If you are waiting on approval, please speak with a TES employee.
          
        </Text>

        <TouchableOpacity style={styles.appBtns} onPress = {handleView}>
          <Text style={styles.signOutText}>View Pending Application</Text>
        </TouchableOpacity> 
  
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>  
     
      </View>
  )

  const returnForApproved = (
    <View style={styles.container}>
        
        <Text style={styles.largeTitle}> Welcome Back! </Text>
        <Text style={styles.instructions}> Your email 
          <Text style={styles.emph}> {userEmail}</Text> has an approved application. You may view the application below! If you wish to update any of the information, please speak with a TES manager.
          
        </Text>

        <TouchableOpacity style={styles.appBtns} onPress = {handleView}>
          <Text style={styles.signOutText}>View Approved Application</Text>
        </TouchableOpacity> 
  
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>  
     
      </View>
  )

  const returnForDenied = (
    <View style={styles.container}>
        
        <Text style={styles.largeTitle}> Welcome Back! </Text>
        <Text style={styles.instructions}> Your email 
          <Text style={styles.emph}> {userEmail}</Text> has a denied application. You may view the denied application and re-apply below.
          
        </Text>

        <TouchableOpacity style={styles.appBtns} onPress = {handleView}>
          <Text style={styles.signOutText}>View Denied Application</Text>
        </TouchableOpacity> 

        <TouchableOpacity style={styles.appBtns} onPress = {handleReApply}>
          <Text style={styles.signOutText}>Re-Apply</Text>
        </TouchableOpacity> 
  
  
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>  
     
      </View>
  )

  if (appState == 'none') {return (returnForNone)}
  if (appState == 'pending') {return(returnForPending)}
  if (appState == 'approved') {return(returnForApproved)}
  if (appState == 'denied') {return(returnForDenied)}

  else { return (
    
    <View style={styles.container}>
      
      
      <Text style={styles.title}> {user.email}, {appState}, something has gone wrong</Text>

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
  ); }
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
  emph: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#E11383"
  },
  largeTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#1C5A7D",
    marginBottom: 40
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    color: "#1C5A7D",
    paddingRight: 20, 
    paddingLeft: 20,
    marginBottom: 20
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
    marginTop:13,
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
