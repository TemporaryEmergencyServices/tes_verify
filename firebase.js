import * as firebase from 'firebase'
// import { 
//     DEV_FIREBASE_API_KEY, DEV_FIREBASE_AUTH_DOMAIN, DEV_FIREBASE_DATABASE_URL,
//     DEV_FIREBASE_PROJECT_ID, DEV_FIREBASE_STORAGE_BUCKET, DEV_FIREBASE_MESSAGING_SENDER_ID, 
//     DEV_FIREBASE_APP_ID, DEV_FIREBASE_MEASUREMENT_ID
// } from 'react-native-dotenv'

import env from './env.json'

// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";
// FIXME: Re enable authentication in firebase console once we set firebase 
// auth up. go to 

var firebaseConfig = {
    apiKey: env.DEV_FIREBASE_API_KEY,
    authDomain: env.DEV_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.DEV_FIREBASE_DATABASE_URL,
    projectId: env.DEV_FIREBASE_PROJECT_ID,
    storageBucket: env.DEV_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.DEV_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.DEV_FIREBASE_APP_ID,
    measurementId: env.DEV_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase