import { useContext } from "react";
import { Redirect, Route, RouteProps, useHistory } from "react-router-dom";
import AuthenticationContext from "../authentication";

type ProtectedRouteProps = {
    isAuthenticated: boolean;
    authenticationPath: string;
} & RouteProps;

const ProtectedRoute = ({ isAuthenticated, authenticationPath, children, ...routeProps }: ProtectedRouteProps) => {

    return <Route {...routeProps} render={({ location }) => {
        if (isAuthenticated) {
            return (children)
        } else {
            return <Redirect to={{ pathname: authenticationPath, state: { from: location } }} />
        }
    }} />
}

const AuthenticatedRoute = (routeProps: RouteProps) => {
    const authContext = useContext(AuthenticationContext);

    return <ProtectedRoute {...routeProps} isAuthenticated={authContext.isAuthenticated()} authenticationPath='/login' />
}

export function AuthButton() {
    const authContext = useContext(AuthenticationContext);
    const history = useHistory();

    return authContext.isAuthenticated() === true
        ? <p>
            Welcome! <button onClick={() => {
                authContext.signout().then(_ => history.push('/'))
            }}>Sign out</button>
        </p>
        : <p>You are not logged in.</p>
}

export default AuthenticatedRoute;