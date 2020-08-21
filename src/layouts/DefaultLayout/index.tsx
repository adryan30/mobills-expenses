import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  AccountCircle,
} from "@material-ui/icons/";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";

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
  })
);

const DefaultLayout: React.FC = ({ children }) => {
  const userPhoto = useSelector<RootState>(
    (state) => state.firebase.auth.photoURL
  ) as string;
  const classes = useStyles();
  const history = useHistory();
  const firebase = useFirebase();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const switchDrawer = () => setDrawerVisible(!drawerVisible);
  const handleClose = () => setAnchorEl(null);
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
                <ListItem button key={"Despesas"}>
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Despesas"} />
                </ListItem>
                <ListItem button key={"Receitas"}>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Receitas"} />
                </ListItem>
              </List>
            </Drawer>
            <Typography variant="h6" className={classes.title}>
              MobilisExpenses
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
                  <AccountCircle />
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
    </>
  );
};

export default DefaultLayout;
