import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";
import TodoProductItemsApi from "../../api/TodoProductItemsApi";
import ExportItem from "./export-item";
import ExportItemList from "./export-item-list";

const TodoItemExport = () => {
    const [todoItems, setTodoItems] = useState<ExportItem[]>([]);

    const [selectedExportItem, setSelectedExportItem] = useState<ExportItem | null>(null);
    const openEditDialog = selectedExportItem !== null;

    useEffect(() => {
        TodoProductItemsApi.fetchTodoProductItems().then((loadedTodoItems) => {
            const exportItems: ExportItem[] = loadedTodoItems.map((todoItem) => (
                ExportItem.fromTodoItem(todoItem)
            ));

            setTodoItems(exportItems);
        });
    }, []);

    const onEditAction = (exportItem: ExportItem) => {
        setSelectedExportItem(exportItem);
    };

    const closeEditDialog = () => setSelectedExportItem(null);

    return (
        <>
            <Dialog open={openEditDialog} onClose={closeEditDialog}>
            </Dialog>
            <ExportItemList exportItems={todoItems} onEdit={onEditAction} />
        </>
    );
};

export default TodoItemExport;
