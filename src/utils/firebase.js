import firebase from "firebase/app";
import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDOyA4lwOid_AcjJdmZ0JGK94uVg51K-Oo",
  authDomain: "epic-react.firebaseapp.com",
  projectId: "epic-react",
  storageBucket: "epic-react.appspot.com",
  messagingSenderId: "132227050606",
  appId: "1:132227050606:web:9f55fb63b66283a0014a7f",
};
firebase.initializeApp(firebaseConfig);
const authFirebase = firebase.auth()
export {authFirebase}
