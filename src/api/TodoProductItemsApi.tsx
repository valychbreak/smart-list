/* eslint-disable class-methods-use-this */
import TodoItem from "../components/todo-item-list/types";
import LocalDB from "./LocalDB";

interface TodoProductItemsApi {
    fetchTodoProductItems(): Promise<TodoItem[]>;
    add(todoItem: TodoItem): Promise<void>;
    remove(todoItem: TodoItem): Promise<TodoItem>;
    update(todoItem: TodoItem): Promise<void>;
    clear(): Promise<void>;
}

class LocalStorageTodoProductItemsApi implements TodoProductItemsApi {
    fetchTodoProductItems(storeName?: string): Promise<TodoItem[]> {
        return LocalDB.loadTodoProductItems(storeName);
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

    clear(): Promise<void> {
        return LocalDB.clearTodoProductItems();
    }
}

export default new LocalStorageTodoProductItemsApi();
