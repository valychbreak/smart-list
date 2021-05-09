import { useEffect, useState } from "react";
import TodoProductItemsApi from "../../api/TodoProductItemsApi";
import ExportItem from "./export-item";
import ExportItemList from "./export-item-list";

const TodoItemExport = () => {
    const [todoItems, setTodoItems] = useState<ExportItem[]>([]);

    useEffect(() => {
        TodoProductItemsApi.fetchTodoProductItems().then((loadedTodoItems) => {
            const exportItems: ExportItem[] = loadedTodoItems.map((todoItem) => (
                ExportItem.fromTodoItem(todoItem)
            ));

            setTodoItems(exportItems);
        });
    }, []);

    return (
        <>
            <ExportItemList exportItems={todoItems} />
        </>
    );
};

export default TodoItemExport;
