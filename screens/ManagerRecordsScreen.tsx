import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../types';

export default function ManagerRecordsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Use this screen as a home base for searching clock ins, creating clock ins, and updated clock ins. </Text>
      <TouchableOpacity style={styles.appBtns} onPress={() => {navigation.push('CreateClockRecordScreen') }}>
        <Text style={styles.signOutText}>Create Clock In/Out Record</Text>
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
