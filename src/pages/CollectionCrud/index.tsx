import React, { useState } from "react";
import * as firebase from "firebase";
import { useParams } from "react-router-dom";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { Center } from "../../components/containers";
import {
  CircularProgress,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  Container,
  IconButton,
} from "@material-ui/core";
import {
  Check as CheckIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import { FirestoreModel } from "../../../types/interfaces";
import EditDialog from "../../components/EditDialog";

interface CollectionCrudProps {}

const useStyles = makeStyles({
  table: {
    marginTop: 15,
  },
});

const CollectionCrud: React.FC<CollectionCrudProps> = () => {
  const classes = useStyles();
  const [dialogData, setDialogData] = useState<FirestoreModel>({
    id: "",
    description: "",
    paid: false,
    userId: "",
    value: 0,
    date: firebase.firestore.Timestamp.now(),
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const { collection }: { collection: string } = useParams();
  const userId = useSelector<RootState, string>(
    (state) => state.firebase.auth.uid
  );
  useFirestoreConnect([
    {
      collection,
      where: ["userId", "==", userId],
      orderBy: ["date", "desc"],
    },
  ]);
  const collectionData = useSelector<RootState>(
    (state) => state.firestore.ordered[collection]
  ) as FirestoreModel[];

  const switchDialog = () => setDialogVisible(!dialogVisible);
  const handleDialogOpen = (data: FirestoreModel) => {
    switchDialog();
    setDialogData(data);
  };

  if (isLoaded(collectionData)) {
    if (isEmpty(collectionData)) {
      return (
        <Center>
          <Typography variant="h5">
            Não existem dados registrados, por favor adicione uma Despesa ou
            Receita
          </Typography>
        </Center>
      );
    }

    return (
      <Container>
        <TableContainer component={Paper} className={classes.table}>
          <Table aria-label={`${collection} table`}>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell align="center">Valor</TableCell>
                <TableCell align="center">
                  {collection === "expenses" ? "Pago" : "Recebido"}?
                </TableCell>
                <TableCell align="center">Data</TableCell>
                <TableCell align="center">Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collectionData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.description}
                  </TableCell>
                  <TableCell align="center">
                    R$ {row.value.toFixed(2).toString().replace(".", ",")}
                  </TableCell>
                  <TableCell align="center">
                    {row.paid ? <CheckIcon /> : <CancelIcon />}
                  </TableCell>
                  <TableCell align="center">
                    {row.date.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleDialogOpen(row)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <EditDialog
          open={dialogVisible}
          collection={collection}
          initialValues={dialogData}
          switchDialog={switchDialog}
          userId={userId}
          title={
            collection === "expenses"
              ? "Edite sua Despesa"
              : "Edite sua Receita"
          }
        />
      </Container>
    );
  }

  return (
    <Center>
      <CircularProgress></CircularProgress>
    </Center>
  );
};

export default CollectionCrud;
