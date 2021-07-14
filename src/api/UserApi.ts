/* eslint-disable class-methods-use-this */
import { Mode } from "../components/todo-item-list/components/use-groceries-todo-controller";

const GROCERIES_TODO_MODE_KEY = "groceriesTodoMode";

class UserApi {
    saveGroceriesTodoMode(mode: Mode): Promise<Mode> {
        localStorage.setItem(GROCERIES_TODO_MODE_KEY, Mode[mode]);
        return Promise.resolve(mode);
    }

    fetchGroceriesTodoMode(): Promise<Mode> {
        const loadedMode = localStorage.getItem(GROCERIES_TODO_MODE_KEY);

        let resultMode = Mode.PLANNING;
        if (loadedMode !== null) {
            resultMode = (<any>Mode)[loadedMode];
        }

        return Promise.resolve(resultMode);
    }
}

export default new UserApi();
