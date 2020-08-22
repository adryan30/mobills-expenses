import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  createStyles,
  makeStyles,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  LinearProgress,
  DialogActions,
  Grid,
  InputAdornment,
  Fab,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
} from "@material-ui/icons/";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useHistory, Link } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

import { RootState } from "../../store/reducers";
import { FormValues as FormFields } from "../../../types/interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    margin: {
      marginTop: 10,
    },
    fab: {
      position: "fixed",
      bottom: 20,
      right: 20,
    },
  })
);

const DefaultLayout: React.FC = ({ children }) => {
  const firestore = useFirestore();
  const classes = useStyles();
  const history = useHistory();
  const firebase = useFirebase();
  const userId = useSelector<RootState, string>(
    (state) => state.firebase.auth.uid
  );
  const userPhoto = useSelector<RootState>(
    (state) => state.firebase.auth.photoURL
  ) as string;

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [checkboxLabel, setCheckboxLabel] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const switchDrawer = () => setDrawerVisible(!drawerVisible);
  const switchDialog = () => setDialogVisible(!dialogVisible);
  const handleClose = () => setAnchorEl(null);
  const handleCheckboxLabelChange = (event: any) => {
    const value = event.target.value;
    if (value === "expenses") {
      setCheckboxLabel("Pago?");
    } else {
      setCheckboxLabel("Recebido?");
    }
    setSelectValue(value);
  };
  const handleLogout = () => {
    handleClose();
    return firebase.logout().then(() => history.push("/login"));
  };

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={switchDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={drawerVisible} anchor="left" onClose={switchDrawer}>
              <List>
                <ListItem
                  button
                  key={"Dashboard"}
                  component={Link}
                  to="/"
                  onClick={switchDrawer}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItem>
                <ListItem
                  button
                  key={"Despesas"}
                  component={Link}
                  to="/expenses"
                  onClick={switchDrawer}
                >
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Despesas"} />
                </ListItem>
                <ListItem
                  button
                  key={"Receitas"}
                  component={Link}
                  to="/revenues"
                  onClick={switchDrawer}
                >
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Receitas"} />
                </ListItem>
              </List>
            </Drawer>
            <Typography variant="h6" className={classes.title}>
              MobillsExpenses
            </Typography>
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {userPhoto ? (
                  <Avatar alt="Foto do usuário" src={userPhoto} />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Deslogar</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <div>{children}</div>
      <Fab
        aria-label="Adicionar"
        className={classes.fab}
        color="primary"
        onClick={switchDialog}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={dialogVisible}
        onClose={switchDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Novo Despesa/Receita</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para adicionar uma nova Despesa ou Receita, preencha os campo
            abaixo.
          </DialogContentText>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Formik
              initialValues={{
                description: null,
                type: null,
                value: null,
                date: new Date(),
                paid: false,
              }}
              validate={(values) => {
                const errors: Partial<FormFields> = {};
                if (!values.description) {
                  errors.description = "Descrição é obrigatória";
                }
                if (!values.value) {
                  errors.value = "Valor é obrigatório";
                }
                if (!selectValue) {
                  errors.type = "Tipo é obrigatório";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await firestore
                  .collection(selectValue)
                  .add({
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
                      component={TextField}
                      type="select"
                      name="type"
                      id="type"
                      select
                      label="Tipo"
                      onChange={handleCheckboxLabelChange}
                      value={selectValue}
                      helperText="Selecione despesa ou receita"
                    >
                      <MenuItem key="expense" value="expenses">
                        Despesa
                      </MenuItem>
                      <MenuItem key="revenue" value="revenues">
                        Receita
                      </MenuItem>
                    </Field>
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
                    <Button onClick={switchDialog} color="primary">
                      Cancelar
                    </Button>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                      Adicionar
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </MuiPickersUtilsProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DefaultLayout;
