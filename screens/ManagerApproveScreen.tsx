import * as React from 'react';
import { StyleSheet, Dimensions, Button, Modal, ScrollView, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react'
import { RadioButton } from 'react-native-paper';


import firebase from '../firebase.js'
import '@firebase/firestore';

import { Text, View } from '../components/Themed';
// import { ManagerStatusButtons } from '../components/ManagerStatusButtons'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'

export default function ManagerApproveScreen() {

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const [clockRef, setClockRef] = useState({})
  const[viewtype,setViewType] = useState('In')
  const[modalVisible,setModalVisible] = useState(false)

  const [detailApp,setDetailApp] = useState([] as any)
  //var detailApp = [] as any
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

    const subscriber = firebase.firestore().collection('ClockInsOuts')
    setClockRef(subscriber)
    
    /*if(viewtype == 'In') {
      clockInQuery(subscriber).then(resultRecords => setRecords(resultRecords))
    }
    else{
      clockOutQuery(subscriber).then(resultRecords => setRecords(resultRecords))
    }
    setLoading(false) */
    let clockQuery
    if(viewtype == 'In') {
      clockQuery = subscriber
      .where('in_approved' , '==', 'pending')
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
    }

    else {
      clockQuery = subscriber
      .where('out_approved' , '==', 'pending')
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
    }
    /*const clockInQuery = subscriber
    .where('in_approved' , '==', 'pending')
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
    }); */
    //() => clockInQuery()
    return () => {clockQuery(); unmounted=true};
  }, [viewtype])

  const clockInQuery = async (subscriber) => {
    const resultRecords = await subscriber.where('in_approved' , '==', 'pending')
   .get().then(querySnapshot => {
    const helperRecords = [] as any;
    querySnapshot.forEach(documentSnapshot => {
        helperRecords.push({
        ...documentSnapshot.data(), 
        key: documentSnapshot.id
      })
    })
    return helperRecords;
   })
   return await resultRecords
  }

  
  const clockOutQuery = async (subscriber) => {
    const resultRecords = await subscriber.where('out_approved' , '==', 'pending')
   .get().then(querySnapshot => {
    const helperRecords = [] as any;
    querySnapshot.forEach(documentSnapshot => {
        helperRecords.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id
      })
    })
    return helperRecords;
   })
   return await resultRecords
  }
  
  const handleView =  (volunteerid) => {
    const subscriber = firebase.firestore()
    .collection('volunteers')
       .where('userid' , '==', volunteerid)
       .onSnapshot(querySnapshot => {
        if(querySnapshot.empty) {
        } else {
         const queryDocumentSnapshot = querySnapshot.docs[0];
         const queryDocumentSnapshotData = queryDocumentSnapshot.data()
         setDetailApp(queryDocumentSnapshotData)
         
        }
     });

     setModalVisible(true)
     
  }
  
  const returnForIn = (
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
           
            <ScrollView style={{height:'90%'}}>
              <Text style={modalstyles.textStyle}>Application status: {detailApp.approved}</Text>
              
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
            <TouchableOpacity style={modalstyles.openButton} 
              onPress={() => {setModalVisible(false)}}><Text style = {styles.actionText}>CLOSE</Text>
            </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>
    <View style={{height:'40%'}}>
    <View style={{height:'70%',alignItems:'center'}}> 

    <Text style={styles.titleFlatList}>Pending Clock {viewtype}s </Text>
     <View style={{height:'55%',width:'100%',alignItems:'center'}}>
        <Text style={styles.instructionsText}>Select to view pending clock ins or outs:</Text>
          <RadioButton.Group onValueChange={value=> {setViewType(value); setLoading(true)}} value={viewtype}>
            <View style={{flexDirection: 'row', paddingLeft: 20}}>
              <RadioButton.Item labelStyle={styles.pending} label="Clock Ins" value="In"/>
              <RadioButton.Item labelStyle={styles.approved} label="Clock Outs" value="Out"/>
           </View>
          </RadioButton.Group>
          <TouchableOpacity style={styles.exportBtn} onPress={() => approveAllAlert(records, clockRef, viewtype)}>
            <Text style={styles.exportText}>Approve All</Text>
          </TouchableOpacity> 
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
            <View style={styles.itemStyle2}>
              <View>
                <Text style={styles.userIdText}>{item.userid}</Text>
              </View>
              <View style={styles.row2}>
            <Text style={styles.dateTimeText}>
              {item.date}{"\n"}
              {item.in_time}{"\n"}
              <Text style={renderRecordStatus(item.in_approved)}>{item.in_approved}</Text>
            </Text>
                <View>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => {handleView(item.userid)}}>
                    <Text style={styles.actionText}>view</Text>
                  </TouchableOpacity> 
                </View>
                <View>
                  <TouchableOpacity style={styles.approvedBtn} onPress={() => {approve(item.key, "in", clockRef)}}>
                    <Text style={styles.actionText}>approve</Text>
                  </TouchableOpacity> 
                </View>
                <View>
                  <TouchableOpacity style={styles.denyBtn} onPress={() => {deny(item.key, "in", clockRef)}}>
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


  const returnForOut = (
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
           
            <ScrollView style={{height:'90%'}}>
              <Text style={modalstyles.textStyle}>Application status: {detailApp.approved}</Text>
              
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
            <TouchableOpacity style={modalstyles.openButton} 
              onPress={() => {setModalVisible(false)}}><Text style = {styles.actionText}>CLOSE</Text>
            </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>
    <View style={{height:'34%'}}>
    <View style={{height:'70%',alignItems:'center'}}> 

    <Text style={styles.titleFlatList}>Pending Clock {viewtype}s </Text>
     <View style={{height:'55%',width:'100%',alignItems:'center'}}>
        <Text style={styles.instructionsText}>Select to view pending clock ins or outs:</Text>
          <RadioButton.Group onValueChange={value=> {setViewType(value); setLoading(true)}} value={viewtype}>
            <View style={{flexDirection: 'row', paddingLeft: 20}}>
              <RadioButton.Item labelStyle={styles.pending} label="Clock Ins" value="In"/>
              <RadioButton.Item labelStyle={styles.approved} label="Clock Outs" value="Out"/>
           </View>
          </RadioButton.Group>
          <TouchableOpacity style={styles.exportBtn} onPress={() => approveAllAlert(records, clockRef, viewtype)}>
            <Text style={styles.exportText}>Approve All</Text>
          </TouchableOpacity> 
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
            <View style={styles.itemStyle2}>
              <View>
                <Text style={styles.userIdText}>{item.userid}</Text>
              </View>
              <View style={styles.row2}>
            <Text style={styles.dateTimeText}>
              {item.date}{"\n"}
              {item.out_time}{"\n"}
              <Text style={renderRecordStatus(item.out_approved)}>Out: {item.out_approved}</Text>
            </Text>
                <View>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => {handleView(item.userid)}}>
                    <Text style={styles.actionText}>view</Text>
                  </TouchableOpacity> 
                </View>
                <View>
                  <TouchableOpacity style={styles.approvedBtn} onPress={() => {approve(item.key, "out", clockRef)}}>
                    <Text style={styles.actionText}>approve</Text>
                  </TouchableOpacity> 
                </View>
                <View>
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
  
  if(viewtype == 'In') return (returnForIn)
  else return (returnForOut)

  return (
    
    <View style={styles.container}>
      <Text style={styles.titleFlatList}>Approve Pending {viewtype} </Text>
      {/* TODO: show "no pending records" when records empty. 
          for some reason, it's currently populating records and then 
          immediately become empty currently
      */}
      {/* {
        records != [] ?
          <>  */}
          {/*} REMOVED TO !!! FOR RADIO BUTTON. 
            <View style={styles.space}></View>
            <TouchableOpacity style={styles.exportBtn} onPress={() => approveAll(records, clockRef)}>
              <Text style={styles.exportText}>Approve All</Text>
            </TouchableOpacity>
            <View style={styles.space}></View>
            <View style={styles.row}>
              <Text style={styles.header}>Date</Text>
              <Text style={styles.header}>In</Text>
              <Text style={styles.header}>Out</Text>
        </View> !!!*/}
          {/* </>
        :
          <Text style={styles.container}>No Pending Records!</Text>
      } */}
       <View style={{height:'55%',width:'100%',alignItems:'center'}}>
          <Text style={styles.instructionsText}>Select to view pending clock ins or outs:</Text>
            <RadioButton.Group onValueChange={value=> {setViewType(value); setLoading(true)}} value={viewtype}>
              <View style={{flexDirection: 'row', paddingLeft: 20}}>
                <RadioButton.Item labelStyle={styles.pending} label="Clock Ins" value="In"/>
                <RadioButton.Item labelStyle={styles.approved} label="Clock Outs" value="Out"/>
             </View>
            </RadioButton.Group>
            <TouchableOpacity style={styles.exportBtn} onPress={() => approveAll(records, clockRef, viewtype)}>
              <Text style={styles.exportText}>Approve All</Text>
            </TouchableOpacity> 
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
              <View style={styles.itemStyle2}>
                <View style={styles.row}>
                  <Text style={styles.userIdText}>{item.userid}</Text>
                </View>
                <View style={styles.row2}>
              <Text>{item.date}{"\n"}
                    
              </Text>
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
function approveAllAlert(records: any, clockRef: any, viewtype: any) {
  Alert.alert(
    'Are you sure?!',
    'You are about to approve all pending entries. Are you sure you want to proceed?',
     [
       {text: 'Approve All', onPress: () => {console.log('Approve Pressed'); approveAll(records, clockRef, viewtype)}},
       {text: 'CANCEL', onPress: () => console.log('cancel pressed')}
      ],
     {cancelable: false},
   );
}


function approveAll(records: any, clockRef: any, viewtype: any) {
  if(viewtype == 'In') {
    records.forEach(record => {
      approve(record.key, "in", clockRef)
    })
  }

  else {
    records.forEach(record => {
      approve(record.key, "out", clockRef)
    })
  }
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
  itemStyle2: {
    height: 150,
 
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
    fontSize: 18,
    margin: 15,
    fontWeight: 'bold',
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
    fontSize: 16,
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
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    width: 80,
    marginLeft: -20
  }, 
  denied: {
    color: 'red',
    fontWeight: 'bold'
  }, 
  denyBtn: {
    backgroundColor: 'red',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    width: 60,
    marginLeft: -20
  }, 
  viewBtn: {
    backgroundColor: "#1C5A7D", 
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    width: 60,
    marginLeft: 0
  }, 
  centerContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
  },
  instructionsText:{
    fontSize: 16, 
    marginRight: '5%',
    marginLeft: '5%',
    textAlign: 'center'
  },
  dateTimeText:{
    fontSize: 16,
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
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    width: 100
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
