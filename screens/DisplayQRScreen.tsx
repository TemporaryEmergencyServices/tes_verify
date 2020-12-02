import * as React from 'react';
import { StyleSheet, Dimensions, Button, TouchableOpacity, Alert, FlatList, ActivityIndicator, Modal,TouchableHighlight, ScrollView, TextInput, Share } from 'react-native';
import { useEffect, useState } from 'react'
import { logout } from '../actions'
import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';

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
  const [qrData, setQRdata] = useState([] as any) 

//   const user = useSelector((state: RootStateOrAny) => state.user)
//   const userEmail = user.username
  const userRole = user.role
  const dispatch = useDispatch()


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
           if (queryDocumentSnapshotData.role == 'display_qr'){
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
 const goToSignIn = () => navigation.replace('SignInScreen')
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false);
        }}
      >
        <View style={modalstyles.centeredView}>
          <View style={modalstyles.modalView}>
            <View style={{height:'90%',backgroundColor:'white',alignItems:'center',flexDirection:'column'}}>
              <Text style={modalstyles.textStyle}>QR code nickname: {detailCode.nickname}</Text>
              <Text style={modalstyles.textStyle}>Status: {detailCode.active}</Text>
              <View style={styles.space}></View>
              <Text style={modalstyles.textStyle}>Scan me!</Text>
              <View style={styles.space}></View>
              {/* https://www.npmjs.com/package/react-native-qrcode-svg */}
              <View style={{ width:Dimensions.get('window').width*0.8,height:Dimensions.get('window').width*0.8,flexDirection:'column',alignSelf:"center"}}>
                {showQR && 
                    <QRCode value={qrValue} size={Dimensions.get('window').width*0.8}
                      getRef={(ref) => setQRdata(ref)}  
                    />
                }
              </View>
            </View>
            <View style={{height:"5%", alignItems:'center',backgroundColor:'white',width:'50%'}}>
              <TouchableOpacity style={styles.approveButton} onPress={() => {setModalVisible(false) }}>
                <Text style={styles.backText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{height:'40%'}}> 
        <Text style={styles.titleFlatList}>{viewtype} QR codes</Text>
            <View style={{height:'60%',alignItems:'center'}}> 
              <View>
                <Text style={styles.instructionsText}>Select to view enabled or disabled QR codes:</Text>
                  <RadioButton.Group onValueChange={value=> {setViewType(value)}} value={viewtype}>
                    <View style={{flexDirection: 'row', paddingLeft: 20}}>
                      <RadioButton.Item labelStyle={styles.enabled} label="Enabled" value="enabled"/>
                      <RadioButton.Item labelStyle={styles.disabled} label="Disabled" value="disabled"/>
                    </View>
                  </RadioButton.Group>
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
                       </Text>
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
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>  
    </View>  
  )
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
  column: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    alignItems:'center' 
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
    width:"80%",
    backgroundColor:"#1C5A7D",
    borderRadius:25,
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    // marginTop:30,
    // marginBottom:15
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
    marginTop: 5,
    flexDirection:'column'
  },
  modalView: {
    width: '95%',
    height: '95%',
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },

  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18
  },



});