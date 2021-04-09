
import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AuthenticatedRoute from "./components/authenticated-route";
import { AuthenticationContextProvider } from "./components/authentication/authentication-provider";
import AppMenu from "./components/header";
import { ProfileBar } from "./components/profile";
import BrowseProductsPage from "./pages/browse-products/BrowseProductsPage";
import AddNewProduct from './pages/new-product/AddNewProductPage'
import ScanTest from "./pages/scan-test/ScanTestPage";
import { GroceriesTodo } from "./routes/groceries-todo";
import { Login } from "./routes/login";

const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        marginBottom: theme.spacing(2)
    },
    table: {},
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute"
    },
    container: {
        maxHeight: 360
    }
}));

export default function App() {
    const classes = useStyles();

    return (
        <AuthenticationContextProvider>
            <Router>
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <AppMenu />
                        <ProfileBar />
                        <Switch>
                            <Route path="/browse">
                              <BrowseProductsPage />
                            </Route>
                            <Route path="/new-product">
                              <AddNewProduct />
                            </Route>
                            <AuthenticatedRoute path="/groceries-todo">
                              <GroceriesTodo />
                            </AuthenticatedRoute>
                            <Route path="/scan-test">
                              <ScanTest />
                            </Route>
                            <Route path="/login">
                              <Login />
                            </Route>
                            <Route path="/">
                              <Home />
                            </Route>
                        </Switch>
                    </Paper>
                </div>
            </Router>
        </AuthenticationContextProvider>
    );
}

function Home() {
    return <h2>Home</h2>;
}
