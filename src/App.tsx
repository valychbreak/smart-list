import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import {
    BrowserRouter as Router, Switch, Route,
} from "react-router-dom";
import AuthenticatedRoute from "./components/authenticated-route";
import { AuthenticationContextProvider } from "./components/authentication";
import AppHeader from "./components/header";
import BrowseProductsPage from "./pages/browse-products/BrowseProductsPage";
import AddNewProduct from "./pages/new-product/AddNewProductPage";
import ScanTest from "./pages/scan-test/ScanTestPage";
import GroceriesTodo from "./routes/groceries-todo";
import Login from "./routes/login";
import Profile from "./routes/profile";
import Export from "./routes/export";

const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        marginBottom: theme.spacing(2),
    },
}));

function Home() {
    return <h2>Home</h2>;
}

export default function App() {
    const classes = useStyles();

    return (
        <AuthenticationContextProvider>
            <Router>
                <Paper className={classes.paper}>
                    <AppHeader />
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
                        <AuthenticatedRoute path="/profile">
                            <Profile />
                        </AuthenticatedRoute>
                        <AuthenticatedRoute path="/export">
                            <Export />
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
            </Router>
        </AuthenticationContextProvider>
    );
}
