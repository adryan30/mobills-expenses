import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Grid,
  InputAdornment,
  LinearProgress,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useFirestore } from "react-redux-firebase";

import { Formik, Form, Field } from "formik";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { FirestoreModel, FormValues } from "../../../types/interfaces";

interface EditDialogProps extends DialogProps {
  open: boolean;
  title: string;
  collection: string;
  userId: string;
  initialValues: FirestoreModel;
  switchDialog: Function;
}

const useStyles = makeStyles({
  margin: {
    marginTop: 10,
  },
});

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  title,
  collection,
  userId,
  initialValues,
  switchDialog,
}) => {
  const classes = useStyles();
  const firestore = useFirestore();
  const checkboxLabel = collection === "expenses" ? "Pago?" : "Recebido?";
  console.log(initialValues);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Formik
            initialValues={{
              ...initialValues,
              date: initialValues.date.toDate(),
            }}
            validate={(values) => {
              const errors: Partial<FormValues> = {};
              if (!values.description) {
                errors.description = "Descrição é obrigatória";
              }
              if (!values.value) {
                errors.value = "Valor é obrigatório";
              }
              if (!values.date) {
                errors.value = "Data é obrigatória";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              await firestore
                .collection(collection)
                .doc(initialValues.id)
                .set({
                  description: values.description,
                  value: values.value,
                  date: values.date,
                  userId,
                  paid: values.paid,
                })
                .then(() => switchDialog());
              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Grid container direction="row" justify="space-between">
                  <Field
                    component={TextField}
                    id="description"
                    name="description"
                    type="text"
                    label="Descrição"
                    fullWidth
                    autoFocus
                    margin="dense"
                  />
                </Grid>
                <Grid container direction="row" justify="space-between">
                  <Field
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                    component={TextField}
                    id="value"
                    name="value"
                    type="number"
                    label="Valor"
                  />
                  <Field
                    component={CheckboxWithLabel}
                    name="paid"
                    type="checkbox"
                    color="primary"
                    Label={{ label: checkboxLabel }}
                  />
                </Grid>
                <Field
                  component={DatePicker}
                  name="date"
                  label="Data"
                  className={classes.margin}
                  fullWidth
                />
                {isSubmitting && <LinearProgress />}
                <DialogActions>
                  <Button onClick={() => switchDialog()} color="primary">
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Editar
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </MuiPickersUtilsProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
