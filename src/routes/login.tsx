import { useContext, useState } from "react";
import { Redirect } from "react-router";
import { useLocation } from "react-router-dom";
import AuthenticationContext from "../components/authentication";

export const Login = () => {

    const authContext = useContext(AuthenticationContext)

    const [redirectToReferrer, setRedirectToReferrer] = useState(false)
    const { state } = useLocation<any>()

    const handleLogin = () => {
        authContext.authenticate({username: "test", password: "anothertest"}).then(_ => setRedirectToReferrer(true));
    }

    if (redirectToReferrer === true) {
        return <Redirect to={state?.from || '/'} />
    }

    return (
        <div>
            <p>You must log in to view the page</p>
            <button onClick={handleLogin}>Log in</button>
        </div>
    )
}
