import { User } from "../../components/authentication/types";


const USERNAME_KEY = 'usernameTmp';

class UsernameLocalDB {
    save(username: string) {
        localStorage.setItem(USERNAME_KEY, username);
    }

    getUsername(): string {
        const storedUsername = localStorage.getItem(USERNAME_KEY);
        if (storedUsername == null) {
            throw new Error("Not authenticated");
        }

        return storedUsername;
    }

    clear() {
        localStorage.removeItem(USERNAME_KEY);
    }
}

export default new UsernameLocalDB();
