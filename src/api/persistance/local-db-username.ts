const USERNAME_KEY = "usernameTmp";

class UsernameLocalDB {
    static save(username: string) {
        localStorage.setItem(USERNAME_KEY, username);
    }

    static getUsername(): string {
        const storedUsername = localStorage.getItem(USERNAME_KEY);
        if (storedUsername == null) {
            throw new Error("Not authenticated");
        }

        return storedUsername;
    }

    static clear() {
        localStorage.removeItem(USERNAME_KEY);
    }

    static hasUsername(): boolean {
        return localStorage.getItem(USERNAME_KEY) !== null;
    }
}

export default UsernameLocalDB;
