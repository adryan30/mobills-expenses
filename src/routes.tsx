import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Grid from "@material-ui/core/Grid";
import { CircularProgress } from "@material-ui/core";

import Home from "./pages/Home";
import Login from "./pages/Login";
import { RootState } from "./store/reducers";

function AuthIsLoaded({ children }: { children: React.ReactNode }) {
  const auth = useSelector<RootState>((state) => state.firebase.auth);
  if (!isLoaded(auth))
    return (
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  return <>{children}</>;
}

const Routes: React.FC = () => {
  return (
    <AuthIsLoaded>
      <Switch>
        <PrivateRoute path="/" exact>
          <Home />
        </PrivateRoute>
        <Route path="/login" component={Login} exact />
      </Switch>
    </AuthIsLoaded>
  );
};

function PrivateRoute({
  children,
  ...rest
}: {
  children: React.ReactNode;
  path: string;
  exact: boolean;
}) {
  const auth = useSelector<RootState>((state) => state.firebase.auth);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: location,
              },
            }}
          />
        )
      }
    />
  );
}

export default Routes;
