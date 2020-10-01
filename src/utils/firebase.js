import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDZxAFsIfIzabnH6A72mbJu43wf57SQBnM',
  authDomain: 'idreamm.firebaseapp.com',
  databaseURL: 'https://idreamm.firebaseio.com',
  projectId: 'idreamm',
  storageBucket: 'idreamm.appspot.com',
  messagingSenderId: '1003188475062',
  appId: '1:1003188475062:web:8bc89e416fef0221820217',
  measurementId: 'G-21P8VCV8KZ',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebaseApp.auth();
const db = firebaseApp.firestore();

export { auth, db };
