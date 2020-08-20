import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const fbConfig = {
  apiKey: "AIzaSyDb2kk1TbS80PHkPZw0H8Xpt1U5OqZOSX8",
  authDomain: "mobilisexpenses.firebaseapp.com",
  databaseURL: "https://mobilisexpenses.firebaseio.com",
  projectId: "mobilisexpenses",
  storageBucket: "mobilisexpenses.appspot.com",
  messagingSenderId: "804682831973",
  appId: "1:804682831973:web:8b06083fa357b2f7604e8c",
};

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

firebase.initializeApp(fbConfig);
firebase.firestore();
firebase.auth();
firebase.auth().useDeviceLanguage();
export { firebase, rrfConfig };
