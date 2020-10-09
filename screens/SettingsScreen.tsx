import * as React from 'react';
import { StyleSheet, Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useSelector, RootStateOrAny } from 'react-redux'


export default function SettingsScreen() {
  const loggedIn = useSelector((state: RootStateOrAny) => state.isLoggedIn)
  const userinfo = useSelector((state: RootStateOrAny) => state.userInfo)
  return (
    <View style={styles.container}>
      {/* <Button title="login" onPress={() => dispatch(login())}></Button>
      <Button title="logout" onPress={() => dispatch(logout())}></Button> */}
      <Text>{ JSON.stringify(userinfo.email) }</Text>
      <Text>{ JSON.stringify(loggedIn) }</Text>
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
