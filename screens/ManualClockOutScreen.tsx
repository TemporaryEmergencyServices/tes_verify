import firebase from '../firebase.js'
import React, { useEffect, useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button, 
  Dimensions, ActivityIndicator, FlatList, Modal } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';

export default function CreateClockRecordsScreen({  navigation  }) {
    const [clockedInRecords, setClockedInRecords] = useState({})
    const [outTime, setOutTime] = useState('')
    const [searchText, setSearchText] = useState('')
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [records, setRecords] = useState([])
    const [detailRecord, setDetailRecord] = useState({userid: null, date: null, in_time: null})

    useEffect(() => {
        const subscriber = firebase.firestore().collection('ClockInsOuts')
        .where('currently_clocked_in', '==', true)
        .get().then(querySnapshot => {
            var helperRecords = []
            querySnapshot.forEach(doc => {
                helperRecords.push(doc.data())
            })
            return helperRecords
        }).then(result => {
            setRecords(result)
            setLoading(false)
        })
    }, [])

    // search through currently clocked in records to find matching name (client side)
    const search = async (userid) => {
      var recordRef
      if (searchText) {
        recordRef = await firebase.firestore().collection('ClockInsOuts')
        .where('userid', '==', userid)
        .where('currently_clocked_in', '==', true)
      } else {
        recordRef = firebase.firestore().collection('ClockInsOuts')
        .where('currently_clocked_in', '==', true)
      }
      recordRef
      .get().then(querySnapshot => {
          var helperRecords = []
          querySnapshot.forEach(doc => {
              helperRecords.push(doc.data())
          })
          return helperRecords
      }).then(result => {
          setRecords(result)
      })
    }

    const submitOutTime = async (userid, date, inTime) => {
      var errorMessage = ''
      if (outTime == '') {errorMessage = 'Please enter the clock out time.'}
      if (outTime.substring(2, 3) != ':' || outTime.length != 8 || outTime.substring(5,6) != ' ' || (outTime.substring(6,8) != 'AM' && outTime.substring(6,8) != 'PM'))
      {errorMessage = 'Please enter the clock out time in the format HH:MM AM/PM. Example: 01:35 PM'}
      
      if (errorMessage != '') {
        Alert.alert(
          'Error! Incomplete submission.',
          errorMessage,
           [
             {text: 'OK', onPress: () => {console.log('OK Pressed'); return }},
           ],
           {cancelable: false},
        )
      } else {

        var inAMPM = inTime.substring(6,8);
        var inHours = parseInt(inTime.substring(0,2));

        if(inAMPM == 'PM' && inHours!=12) {inHours = inHours + 12}
        var inMins = parseInt(inTime.substring(3,5));

        var outAMPM = outTime.substring(6,8);
        var outHours = parseInt(outTime.substring(0,2));

        if(outAMPM == 'PM' && outHours!=12) {outHours = outHours + 12}
        var outMins = parseInt(outTime.substring(3,5));

        var hoursElapsed = outHours - inHours;
        var minutesElapsed = outMins - inMins;
        if (minutesElapsed < 0){
          minutesElapsed += 60;
          hoursElapsed -= 1;
        }
        const recordRef = firebase.firestore().collection('ClockInsOuts')
        .where('userid', '==', userid)
        .where('date', '==', date)
        .where('in_time', '==', inTime)
        
        recordRef.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              
              out_time: outTime,
              currently_clocked_in: false,
              hoursElapsed: hoursElapsed,
              minutesElapsed: minutesElapsed,
              out_approved: "approved"
            })
          })
        }).then(() => {
          search(userid)
        })
        setModalVisible(false)
      }
    }

    return (
    <View style={styles.container}>
      <Text style={styles.logo}>Manually Clock Out a Volunteer</Text>
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          placeholder="Search for volunteer by email" 
          placeholderTextColor="white"
          onChangeText={text => setSearchText(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={() => { search(searchText) }}>
        <Text style={styles.signUpText}>Search</Text>
      </TouchableOpacity>
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
              <Text style={modalstyles.textStyle}>Username: {detailRecord.userid}</Text>
              <Text style={modalstyles.textStyle}></Text>
              <Text style={modalstyles.textStyle}>Clocked In:</Text>
              <Text style={modalstyles.textStyle}>{detailRecord.date} at {detailRecord.in_time}</Text>
              <View style={styles.bigSpace}></View>
              <View style={styles.inputView} >
                <TextInput
                  style={styles.inputText}
                  placeholder="Out Time HH:MM AM/PM" 
                  placeholderTextColor="white"
                  onChangeText={text => setOutTime(text)}
                />
              </View>
              <TouchableOpacity 
                style={styles.loginBtn} 
                onPress={() => {submitOutTime(detailRecord.userid, detailRecord.date, detailRecord.in_time) }}
              >
                <Text style={styles.signUpText}>Submit Out Time</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalstyles.openButton} onPress={() => {setModalVisible(false)}}><Text style={styles.signUpText}>Close</Text></TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>
      {
        records.length === 0 &&
        <Text style={{marginTop: 30}}>No one is currently clocked in!</Text>
      }
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
                              <Text>
                                <Text>{item.userid}</Text>
                                {"\n"}{item.date}{"\n"}
                                <Text>{item.in_time}</Text>
                              </Text>
                              <TouchableOpacity style={styles.clockOutBtn} onPress={() => {setDetailRecord(item); setModalVisible(true)}}>
                                  <Text style={styles.signUpText}>Clock Out</Text>
                              </TouchableOpacity>
                          </View>
                  </View>
              )}
              showsVerticalScrollIndicator={false}
          />
      }
      <Button 
          title="LEAVE PAGE" 
          color = "#1C5A7D" 
          onPress={() => {  navigation.goBack() }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 15,
    color: "#1C5A7D",
    
  },
  bigSpace: {
    margin: 10
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
  centerContainer: {
    height: Dimensions.get('window').height / 2,
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:24,
    color:"#1C5A7D",
    marginBottom:10,
    textAlign: 'center',
    marginTop: 60,
    paddingRight: 30, 
    paddingLeft: 30
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20
  }, 
  column: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    alignItems:'center' 
  },
  instructions:{
    fontSize:18,
    color:"#1C5A7D",
    marginBottom:40,
    textAlign: 'center',
    paddingRight: 7,
    paddingLeft: 7
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
    alignSelf: 'center'
    
  },
  inputText:{
    height:50,
    color:"white"
  },
  itemStyle: {
    height: 100,
    alignItems: 'center', 
    justifyContent: 'center'
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
    alignSelf: 'center',
    marginBottom:10
  },
  clockOutBtn: {
    backgroundColor: "#1C5A7D", 
    fontSize: 20,
    borderRadius: 10,
    padding: 10,
    alignContent: 'center'
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
    textAlign: 'center'
  },
  input: {
    margin: 5,
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: "#eceff1",
  }
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
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: "80%",
    alignSelf: 'center',
    height: "17%",
    marginTop: 20
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
})