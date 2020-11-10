import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList, ActivityIndicator, Modal,TouchableHighlight, ScrollView } from 'react-native';
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
  const[modalVisible,setModalVisible] = useState(false);
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username


  const [detailApp,setDetailApp] = useState([] as any)
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
        // console.log(viewtype)
        // console.log("in the query^")
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
  // const details = (key) => {

  // }
  /*
    TODO: 
    - capture all pending
    - allow for option to approve/deny
    - allow for editing (separate screen?)
  */
//  console.log(viewtype)
 if (!hasAccess){
   return (
   <View style={styles.container}>
     <Text style={styles.header}> You are not authorized :( </Text>
   </View>
   )
 }
  // console.log(records)
  return (
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

            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>
            <Text style={modalstyles.textStyle}>text for the sake of scrollbar</Text>

            </ScrollView>
            <View style={{height:"10%", flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
              <TouchableOpacity style={styles.approveButton} onPress={() => {approve(detailApp.key,appRef,userEmail);setModalVisible(false) }}>
                <Text style={styles.backText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.denyButton} onPress={() => {deny(detailApp.key,appRef,userEmail);setModalVisible(false)}}>
                <Text style={styles.backText}>Deny</Text>
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

      {/* <TouchableHighlight
        style={modalstyles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={modalstyles.textStyle}>Show Modal</Text>
      </TouchableHighlight> */}

      <View style={{height:'40%'}}>
        {/* <View style={{flex: 1,flexDirection: 'row', alignSelf:'flex-start'}}>
          
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View> */}
        <Text style={styles.titleFlatList}>{viewtype} volunteer applications</Text>
                  {/* TODO: show "no pending records" when records empty. 
                      for some reason, it's currently populating records and then 
                      immediately become empty currently
                  */}
                  {/* {
                    records != [] ?
                      <>  */}
            {/* <View style={styles.space}></View> */}
            <View style={{height:'70%',alignItems:'center'}}> 
              <View style={{height:'55%',width:'100%',alignItems:'center'}}>
                <Text>Select to view pending, approved, or denied applications:</Text>
                  <RadioButton.Group onValueChange={value=> {setViewType(value)}} value={viewtype}>
                    <View style={{flexDirection: 'row'}}>
                      <RadioButton.Item labelStyle={styles.pending} label="Pending" value="pending"/>
                      <RadioButton.Item labelStyle={styles.approved} label="Approved" value="approved"/>
                      <RadioButton.Item labelStyle={styles.denied} label="Denied" value="denied"/>
                    </View>
                  </RadioButton.Group>
                  { viewtype === 'pending' &&
                    <TouchableOpacity style={styles.exportBtn} onPress={() => approveAll(records, appRef,userEmail)}>
                      <Text style={styles.exportText}>Approve All</Text>
                    </TouchableOpacity>
                  }
            
              </View> 
              <View style={styles.space}></View>
              <View style={styles.row}>
                <Text style={styles.header}>Application</Text>
                <Text style={styles.header}>Actions</Text>
              </View>
            </View>
          {/* </>
        :
          <Text style={styles.container}>No Pending Records!</Text>
      } */}
      </View>
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
                    {/* <TouchableOpacity onPress={() => {approve(item.key, appRef,userEmail)}}>
                      <Text style={styles.approved}>approve</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity onPress={() => {deny(item.key,  appRef, userEmail)}}>
                      <Text style={styles.denied}>deny</Text>
                    </TouchableOpacity>  */}
                    {/* <TouchableOpacity onPress={() => {setDetailApp(item); setModalVisible(true)}}>
                      <Text style={styles.pending}>details</Text>
                    </TouchableOpacity>  */}
                    <TouchableOpacity onPress={() => {setDetailApp(item); setModalVisible(true)}}>
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
  },
  backButton: {
    width:"20%",
    backgroundColor:"#E11383",
    borderRadius:25,
    height:25,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    marginBottom:15
  },
  backText: {
    marginTop:10,
    color:"white",
    justifyContent: 'center',
    alignContent: 'center',
    fontWeight :'bold',
    fontSize: 16, 
    paddingBottom: 10
  },

  denyButton: {
    width:"40%",
    backgroundColor:"#E11383",
    borderRadius:25,
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    // marginTop:30,
    // marginBottom:15
  },
  approveButton: {
    width:"60%",
    backgroundColor:"#1C5A7D",
    borderRadius:25,
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    // marginTop:30,
    // marginBottom:15
  },

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