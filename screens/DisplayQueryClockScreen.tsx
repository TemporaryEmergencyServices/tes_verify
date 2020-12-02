import firebase from '../firebase.js'
import '@firebase/firestore'
import React, { useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Alert, Button, FlatList } from 'react-native';
import { useEffect, Component, useLayoutEffect} from 'react'


import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';

export default function DisplayQueryClcokScreen({ route, navigation }) {
    
const [loading, setLoading] = useState(true)
const [records, setRecords] = useState([] as any)

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
    return () => subscriber();
  } ,[]);


return (
    

    <View style={styles.container}>
        <Text style={styles.titleFlatList}>Searching: {firstName} {lastName} {userId} {ethnicity} {sex} {startDate} {stopDate}</Text>

        <TouchableOpacity style={styles.exportBtn} onPress={() => {}}>
            <Text style={styles.exportText} >Export as CSV</Text>
        </TouchableOpacity> 

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
                <TouchableOpacity style={styles.viewBtn} onPress={() => {}}>
                    <Text style={styles.actionText}>view</Text>
                  </TouchableOpacity> 
                </View>
            )}
            showsVerticalScrollIndicator={false}
            />
        }
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
      paddingLeft: 7
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
        margin: 30
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
        height: 25,
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