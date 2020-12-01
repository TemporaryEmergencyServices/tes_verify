import * as React from 'react';
import { StyleSheet, Button, Alert, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import firebase from '../firebase.js'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { logout } from '../actions'
import { useEffect, useState, Component, useLayoutEffect} from 'react'



export default function SettingsScreen({ navigation }) {
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username
  const userRole = user.role
  const userStorageRef = firebase.storage().ref().child(userEmail + `-profile-image`).getDownloadURL().then((url) => setImgState(url))
  const dispatch = useDispatch()
  const [appID, setAppID] = useState('')

  const[modalVisible,setModalVisible] = useState(false);
  const [detailApp,setDetailApp] = useState([] as any)
  
  //appState gives application status. Can be none (has not submitted before), pending, approved, or denied.
  //the status of appState is determined in the below useEffect.

  const [appState, setAppState] = useState("none")
  const [imgState, setImgState] = useState("none")
  useEffect(() => {
    const subscriber = firebase.firestore()
       .collection('volunteers')
       .where('userid' , '==', userEmail)
       .onSnapshot(querySnapshot => {
        if(querySnapshot.empty) {
          setAppState("none")
        } else {
         const queryDocumentSnapshot = querySnapshot.docs[0];
         setAppID(queryDocumentSnapshot.id)
         const queryDocumentSnapshotData = queryDocumentSnapshot.data()
         setDetailApp(queryDocumentSnapshotData)
         setAppState(queryDocumentSnapshotData.approved)
        }
     });

    return () => subscriber();
  } ,[]);

  const goToApply = () => navigation.push('ApplyScreen')
  const goToUpload= () => navigation.push('UploadProfileImageScreen')
  const goToSignIn = () => navigation.replace('SignInScreen')
  const goToApprove= () => navigation.navigate('ManagerApproveApplicationScreen')

  const handleApply = () => {goToApply()}
  const handleApprove = () => {goToApprove()}
  const handleView = () => {
    /*Alert.alert(
      ":)",
      "this will be to view submitted, approved, and denied applications but isnt functional yet",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );*/
    setModalVisible(true)
  }

  //reapply needs to be a separate thing i think since it will be updated records.... but i could be wrong

  const handleReApply = () => {
    /*Alert.alert(
      ":)",
      "this will be to reapply but isnt functional yet.",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
    */
   navigation.push('ReApplyScreen', {applicationID: appID})
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

  const returnForManager = (
    <View style={styles.container}>
        <Text style={styles.largeTitle}> Welcome! </Text>
        <Text style={styles.instructions}> Email </Text>
        <Text style={styles.emph}>{userEmail}</Text>
        <Text style={styles.instructions}> Role </Text>
        <Text style={styles.emph}>{userRole}</Text>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>  
    </View>
  )

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false);
        }}
      >
        <View style={modalstyles.centeredView}>
          <View style={modalstyles.modalView}>
            {/* <TouchableOpacity style={{position:'absolute',right:'5',top:'5'}} onPress = {() => setModalVisible(false)}>
              <Text style={styles.backText}>X</Text>
            </TouchableOpacity> */}
            <ScrollView style={{height:'90%'}}>
            <Text style={modalstyles.textStyle}>Application status: {detailApp.approved}</Text>
            <Text style={modalstyles.textStyle}>Application submitted: {detailApp.appSubmitDate}</Text>
            {(detailApp.approved == 'approved' || detailApp.approved == 'denied') && 
              
                <Text style={modalstyles.textStyle}>Application {detailApp.approved} by {detailApp.approvedBy} {"\n"}
                {detailApp.approved} at {detailApp.approvedDate}</Text>
              
            }
            <Text style={modalstyles.textStyle}>Name: {detailApp.firstName} {detailApp.lastName}</Text>
            <Text style={modalstyles.textStyle}>Email: {detailApp.userid} </Text>
            <Text style={modalstyles.textStyle}>Phone: {detailApp.phone} </Text>
            <Text style={modalstyles.textStyle}>Sex: {detailApp.sex}</Text>
            <Text style={modalstyles.textStyle}>Ethnicity: {detailApp.ethnicity}</Text>
            <Text style={modalstyles.textStyle}>Address: </Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressLine1}</Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressLine2}</Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressCity}, {detailApp.addressState}. {detailApp.addressZip}</Text>
            <Text style={modalstyles.textStyle}>Emergency contact 1: {detailApp.emergencyName1}</Text>
            <Text style={modalstyles.textStyle}>    Phone: {detailApp.emergencyPhone1}</Text>
            <Text style={modalstyles.textStyle}>Emergency contact 2: {detailApp.emergencyName2}</Text>
            <Text style={modalstyles.textStyle}>    Phone: {detailApp.emergencyPhone2}</Text>

            </ScrollView>
            <View style={{height:"10%", flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
              <TouchableOpacity style={styles.signOutBtn} onPress={() => {setModalVisible(false) }}>
                <Text style={styles.signOutText}>Back</Text>
              </TouchableOpacity>
            </View>
            
            {/* <TouchableHighlight
              style={{ ...modalstyles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={modalstyles.textStyle}>Hide Modal</Text>
            </TouchableHighlight> */}
            
          </View>
        </View>
      </Modal>
        
        <Image style={styles.profileImg} source={{uri: imgState}}/> 
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false);
        }}
      >
        <View style={modalstyles.centeredView}>
          <View style={modalstyles.modalView}>
            {/* <TouchableOpacity style={{position:'absolute',right:'5',top:'5'}} onPress = {() => setModalVisible(false)}>
              <Text style={styles.backText}>X</Text>
            </TouchableOpacity> */}
            <ScrollView style={{height:'90%'}}>
            <Text style={modalstyles.textStyle}>Application status: {detailApp.approved}</Text>
            <Text style={modalstyles.textStyle}>Application submitted: {detailApp.appSubmitDate}</Text>
            {(detailApp.approved == 'approved' || detailApp.approved == 'denied') && 
              
                <Text style={modalstyles.textStyle}>Application {detailApp.approved} by {detailApp.approvedBy} {"\n"}
                {detailApp.approved} at {detailApp.approvedDate}</Text>
              
            }
            <Text style={modalstyles.textStyle}>Name: {detailApp.firstName} {detailApp.lastName}</Text>
            <Text style={modalstyles.textStyle}>Email: {detailApp.userid} </Text>
            <Text style={modalstyles.textStyle}>Phone: {detailApp.phone} </Text>
            <Text style={modalstyles.textStyle}>Sex: {detailApp.sex}</Text>
            <Text style={modalstyles.textStyle}>Ethnicity: {detailApp.ethnicity}</Text>
            <Text style={modalstyles.textStyle}>Address: </Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressLine1}</Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressLine2}</Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressCity}, {detailApp.addressState}. {detailApp.addressZip}</Text>
            <Text style={modalstyles.textStyle}>Emergency contact 1: {detailApp.emergencyName1}</Text>
            <Text style={modalstyles.textStyle}>    Phone: {detailApp.emergencyPhone1}</Text>
            <Text style={modalstyles.textStyle}>Emergency contact 2: {detailApp.emergencyName2}</Text>
            <Text style={modalstyles.textStyle}>    Phone: {detailApp.emergencyPhone2}</Text>
            </ScrollView>
            <View style={{height:"10%", flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
              <TouchableOpacity style={styles.signOutBtn} onPress={() => {setModalVisible(false) }}>
                <Text style={styles.signOutText}>Back</Text>
              </TouchableOpacity>
            </View>
            
            {/* <TouchableHighlight
              style={{ ...modalstyles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={modalstyles.textStyle}>Hide Modal</Text>
            </TouchableHighlight> */}
            
          </View>
        </View>
      </Modal>
        
        <Image style={styles.profileImg} source={{uri: imgState}}/> 
        <Text style={styles.largeTitle}> Welcome Back! </Text>
        <View style={styles.container}>
          <Image style={styles.profileImg} source={{uri: imgState}}/> 
        </View>
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

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false);
        }}
      >
        <View style={modalstyles.centeredView}>
          <View style={modalstyles.modalView}>
            {/* <TouchableOpacity style={{position:'absolute',right:'5',top:'5'}} onPress = {() => setModalVisible(false)}>
              <Text style={styles.backText}>X</Text>
            </TouchableOpacity> */}
            <ScrollView style={{height:'90%'}}>
            <Text style={modalstyles.textStyle}>Application status: {detailApp.approved}</Text>
            <Text style={modalstyles.textStyle}>Application submitted: {detailApp.appSubmitDate}</Text>
            {(detailApp.approved == 'approved' || detailApp.approved == 'denied') && 
              
                <Text style={modalstyles.textStyle}>Application {detailApp.approved} by {detailApp.approvedBy} {"\n"}
                {detailApp.approved} at {detailApp.approvedDate}</Text>
              
            }
            <Text style={modalstyles.textStyle}>Name: {detailApp.firstName} {detailApp.lastName}</Text>
            <Text style={modalstyles.textStyle}>Email: {detailApp.userid} </Text>
            <Text style={modalstyles.textStyle}>Phone: {detailApp.phone} </Text>
            <Text style={modalstyles.textStyle}>Sex: {detailApp.sex}</Text>
            <Text style={modalstyles.textStyle}>Ethnicity: {detailApp.ethnicity}</Text>
            <Text style={modalstyles.textStyle}>Address: </Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressLine1}</Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressLine2}</Text>
            <Text style={modalstyles.textStyle}>    {detailApp.addressCity}, {detailApp.addressState}. {detailApp.addressZip}</Text>
            <Text style={modalstyles.textStyle}>Emergency contact 1: {detailApp.emergencyName1}</Text>
            <Text style={modalstyles.textStyle}>    Phone: {detailApp.emergencyPhone1}</Text>
            <Text style={modalstyles.textStyle}>Emergency contact 2: {detailApp.emergencyName2}</Text>
            <Text style={modalstyles.textStyle}>    Phone: {detailApp.emergencyPhone2}</Text>

            </ScrollView>
            <View style={{height:"10%", flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
              <TouchableOpacity style={styles.signOutBtn} onPress={() => {setModalVisible(false) }}>
                <Text style={styles.signOutText}>Back</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>
        
        <Image style={styles.profileImg} source={{uri: imgState}}/> 
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

  if (userRole == 'administrator' || userRole == 'superuser') {return (returnForManager)}
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
  logo: {
    width: 66,
    height: 58,
  },
  profileImg: {
    width: 200,
    height: 200,
    marginBottom: 20
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
    color: "#E11383", 
    marginBottom: 20
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

const modalstyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});