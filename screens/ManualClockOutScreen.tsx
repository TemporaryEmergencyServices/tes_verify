import firebase from '../firebase.js'
import React, { useEffect, useState } from 'react';

import { useSelector, RootStateOrAny } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button, Dimensions, ActivityIndicator, FlatList } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';

export default function CreateClockRecordsScreen({  navigation  }) {
    const [clockedInRecords, setClockedInRecords] = useState({})
    const [outTime, setOutTime] = useState('')
    const [searchText, setSearchText] = useState('')
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(true)
    const [records, setRecords] = useState([])
    const [detailRecord, setDetailRecord] = useState({})

    useEffect(() => {
        // automatically get all currently clocked in records
        // where currently_clocked_in == true
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
        
    }

    return (
        // displays searchbar and list of clocked in people
        <View style={styles.container}>
            <Text style={styles.logo}>Manually Clock Out a Volunteer</Text>
            <Text>Search for volunteer by email address</Text>
            <View style={styles.row}>
                <TextInput
                  style={styles.inputText}
                  onChangeText={text => setSearchText(text)}
                  value={searchText}
                />
                <TouchableOpacity style={styles.loginBtn} onPress={() => { search(searchText) }}>
                  <Text style={styles.signUpText}>Search</Text>
                </TouchableOpacity>
            </View>
            <ScrollView 
                style={styles.scrollView}
                centerContent={true} 
                contentContainerStyle={styles.contentContainer} 
            >
                <View style={styles.inputView} >
                <TextInput  
                    style={styles.inputText}
                    placeholder="Out Time" 
                    placeholderTextColor="white"
                    onChangeText={text => setOutTime(text)}/>
                </View>
            </ScrollView>
            {/* <TouchableOpacity style={styles.loginBtn} onPress={}>
                <Text style={styles.signUpText} >SUBMIT</Text>
            </TouchableOpacity> */}
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
                // will render: userid, first/last name, clocked in time and date, button to clock out
                // clock out button will display modal for user
                <FlatList
                    data={records}
                    renderItem={({ item }) => (
                        <View style={styles.itemStyle}>
                            <View style={styles.row}>
                                <Text style={{fontWeight: 'bold'}}>
                                    {item.firstName} {item.lastName}
                                </Text>
                                <Text>{"\n"}{item.userid}{"\n"}</Text>
                            <View>
                                <TouchableOpacity style={styles.clockOutBtn} onPress={() => {setDetailRecord(item); setModalVisible(true)}}>
                                    <Text style={styles.signUpText}>CLOCK OUT</Text>
                                </TouchableOpacity> 
                            </View>
                            </View>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            }

            <Button 
                title="LEAVE PAGE" 
                color = "#1C5A7D" 
                onPress={() => { Alert.alert('Leave Page?',
                "Are you sure you want to leave the page? All progress will be lost.",
                [
                    {text: 'OK', onPress: () => {console.log('OK Pressed'); navigation.goBack() }},
                    {text: 'Cancel', onPress: () => {console.log('Cancel Pressed'); }},
                ],
                    {cancelable: false},
                );
                }} 
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

    marginBottom:10
  },
  clockOutBtn: {
    backgroundColor: "red", 
    fontSize: 20,
    borderRadius: 10,
    padding: 10
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