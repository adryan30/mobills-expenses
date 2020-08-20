import { combineReducers } from "redux";
import {
  firebaseReducer as firebase,
  FirebaseReducer,
  // FirestoreReducer,
} from "react-redux-firebase";
import { firestoreReducer as firestore } from "redux-firestore";

export interface RootState {
  firebase: FirebaseReducer.Reducer;
  firestore: any;
}

const rootReducer = combineReducers<RootState>({
  firebase,
  firestore,
});

export default rootReducer;
