import React from "react";
import Routes from "./routes";
import { Provider } from "react-redux";
import { store, rrfProps } from "./store";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </ReactReduxFirebaseProvider>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
