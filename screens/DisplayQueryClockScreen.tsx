import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Modal, Text, View, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Alert, Button, FlatList } from 'react-native';
import { useEffect, Component, useLayoutEffect} from 'react'
import { IconButton, Colors } from 'react-native-paper';



import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';

import XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system'

export default function DisplayQueryClockScreen({ route, navigation }) {
    
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const[modalVisible,setModalVisible] = useState(false)
  const [detailApp,setDetailApp] = useState([] as any)
  const [recordKey, setRecordKey] = useState('')

  const [totalHours,setTotalHours] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [totalApprovedHours,setTotalApprovedHours] = useState(0)
  const [totalApprovedMinutes, setTotalApprovedMinutes] = useState(0)

  const {firstName, lastName, userId, ethnicity, sex, startDate, stopDate} = route.params

  useEffect(() => {
    
    let query = firebase.firestore()
       .collection('ClockInsOuts')
       .where('in_approved' , 'in', ['approved', 'pending', 'denied'])

    if(firstName != '') {query = query.where('firstName', '==', firstName)}
    if(lastName != '') {query = query.where('lastName', '==', lastName)}
    if(userId != '') {query = query.where('userid', '==', userId)}
    if(ethnicity != '') {query = query.where('ethnicity', '==', ethnicity)}
    if(sex != '') {query = query.where('sex', '==' , sex)}
    if(startDate != '') {query = query.where('date' ,'>=', startDate)}
    if(stopDate != '') {query = query.where('date', '<=', stopDate)}

    const constQuery = query

    const subscriber = constQuery
       .onSnapshot(querySnapshot => {
         setTotalApprovedHours(0);
         setTotalApprovedMinutes(0);
         setTotalHours(0);
         setTotalMinutes(0);
         const helperRecords = [] as any;
         var temptotalHours = 0;
         var temptotalMinutes = 0;
         var temptotalApprovedHours = 0;
          var temptotalApprovedMinutes = 0;
         querySnapshot.forEach(documentSnapshot => {
           var data = documentSnapshot.data();
           helperRecords.push({
           ...data,
           key: documentSnapshot.id
           });
           temptotalHours += data.hoursElapsed;
           temptotalMinutes += data.minutesElapsed;
           if (data.in_approved == 'approved' && data.out_approved == 'approved'){
            temptotalApprovedHours += data.hoursElapsed;
            temptotalApprovedMinutes += data.minutesElapsed;
          }
         });
         setRecords(helperRecords);

         temptotalHours += Math.floor(temptotalMinutes/60);//integer division
         temptotalMinutes = temptotalMinutes % 60;//modulo
         temptotalApprovedHours += Math.floor(temptotalApprovedMinutes/60);//integer division
         temptotalApprovedMinutes = temptotalApprovedMinutes % 60;//modulo

         setTotalHours(temptotalHours);
         setTotalMinutes(temptotalMinutes);
         setTotalApprovedHours(temptotalApprovedHours);
         setTotalApprovedMinutes(temptotalApprovedMinutes);
         setLoading(false);

     });
    return () => subscriber();
  } ,[]);
//array of arrays format
const get_aoa_data = () => {
  const header = ['email','is currently clocked in','clock in date','clock in time',
            'clock out date','clock out time','clock in approved','clock out approved','Hours Elapsed','Minutes Elapsed'];
  var aoa = [header];
  records.forEach(element => {
    var cur = [];
    //there's probably a toString-like thing I could do, but this was easier
    cur.push(element.userid);
    cur.push(element.currently_clocked_in);
    cur.push(element.date);
    cur.push(element.in_time);
    cur.push(element.out_date);
    cur.push(element.out_time);
    cur.push(element.in_approved);
    cur.push(element.out_approved);
    cur.push(element.hoursElapsed);
    cur.push(element.minutesElapsed);
    cur.push(element.ethnicity);
    cur.push(element.sex);
    aoa.push(cur);
  });
  return aoa;
}

async function writeToCSV () {

  // https://stackoverflow.com/a/60926972 was used to create this function
  
  //get data as an array of arrays
  const aoa_data = get_aoa_data();

  //convert to an individual sheet
  var worksheet = XLSX.utils.aoa_to_sheet(aoa_data);
  
  //make new workbook
  var workbook = XLSX.utils.book_new();
  
  //add the sheet to the workbook (name only matters if xlsx format)
  XLSX.utils.book_append_sheet(workbook,worksheet,"Volunteer Records");
  
  //create file, see https://docs.sheetjs.com/#writing-options
  const wbout = XLSX.write(workbook, {type:'base64',bookType:'csv'});
  
  //write file to a cache file
  const uri = FileSystem.cacheDirectory + 'tesverify.csv'
  await FileSystem.writeAsStringAsync(uri,wbout, {encoding: FileSystem.EncodingType.Base64});
  
  //open share dialog
  await Sharing.shareAsync(uri, {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'MyWater data',
    UTI: 'com.microsoft.excel.xlsx'
  });
}
  const handleView =  (recordkey) => {
    //console.log(recordkey)
    setRecordKey(recordkey)
    const subscriber = firebase.firestore()
    .collection('ClockInsOuts')
       .doc(recordkey)
       .onSnapshot(querySnapshot => {
         const queryDocumentSnapshotData = querySnapshot.data()
         setDetailApp(queryDocumentSnapshotData)
        });

     setModalVisible(true) 
  }

  
  const handleDeleteAlert = (recordkey: any) => {
    Alert.alert(
      'WARNING',
      "Are you sure you want to permanently delete this record? This action CANNOT be undone. ",
       [
         {text: 'Delete', onPress: () => {handleDelete(recordkey); console.log('Delete Pressed');}},
         {text: 'Cancel', onPress: () => {console.log('Cancel Pressed'); }},

       ],
       {cancelable: false},
     );
  }

  const handleDelete = (recordkey: any) => {
    setModalVisible(false)
    firebase.firestore().collection('ClockInsOuts').doc(recordkey).delete()
  } 

const returnForNullDetailApp = (

  <View style={styles.container}>

        <Text style={styles.titleFlatList}>Searching:</Text>
        <Text style = {styles.instructions}> {firstName} {lastName} {userId} {ethnicity} {sex} {startDate} {stopDate}</Text>

        <TouchableOpacity style={styles.exportBtn} onPress={() => {writeToCSV();}}>
            <Text style={styles.exportText} >Export as CSV</Text>
        </TouchableOpacity> 
        <View>
          <Text>Total time logged: {totalHours} hours and {totalMinutes} minutes</Text>
        </View>
        <View>
          <Text>Total approved time logged: {totalApprovedHours} hours and {totalApprovedMinutes} minutes</Text>
        </View>
        <View style={styles.space}></View>
        <View style={styles.row}>
            <Text style={styles.header}>Date</Text>
            <Text style={styles.header}>In</Text>
            <Text style={styles.header}>Out</Text>
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
                        <Text style = {styles.userIdText}>{item.userid}</Text>
                    </View>
                <View style={styles.row}>
                    <Text>{item.date}</Text>
                    <View>
                    <Text>{item.in_time}</Text>
                    <Text style={renderRecordStatus(item.in_approved)}>{item.in_approved}</Text>
                    </View>
                    <View>
                    <Text>{item.out_time}</Text>
                    <Text style={renderRecordStatus(item.out_approved)}>{item.out_approved}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewBtn} onPress={() => {handleView(item.key)}}>
                    <Text style={styles.actionText}>view</Text>
                  </TouchableOpacity> 
                  {/*<IconButton
                    icon="delete"
                    color={Colors.black}
                    size={20}
                    onPress={() => handleDeleteAlert(item.key)}
                  /> */}
                </View>
            )}
            showsVerticalScrollIndicator={false}
            />
        }
       <Button 
        title="LEAVE PAGE" 
        color = "#1C5A7D" 
        onPress={() => navigation.goBack()} />
        <View style={styles.bigSpace}></View>
    </View>


)

