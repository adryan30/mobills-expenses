import * as firebase from "firebase";

export interface FirestoreModel {
  id: string;
  value: number;
  description: string;
  date: firebase.firestore.Timestamp;
  paid: boolean;
  userId: string;
}

export interface FormValues {
  description: string;
  value: string;
  type: string;
  paid: boolean;
}
