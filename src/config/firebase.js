import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyCSHSnOaWkWxGYzNeVfllhxHrAKO7ZKLyg",
  authDomain: "pdf-test-7a1fb.firebaseapp.com",
  databaseURL: "https://pdf-test-7a1fb.firebaseio.com",
  projectId: "pdf-test-7a1fb",
  storageBucket: "pdf-test-7a1fb.appspot.com",
  messagingSenderId: "504926905735",
  appId: "1:504926905735:web:d104afc7d8e8fcebd55f22",
  measurementId: "G-68D0N35W02"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export const storage = firebaseApp.storage();

//firebase.initializeApp(firebaseConfig);