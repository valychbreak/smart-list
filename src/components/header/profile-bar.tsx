import { Button, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AccountBox } from "@material-ui/icons";
import AuthenticationContext from "../authentication";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2)
    },
  }),
);

export function ProfileBar() {
    const classes = useStyles();

    const authContext = useContext(AuthenticationContext);
    const history = useHistory();

    function signout() {
        authContext.signout().then(_ => history.push('/'));
    }

    return authContext.isAuthenticated() === true
        ? <>
            <Typography classes={classes}>Welcome, {authContext.user.username}!</Typography>
            <Button variant="outlined" size="small" color="inherit" onClick={signout}>Sign out</Button>
        </>
        : <Button color="inherit" component={Link} to='/login' startIcon={<AccountBox />}>Login</Button>
}