import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../types';

export default function ManagerRecordsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Volunteer Records </Text>
      <Text style={styles.subTitle}> Create and manage volunteer's clock in and out records here. </Text>
      <View style={styles.bigSpace}></View>
      <TouchableOpacity style={styles.appBtns} onPress={() => {navigation.push('CreateClockRecordScreen') }}>
        <Text style={styles.signOutText}>Create Clock In/Out Record</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.appBtns} onPress={() => { navigation.push('ManualClockOutScreen') }}>
        <Text style={styles.signOutText}>Manual Clock Out Volunteer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.appBtns} onPress={() => { navigation.push('QueryClockScreen') }}>
        <Text style={styles.signOutText}>Get Volunteer Records</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  subTitle: {
    fontSize: 20,
    textAlign: 'center'
  },
  bigSpace: {
    margin: 10
  }, 
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  appBtns:{
    width:"80%",
    backgroundColor:"#1C5A7D",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:13,
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
