import * as React from 'react';
import { StyleSheet, Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { logout } from '../actions'

export default function SettingsScreen() {
  const user = useSelector((state: RootStateOrAny) => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    // firebase.auth.signOut()
    // .then()
  }
  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={() => dispatch(logout())}></Button>
      <Text>{user.email}</Text>
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
