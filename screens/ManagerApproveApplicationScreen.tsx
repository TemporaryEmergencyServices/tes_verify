import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList, ActivityIndicator, Modal,TouchableHighlight, ScrollView } from 'react-native';
import { useEffect, useState } from 'react'
import { TextInput } from 'react-native'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
// import { ManagerStatusButtons } from '../components/ManagerStatusButtons'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { RadioButton } from 'react-native-paper';

export default function ManagerApproveApplicationScreen({navigation}) {

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const [appRef, setAppRef] = useState({where: (a, b, c) => {}})
  const [searchText, setSearchText] = useState('')
  
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
           if (queryDocumentSnapshotData.role == 'administrator' || queryDocumentSnapshotData.role == 'superuser'){
              setHasAccess(true)
            }
          else {setHasAccess(false)}
         }
     });

     const subscriber = firebase.firestore().collection('volunteers')
     setAppRef(subscriber)

    pendingQuery(subscriber).then(resultRecords => setRecords(resultRecords))
    setLoading(false) 
    return () => { roleSubscriber(); unmounted=false};
  }, [viewtype])//need to pass the viewtype variable to useEffect so it uses the latest state value
  // const details = (key) => {

  // }
  /*
    TODO: 
    - capture all pending
    - allow for option to approve/deny
    - allow for editing (separate screen?)
  */

  const pendingQuery = async (ref) => {
    const resultRecords = await ref.where('approved','==',viewtype)
    .get().then(querySnapshot => {
      const helperRecords = [] as any;
      querySnapshot.forEach(documentSnapshot => {
          helperRecords.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id
          })
      }) 
      return helperRecords
    })
    return await resultRecords
  }

  const search = async (userid) => {
    if (!userid) {
      setRecords(await pendingQuery(appRef))
      return
    }

    // determine if they entered email or name
    const isEmail = userid.includes("@") && userid.includes(".com") ? true : false
    if (isEmail) {
      // pull up records by email
      var ref = appRef.where("userid", "==", userid)
      const resultRecords = await pendingQuery(ref)
      setRecords(resultRecords)
    } else {
      // pull up records by name
      // check if first and last name typed
      var firstNameMatches, lastNameMatches
      if (userid.includes(' ')) {
        const [ firstName, lastName ] = userid.split(' ')
        firstNameMatches = await pendingQuery(appRef.where("firstName", "==", firstName))
        lastNameMatches = await pendingQuery(appRef.where("lastName", "==", lastName))
      } else {
        // only first name or last name typed
        firstNameMatches = await pendingQuery(appRef.where("firstName", "==", userid))
        lastNameMatches = null ? firstNameMatches : await pendingQuery(appRef.where("lastName", "==", userid))
      }
      
      if (firstNameMatches && lastNameMatches) {
        setRecords(firstNameMatches.concat(lastNameMatches))
      } else if (firstNameMatches && !lastNameMatches) {
        setRecords(firstNameMatches)
      } else {
        setRecords(lastNameMatches)
      }
    }
  }

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
              <TouchableOpacity style={modalstyles.openButton} onPress={() => {setModalVisible(false)}}><Text>Close</Text></TouchableOpacity>
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
              <TouchableOpacity style={styles.approveButton} onPress={() => {approve(detailApp.key,appRef,userEmail);setModalVisible(false) }}>
                <Text style={styles.backText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.denyButton} onPress={() => {deny(detailApp.key,appRef,userEmail);setModalVisible(false)}}>
                <Text style={styles.backText}>Deny</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{height:'40%'}}>
        <Text style={styles.titleFlatList}>{viewtype} volunteer applications</Text>
                  {/* TODO: show "no pending records" when records empty. 
                      for some reason, it's currently populating records and then 
                      immediately become empty currently
                  */}
                  {
                    records != [] ?
                      <> 
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems:'center' }}> 
              <View style={{ width:'100%', alignItems: 'center' }}>
                <Text style={styles.instructionsText}>Select to view pending, approved, or denied applications:</Text>
                  <RadioButton.Group onValueChange={value=> {setViewType(value)}} value={viewtype}>
                    <View style={{flexDirection: 'row', paddingLeft: 20}}>
                      <RadioButton.Item labelStyle={styles.pending} label="Pending" value="pending"/>
                      <RadioButton.Item labelStyle={styles.approved} label="Approved" value="approved"/>
                      <RadioButton.Item labelStyle={styles.denied} label="Denied" value="denied"/>
                    </View>
                  </RadioButton.Group>
                  { 
                    viewtype === 'pending' &&
                    <TouchableOpacity style={styles.exportBtn} onPress={() => approveAll(records, appRef,userEmail)}>
                      <Text style={styles.exportText}>Approve All</Text>
                    </TouchableOpacity>
                  }
              </View> 
              <View style={styles.row}>
                <TextInput
                  style={styles.searchBox}
                  onChangeText={text => setSearchText(text)}
                  value={searchText}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={() => { search(searchText) }}>
                  <Text style={styles.backText}>Search</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <Text style={styles.header}>Application</Text>
                <Text style={styles.header}>Actions</Text>
              </View>
            </View>
          </>
        :
          <Text style={styles.container}>No Pending Records!</Text>
      }
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
                    <TouchableOpacity style={styles.viewBtn} onPress={() => {setDetailApp(item); setModalVisible(true)}}>
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
  instructionsText:{
    fontSize: 16, 
    marginRight: '5%',
    marginLeft: '5%',
    textAlign: 'center'
  },
  exportBtn:{
    width:"60%",
    backgroundColor:"#13AA52",
    borderRadius:15,
    height:40,
    alignItems:"center",
    justifyContent:"center",
    marginTop:0,
    marginBottom:10,
  },
  searchBox: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 10,
    fontSize: 20,
    flex: 3, 
    marginTop: 10,
    marginBottom: 10, 
    marginRight: 10,
  },
  searchBtn: {
    paddingHorizontal: 5,
    backgroundColor:"#13AA52",
    borderRadius:15,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10,
    flex: 1
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
    paddingLeft: 20
  }, 
  space: {
    margin: 15
  }, 
  bigSpace: {
    margin: 100
  }, 
  pending: {
    color: 'orange',
    fontWeight: 'bold'
  }, 
  approved: {
    color: 'green',
    fontWeight: 'bold'
  }, 
  denied: {
    color: 'red',
    fontWeight: 'bold'
  },
  view: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold'
  }, 
  viewBtn: {
    backgroundColor: "#1C5A7D", 
    fontSize: 20,
    borderRadius: 10,
    padding: 10
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