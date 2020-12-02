import * as React from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useEffect, useState, Component, useLayoutEffect} from 'react'

import firebase from '../firebase.js'

import { Text, View } from '../components/Themed';
// import { analytics } from 'firebase';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import * as Print from 'expo-print'; //might be needed for pdf

import XLSX from 'xlsx';
import {writeFile, readFile} from 'react-native-fs';//might be needed for pdf
import { PermissionsAndroid } from 'react-native';//might be needed for pdf
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system'
/*
Inspired By:

https://rnfirebase.io/firestore/usage-with-flatlists
https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6
*/ 
export default function RecordsScreen() {

  const user = useSelector((state: RootStateOrAny) => state.user)
  const userEmail = user.username

  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([] as any)
  const [totalHours,setTotalHours] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [totalApprovedHours,setTotalApprovedHours] = useState(0)
  const [totalApprovedMinutes, setTotalApprovedMinutes] = useState(0)
  //OLD USE EFFECT WITH REALTIME DATABASE
  //DO NOT DELETE YET - THIS HAS SOME THINGS THAT FIXED SOME WEIRD BUGS
  //DONT WANT TO DELETE UNTIL I KNOW THAT THEY WONT APPEAR WITH FIRESTORE
  
  /*  useEffect(() => {
    var ref = firebase.database().ref("ClockInsOuts/")
    let isCancelled = false
    ref.once("value", function(snapshot){
      const help = [] as any;
      snapshot.forEach(function(recordSnapshot){
        if(recordSnapshot.val().userid == userEmail) {
          const id = recordSnapshot.key
           const recorddata = recordSnapshot.val()
          recorddata['id'] = id
          help.push(recorddata)
        }
      });

      if(!isCancelled){
        setRecords(help) 
        setLoading(false)
      }
    });

    return () => {isCancelled = true}
  }); */

  useEffect(() => {
    
    // var temptotalHours = 0;
    // var temptotalMinutes = 0;
    // var temptotalApprovedHours = 0;
    // var temptotalApprovedMinutes = 0;
    const subscriber = firebase.firestore()
       .collection('ClockInsOuts')
       .where('userid' , '==', userEmail)
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
           helperRecords.push({
           ...documentSnapshot.data(),
           key: documentSnapshot.id
           });
           temptotalHours += documentSnapshot.data().hoursElapsed;
           console.log(documentSnapshot.data().hoursElapsed);
           temptotalMinutes += documentSnapshot.data().minutesElapsed;
           console.log(documentSnapshot.data().minutesElapsed);
           if (documentSnapshot.data().in_approved == 'approved' && documentSnapshot.data().out_approved == 'approved'){
             temptotalApprovedHours += documentSnapshot.data().hoursElapsed;
             temptotalApprovedMinutes += documentSnapshot.data().minutesElapsed;
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
  return (
    <View style={styles.container}>
      <Text style={styles.titleFlatList}>Volunteer Records for {userEmail}</Text>

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
              <View style={styles.itemStyle}>
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
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
      }
      <View style={styles.bigSpace}></View>
    </View>
  )
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemStyle: {
     height: 100,
     alignItems: 'center', 
     justifyContent: 'center'
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
    margin: 100
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
  centerContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
  }
})

