import { useEffect, useState } from "react";
import localDbUsername from "../../api/persistance/local-db-username";
import AuthenticationContext from "./authentication-context";
import { AuthenticationData, User } from "./types";

const GUEST: User = { username: "GUEST" };

type AuthenticationContextProviderProps = {
    isLoggedIn: boolean;
    setLoggedIn(value: boolean): void;
};

// This "container" component is required because of re-rendering when user logs in or out
const AuthenticationContextProvider = (props: React.PropsWithChildren<{}>) => {
    const [isLoggedIn, setLoggedIn] = useState(localDbUsername.hasUsername());

    return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <AuthenticationContextProviderImpl
            isLoggedIn={isLoggedIn}
            setLoggedIn={setLoggedIn} {...props} />
    );
};

const AuthenticationContextProviderImpl = (
    props: React.PropsWithChildren<AuthenticationContextProviderProps>,
) => {
    const [user, setUser] = useState<User>(GUEST);

    useEffect(() => {
        if (props.isLoggedIn) {
            try {
                const username = localDbUsername.getUsername();
                setUser({ username });
            } catch (error) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                signout();
            }
        }
    }, []);

    const isAuthenticated = (): boolean => props.isLoggedIn;

    const authenticate = (authenticationData: AuthenticationData): Promise<void> => new Promise(
        (resolve) => {
            setUser({ username: authenticationData.username });

            // Saving to share data with TEMP local dbs
            localDbUsername.save(authenticationData.username);

            props.setLoggedIn(true);
            return resolve();
        },
    );

    const signout = (): Promise<void> => new Promise((resolve) => {
        setUser(GUEST);

        localDbUsername.clear();

        props.setLoggedIn(false);
        return resolve();
    });

    const register = (): Promise<void> => {
        throw new Error("No implementation");
    };

    return (
        <AuthenticationContext.Provider value={{
            user, isAuthenticated, authenticate, signout, register,
        }}>
            {props.children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationContextProvider;
