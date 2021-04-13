import { AppBar, Button, createStyles, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core"
import React from "react"
import { ProfileBar } from "./profile-bar";
import AppMenu from "./menu";

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
  }),
);

const AppHeader = () => {
    const classes = useStyles();

    return (
        <AppBar position="fixed">
            <Toolbar>
                <AppMenu />
                <Typography variant="h6" className={classes.title}>
                    Smart List
                </Typography>
                <ProfileBar />
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader;