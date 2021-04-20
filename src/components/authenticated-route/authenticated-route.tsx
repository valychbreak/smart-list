import { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import AuthenticationContext from "../authentication";

type ProtectedRouteProps = {
    isAuthenticated: boolean;
    authenticationPath: string;
} & RouteProps;

const ProtectedRoute = ({
    isAuthenticated, authenticationPath, children, ...routeProps
}: ProtectedRouteProps) => <Route {...routeProps} render={({ location }) => {
    if (isAuthenticated) {
        return (children);
    }
    return <Redirect to={{ pathname: authenticationPath, state: { from: location } }} />;
}} />;

const AuthenticatedRoute = (routeProps: RouteProps) => {
    const authContext = useContext(AuthenticationContext);

    return <ProtectedRoute {...routeProps} isAuthenticated={authContext.isAuthenticated()} authenticationPath='/login' />;
};

export default AuthenticatedRoute;
