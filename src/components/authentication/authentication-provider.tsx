import { useState } from "react"
import localDbUsername from "../../api/persistance/local-db-username"
import AuthenticationContext from "./authentication-context"
import { AuthenticationData, User } from "./types"

const GUEST: User = { username: "GUEST" }

export const AuthenticationContextProvider = (props: React.PropsWithChildren<{}>) => {

    const [user, setUser] = useState<User>(GUEST);

    const isAuthenticated = (): boolean => {
        return user !== GUEST;
    }

    const authenticate = (authenticationData: AuthenticationData): Promise<void> => {
        return new Promise(resolve => {
            setUser({ username: authenticationData.username });
            
            // Saving to share data with TEMP local dbs
            localDbUsername.save(authenticationData.username);

            return resolve();
        });
    }

    const signout = (): Promise<void> => {
        return new Promise(resolve => {
            setUser(GUEST);

            localDbUsername.clear();
            
            return resolve();
        });
    }

    const register = (): Promise<void> => {
        throw new Error("No implementation");
    }

    return (
        <AuthenticationContext.Provider value={{ user, isAuthenticated, authenticate, signout, register }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}