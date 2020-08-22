import React from "react";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useHistory } from "react-router-dom";

import { Container } from "./styles";

const Login: React.FC = () => {
  const history = useHistory();
  return (
    <Container>
      <StyledFirebaseAuth
        uiConfig={{
          signInFlow: "popup",
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
          ],
          siteName: "MobilisExpenses",
          signInSuccessUrl: "/",
          callbacks: {
            signInSuccessWithAuthResult: () => {
              history.push("/");
              return true;
            },
          },
        }}
        firebaseAuth={firebase.auth()}
      />
    </Container>
  );
};

export default Login;
