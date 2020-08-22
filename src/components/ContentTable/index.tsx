import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core";
import { FirestoreModel } from "../../../types/interfaces";

const useStyles = makeStyles({
  table: {
    marginTop: 10,
  },
});

interface ContentTableProps {
  title: string;
  content: FirestoreModel[];
}

const ContentTable: React.FC<ContentTableProps> = ({ title, content }) => {
  const classes = useStyles();
  if (content && content.length > 0) {
    return (
      <>
        <Typography variant="h5">{title}</Typography>
        <TableContainer className={classes.table}>
          <Table aria-label={title}>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell align="right">Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((row) => (
                <TableRow key={row.value}>
                  <TableCell component="th" scope="row">
                    {row.description}
                  </TableCell>
                  <TableCell align="right">
                    R$ {row.value.toFixed(2).toString().replace(".", ",")}
                  </TableCell>
                  <TableCell align="right">
                    {row.date.toDate().toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow key="summary">
                <TableCell component="th" scope="row">
                  <Typography component="div">
                    <Box fontWeight="fontWeightBold">Total</Box>
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  R${" "}
                  {content
                    .map((expense) => expense.value)
                    .reduce((prev, curr) => prev + curr)
                    .toFixed(2)
                    .toString()
                    .replace(".", ",")}
                </TableCell>
                <TableCell align="right"> </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
  return (
    <>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body1" className={classes.table}>
        Sem dados
      </Typography>
    </>
  );
};

export default ContentTable;
