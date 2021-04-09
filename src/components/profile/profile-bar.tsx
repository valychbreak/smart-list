import { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthenticationContext from "../authentication";

export function ProfileBar() {
    const authContext = useContext(AuthenticationContext);
    const history = useHistory();

    function signout() {
        authContext.signout().then(_ => history.push('/'));
    }

    return authContext.isAuthenticated() === true
        ? <p>
            Welcome, {authContext.user.username}! <button onClick={signout}>Sign out</button>
        </p>
        : <p>You are not logged in.</p>
}