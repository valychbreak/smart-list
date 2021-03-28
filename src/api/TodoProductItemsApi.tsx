import TodoItem from "../components/todo-item-list/types";
import LocalDB from "./LocalDB";

interface TodoProductItemsApi {
    fetchTodoProductItems(): Promise<TodoItem[]>;
    add(todoItem: TodoItem): Promise<void>;
    remove(todoItem: TodoItem): Promise<TodoItem>;
    update(todoItem: TodoItem): Promise<void>;
}

class LocalStorageTodoProductItemsApi implements TodoProductItemsApi {
    fetchTodoProductItems(): Promise<TodoItem[]> {
        return LocalDB.loadTodoProductItems();
    }

    add(todoItem: TodoItem): Promise<void> {
        return LocalDB.saveTodoProductItem(todoItem);
    }

    remove(todoItem: TodoItem): Promise<TodoItem> {
        return LocalDB.removeTodoProductItem(todoItem);
    }

    update(todoItem: TodoItem): Promise<void> {
        return LocalDB.updateTodoProductItem(todoItem);
    }
}

export default new LocalStorageTodoProductItemsApi();