if(detailApp == undefined) {return returnForNullDetailApp}

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
           
            <ScrollView style={{height:'90%'}}>              
              <Text style={modalstyles.textStyle}>Name: {detailApp.firstName} {detailApp.lastName}</Text>
              <Text style={modalstyles.textStyle}>Email: {detailApp.userid} </Text>
              <Text style={modalstyles.textStyle}>Sex: {detailApp.sex}</Text>
              <Text style={modalstyles.textStyle}>Ethnicity: {detailApp.ethnicity}</Text>
              <Text style={modalstyles.textStyle}>In Date: {detailApp.date}</Text>
              <Text style={modalstyles.textStyle}>Out Date: {detailApp.out_date}</Text>
              <Text style={modalstyles.textStyle}>In Time: {detailApp.in_time}</Text>
              <Text style={modalstyles.textStyle}>Out Time: {detailApp.out_time}</Text>

              <Text style={modalstyles.textStyle}>In Status: {detailApp.in_approved}</Text>
              <Text style={modalstyles.textStyle}>Out Status: {detailApp.out_approved}</Text>

            </ScrollView>
            <View style={{height: "5%", flexDirection:'row',alignItems:'center',backgroundColor:'white', marginTop: "7%"}}>
            <TouchableOpacity style={styles.deleteButton} 
              onPress={() => {handleDeleteAlert(recordKey)}}><Text style = {styles.actionText}>PERMANENTLY DELETE</Text>
            </TouchableOpacity>
            </View>
            <View style = {styles.bigSpace}></View>
            <View style={{height:"10%", flexDirection:'row',alignItems:'center',backgroundColor:'white', marginBottom: '5%'}}>
            <TouchableOpacity style={modalstyles.openButton} 
              onPress={() => {setModalVisible(false)}}><Text style = {styles.actionText}>CLOSE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.approveButton} onPress={() => {handleApprove(recordKey); setModalVisible(false) }}>
                <Text style={styles.backText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.denyButton} onPress={() => {handleDeny(recordKey); setModalVisible(false)}}>
                <Text style={styles.backText}>Deny</Text>
              </TouchableOpacity>
            
            </View>

            
            
          </View>
        </View>
      </Modal>


        <Text style={styles.titleFlatList}>Searching:</Text>
        <Text style = {styles.instructions}> {firstName} {lastName} {userId} {ethnicity} {sex} {startDate} {stopDate}</Text>

        <TouchableOpacity style={styles.exportBtn} onPress={() => {writeToCSV();}}>
            <Text style={styles.exportText} >Export as CSV</Text>
        </TouchableOpacity> 
        <View>
          <Text>Total time logged: {totalHours} hours and {totalMinutes} minutes</Text>
        </View>
        <View>
          <Text>Total approved time logged: {totalApprovedHours} hours and {totalApprovedMinutes} minutes</Text>
        </View>
        <View style={styles.space}></View>
        <View style={styles.row}>
            <Text style={styles.header}>Date</Text>
            <Text style={styles.header}>In</Text>
            <Text style={styles.header}>Out</Text>
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
                        <Text style = {styles.userIdText}>{item.userid}</Text>
                    </View>
                <View style={styles.row}>
                    <Text>{item.date}</Text>
                    <View>
                    <Text>{item.in_time}</Text>
                    <Text style={renderRecordStatus(item.in_approved)}>{item.in_approved}</Text>
                    </View>
                    <View>
                    <Text>{item.out_time}</Text>
                    <Text style={renderRecordStatus(item.out_approved)}>{item.out_approved}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewBtn} onPress={() => {handleView(item.key)}}>
                    <Text style={styles.actionText}>view</Text>
                  </TouchableOpacity> 
                  {/*<IconButton
                    icon="delete"
                    color={Colors.black}
                    size={20}
                    onPress={() => handleDeleteAlert(item.key)}
                  /> */}
                </View>
            )}
            showsVerticalScrollIndicator={false}
            />
        }
       <Button 
        title="LEAVE PAGE" 
        color = "#1C5A7D" 
        onPress={() => navigation.goBack()} />
        <View style={styles.bigSpace}></View>
  

    </View>

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
    scrollview: {
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: 60,
      paddingBottom: 15,
      color: "#1C5A7D",
      
    },
    itemStyle: {
        height: 100,
        alignItems: 'center', 
        justifyContent: 'center'
     },
    centerContainer: {
        height: Dimensions.get('window').height / 2,
        justifyContent: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      width: 300
    },
    itemStyle2: {
        height: 150,
     
      },
    titleFlatList: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 60,
        color: "#1C5A7D",
      },
      separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
      },
      exportText:{
        color:"white",
        fontWeight: "bold",
        fontSize: 16
      },
  
    logo:{
      fontWeight:"bold",
      fontSize:24,
      color:"#1C5A7D",
      textAlign: 'center',
      marginTop: 60,
      paddingRight: 30, 
      paddingLeft: 30
    },
  
    instructions:{
      fontSize:18,
      color:"#1C5A7D",
      textAlign: 'center',
      paddingRight: 7,
      paddingLeft: 7, 
      marginBottom: 5
    },
    inputView:{
      width:270,
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
    forgot:{
      color:"white",
      fontSize:11
    },
    loginBtn:{
      width:"80%",
      backgroundColor:"#E11383",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop: 20,
      marginBottom: 5
    },
    userIdText: {
        fontSize: 16,
        margin: 15,
        fontWeight: 'bold',
      },
    createAccountBtn:{
      width:"80%",
      backgroundColor:"#E11383",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:10,
      marginBottom:10
    },
    returnToSignInText:{
      color:"black"
    },
    signUpText:{
      color:"white",
      fontSize: 18,
      fontWeight: "bold", 
    },
    input: {
      margin: 5,
      padding: 6,
      borderRadius: 8,
      marginBottom: 8,
      paddingHorizontal: 10,
      backgroundColor: "#eceff1",
    },
    datePickerStyle: {
        width: 200,
        marginTop: 15,
        marginBottom: 5,
      },
      header: {
        fontWeight: 'bold', 
        fontSize: 20
      }, 
      hairline: {
        backgroundColor: 'white', 
        height: 2, 
        width: Dimensions.get('window').width - 10, 
        margin: 2
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
        margin: 10
      }, 
      pending: {
        color: 'orange',
        fontSize: 15,
        fontWeight: 'bold'
      }, 
      approved: {
        color: 'green',
        fontSize: 15,
        fontWeight: 'bold'
      }, 
      denied: {
        color: 'red',
        fontSize: 15,
        fontWeight: 'bold'
      }, 
      exportBtn:{
        width:"80%",
        backgroundColor:"#E11383",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:0,
        marginBottom:10,
      },
      viewBtn: {
        backgroundColor: "#1C5A7D", 
        borderRadius: 10,
        height: 30,
        justifyContent: 'center',
        width: 200,
        marginTop: 15,
        alignSelf: 'center'
      }, 
      actionText:{
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      
    denyButton: {
        width:"30%",
        backgroundColor:"#E11383",
        borderRadius:25,
        height:"100%",
        alignItems:"center",
        justifyContent:"center",
        // marginTop:30,
        // marginBottom:15
    },
    deleteButton: {
      width: "90%",
      backgroundColor:"darkred",
      borderRadius:25,
      height:"100%",
      alignItems:"center",
      justifyContent:"center",
      // marginTop:30,
      // marginBottom:15
  },
    approveButton: {
        width:"30%",
        backgroundColor:"#1C5A7D",
        marginLeft: 10,
        marginRight: 10,
        borderRadius:25,
        height:"100%",
        alignItems:"center",
        justifyContent:"center",
        // marginTop:30,
        // marginBottom:15
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
  })
  
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
      width: "50%",
      backgroundColor: "grey",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      height: "100%",
      justifyContent: 'center',
      alignContent: 'center',
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

  function handleApprove(recordkey: any) {
    firebase.firestore().collection('ClockInsOuts').doc(recordkey).set({
        in_approved: "approved",
        out_approved: "approved"
    }, {merge: true})
  }

  function handleDeny(recordkey: any) {
    firebase.firestore().collection('ClockInsOuts').doc(recordkey).set({
        in_approved: "denied",
        out_approved: "denied"
    }, {merge: true})
  }
