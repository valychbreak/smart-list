import React from "react";
import { AuthenticationData, User } from "./types";

type AuthenticationContextType = {
    user: User,
    isAuthenticated(): boolean,

    authenticate(authenticationData: AuthenticationData): Promise<void>,
    signout(): Promise<void>,
    register(): Promise<void>
};

const AuthenticationContext = React.createContext<AuthenticationContextType>({
    user: { username: "No implementation" },

    isAuthenticated: (): boolean => {
        throw new Error("No implementation");
    },

    authenticate: (): Promise<void> => {
        throw new Error("No implementation");
    },
    signout: (): Promise<void> => {
        throw new Error("No implementation");
    },
    register: (): Promise<void> => {
        throw new Error("No implementation");
    },
});

export default AuthenticationContext;
