import * as React from 'react';
import { StyleSheet, Button, Alert, TouchableOpacity, Image, View, Platform } from 'react-native';
import firebase from '../firebase.js'

import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { logout } from '../actions'
import { useEffect, useState, Component, useLayoutEffect} from 'react'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export default function UploadProfileImageScreen() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri)
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
  };
  
  const uploadImage = async (uri) => {
    //const imageName = useSelector((state: RootStateOrAny) => state.user).username;
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`my-image`);
    return ref.put(blob);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}