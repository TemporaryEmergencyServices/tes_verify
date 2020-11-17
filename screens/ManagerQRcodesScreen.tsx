import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList, ActivityIndicator, Modal,TouchableHighlight, ScrollView, TextInput } from 'react-native';
import { useEffect, useState } from 'react'

import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
// import { ManagerStatusButtons } from '../components/ManagerStatusButtons'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { RadioButton } from 'react-native-paper';
import  QRCode  from 'react-native-qrcode-svg';
export default function ManagerQRcodesScreen({navigation}) {

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const [codeRef, setcodeRef] = useState({})
  
  const[hasAccess,setHasAccess] = useState(false)
  const[viewtype,setViewType] = useState("enabled")
  const[modalVisible,setModalVisible] = useState(false);
  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username

  const [newNickname,setNewNickname] = useState('')
  const [detailCode,setDetailCode] = useState([] as any)
  const [qrValue, setQRvalue] = useState('Default QR')
  const [showQR, setShowQR] = useState(false) 
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
          else {setHasAccess(false)}//FIXME: set to false when not debugging
         }
     });

     const subscriber = firebase.firestore()
     .collection('QRcodes')
     setcodeRef(subscriber)

    const pendingQuery = subscriber
    .where('active','==',viewtype)
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

 if (!hasAccess){
   return (
   <View style={styles.container}>
     <Text style={styles.header}> You are not authorized :( </Text>
   </View>
   )
 }

 const createQRrecord = async () => {
  const today = new Date()
  const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
   // + " " + (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
  const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
  const dateTime = date+" " + time
  var docRef = await firebase.firestore().collection('QRcodes').add({
          createdBy: userEmail,
          createDate: dateTime,
          updatedBy: userEmail,
          updateDate: dateTime,
          active: "enabled",
          nickname: newNickname
  }).then(function(docRef) {() =>
    setQRvalue(docRef.id);
  });

  Alert.alert(
   'QR code created!',
   "Press OK to continue.",
    [
      {text: 'OK', onPress: () => {console.log('OK Pressed'); }},
    ],
    {cancelable: false},
    );
  }//do nothing for now

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
            <Text style={modalstyles.textStyle}>Code nickname: {detailCode.nickname}</Text>
            <Text style={modalstyles.textStyle}>Status: {detailCode.active}</Text>
            <Text style={modalstyles.textStyle}>Created at: {detailCode.createDate} </Text>
            <Text style={modalstyles.textStyle}>Created by: {detailCode.createdBy} </Text>
            <Text style={modalstyles.textStyle}>Last updated at: {detailCode.updateDate} </Text>
            <Text style={modalstyles.textStyle}>Last updated by: {detailCode.updatedBy}</Text>
            {showQR && <QRCode value={qrValue} />}
            

            </ScrollView>
            
            <View style={{height:"10%", flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
              
              <TouchableOpacity style={styles.approveButton} onPress={() => {makeActive(detailCode.key,codeRef,userEmail);setModalVisible(false) }}>
                <Text style={styles.backText}>Enable</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.denyButton} onPress={() => {makeDisabled(detailCode.key,codeRef,userEmail);setModalVisible(false)}}>
                <Text style={styles.backText}>Disable</Text>
              </TouchableOpacity>
            </View>
        
            
          </View>
        </View>
      </Modal>



      <View style={{height:'40%'}}>

        <Text style={styles.titleFlatList}>{viewtype} QR codes</Text>

            <View style={{height:'70%',alignItems:'center'}}> 
              <View style={{height:'55%',width:'100%',alignItems:'center'}}>
                <Text style={styles.instructionsText}>Select to view enabled or disabled QR codes:</Text>
                  <RadioButton.Group onValueChange={value=> {setViewType(value)}} value={viewtype}>
                    <View style={{flexDirection: 'row', paddingLeft: 20}}>
                      <RadioButton.Item labelStyle={styles.enabled} label="Enabled" value="enabled"/>
                      <RadioButton.Item labelStyle={styles.disabled} label="Disabled" value="disabled"/>
                    </View>
                  </RadioButton.Group>
                  
            
              </View>
              <View>
                <TouchableOpacity onPress={() => createQRrecord(newNickname,codeRef)}>
                  <Text>Generate new QR code with nickname: </Text>  
                </TouchableOpacity>  
                
                <View style={styles.inputView} >
                  <TextInput  
                  style={styles.inputText}
                  placeholder="Nickname" 
                  placeholderTextColor="white"
                  onChangeText={text => setNewNickname(text)}/>
                  </View>

              </View> 
              <View style={styles.space}></View>
              <View style={styles.row}>
                <Text style={styles.header}>Nickname</Text>
                <Text style={styles.header}>Actions</Text>
              </View>
            </View>

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
                      {item.nickname}</Text>
                      <Text style={renderRecordStatus(item.active)}>Status: {item.active}</Text> </Text>
                  <View>

                    <TouchableOpacity style={styles.viewBtn} onPress={() => {setDetailCode(item); setQRvalue(item.key); setShowQR(true); setModalVisible(true)}}>
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


function makeActive(key: String, appRef: any, userEmail: String) {
    const today = new Date()
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    const dateTime = date+ " " + time
    appRef.doc(key).set({
      active: "enabled",
      updatedBy: userEmail,
      updateDate: dateTime
    }, { merge: true })

}

function makeDisabled(key: String, appRef: any, userEmail: String) {
    const today = new Date()
    const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
    const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
    const dateTime = date+ " " + time
    appRef.doc(key).set({
        active: "disabled",
        updatedBy: userEmail,
        updateDate: dateTime
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
  if (status === "enabled") {
    return styles.enabled
  } else if (status === "disabled") {
    return styles.disabled
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
    color: 'orange',
    fontWeight: 'bold'
  }, 
  enabled: {
    color: 'green',
    fontWeight: 'bold'
  }, 
  disabled: {
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
  input: {
    margin: 5,
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: "#eceff1",
  },
  inputView:{
    width:"90%",
    backgroundColor:"#2B2E32",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding: 20,
    paddingRight: 40,
    
  },
  inputText:{
    height:50,
    color:"white"
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
  },


});