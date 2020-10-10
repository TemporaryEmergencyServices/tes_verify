import * as React from 'react';
import { StyleSheet, Button, Alert } from 'react-native';
import firebase from '../firebase.js'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { logout } from '../actions'


export default function SettingsScreen({ navigation }) {
  const user = useSelector((state: RootStateOrAny) => state.user)
  const dispatch = useDispatch()


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
      <Button title="Logout" onPress={handleLogout}></Button>
      <Text>Email: {user.email}</Text>
      <Text style={styles.title}>Change your profile info here! But not yet. Check back next sprint:)</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
