import { useEffect, useState } from "react";
import TodoProductItemsApi from "../../api/TodoProductItemsApi";
import TodoItem from "../todo-item-list/types";
import ExportItemList from "./export-item-list";

const TodoItemExport = () => {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    useEffect(() => {
        TodoProductItemsApi.fetchTodoProductItems().then((loadedTodoItems) => {
            setTodoItems(loadedTodoItems);
        });
    }, []);

    return (<>
        <ExportItemList todoItems={todoItems} />
    </>);
};

export default TodoItemExport;
