import { createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import { createFirestoreInstance } from "redux-firestore";
import { firebase, rrfConfig } from "./firebase";

import rootReducer from "./reducers";

const initialState = {};

export const store = createStore(
  rootReducer,
  initialState,
  devToolsEnhancer({})
);

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};
