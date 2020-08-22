import React from "react";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  CircularProgress,
  Container,
} from "@material-ui/core";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
import { useSelector } from "react-redux";

import { FirestoreModel } from "../../../types/interfaces";
import ContentTable from "../../components/ContentTable";
import { RootState } from "../../store/reducers";
import { Center, Responsive } from "../../components/containers";

const useStyles = makeStyles({
  margin: {
    marginTop: 10,
  },
  table: {
    width: "95%",
  },
});

const Home: React.FC = () => {
  const classes = useStyles();
  const userId = useSelector<RootState, string>(
    (state) => state.firebase.auth.uid
  );
  useFirestoreConnect([
    {
      collection: "expenses",
      where: [
        ["userId", "==", userId],
        ["paid", "==", false],
      ],
      orderBy: ["date", "desc"],
    },
  ]);
  useFirestoreConnect([
    {
      collection: "revenues",
      where: [
        ["userId", "==", userId],
        ["paid", "==", true],
      ],
      orderBy: ["date", "desc"],
    },
  ]);
  const expenses = useSelector<RootState, FirestoreModel[]>(
    (state) => state.firestore.ordered.expenses
  );
  const revenues = useSelector<RootState, FirestoreModel[]>(
    (state) => state.firestore.ordered.revenues
  );

  if (isLoaded(expenses) && isLoaded(revenues)) {
    return (
      <Container>
        <Card className={classes.margin}>
          <CardContent>
            <Typography variant="h4">Dashboard</Typography>
          </CardContent>
          <Responsive>
            <CardContent className={classes.table}>
              <ContentTable
                title="Últimas 5 contas não pagas"
                content={expenses.slice(0, 5)}
              />
            </CardContent>
            <CardContent className={classes.table}>
              <ContentTable
                title="Últimas 5 receitas recebidas"
                content={revenues.slice(0, 5)}
              />
            </CardContent>
          </Responsive>
        </Card>
      </Container>
    );
  }
  return (
    <Center>
      <CircularProgress></CircularProgress>
    </Center>
  );
};

export default Home;
