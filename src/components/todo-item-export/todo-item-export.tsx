import _ from "lodash";
import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";
import ProductApi from "../../api/ProductApi";
import TodoProductItemsApi from "../../api/TodoProductItemsApi";
import ExportItem from "./export-item";
import ExportItemEditForm, { ExportItemFormSubmitData } from "./export-item-form";
import ExportItemList from "./export-item-list";

export function getExportResult(exportItems: ExportItem[]) {
    return _.chain(exportItems)
        .groupBy((iteratee) => iteratee.category?.name)
        .flatMap((exportItemsByCategory, key) => (
            _.chain(exportItemsByCategory)
                .groupBy((exportItem) => exportItem.purchasedStore?.name)
                .map((exportItemsByStore, storeName) => (
                    { category: key, storeName, exportItemsByStore }
                ))
                .value()
        ))
        .value();
}

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

    const closeEditDialog = () => {
        setSelectedExportItem(null);
    };

    const onExportItemEdit = (formData: ExportItemFormSubmitData) => {
        if (!selectedExportItem) {
            return;
        }

        const { purchasedPrice, category, store } = formData;

        const updatedExportItem = new ExportItem(
            selectedExportItem.id,
            selectedExportItem.generalName,
            selectedExportItem.quantity,
            selectedExportItem.isBought,
            selectedExportItem.productPrice,
            purchasedPrice,
            store,
            category,
            selectedExportItem.targetProduct
        );

        setTodoItems(
            todoItems.map((exportItem) => (
                exportItem.id === updatedExportItem.id
                    ? updatedExportItem
                    : exportItem
            ))
        );

        setSelectedExportItem(null);

        if (formData.applyToProduct && updatedExportItem.targetProduct) {
            ProductApi.changeCategory(updatedExportItem.targetProduct, category);
        }
    };

    return (
        <>
            <Dialog open={openEditDialog} onClose={closeEditDialog}>
                <ExportItemEditForm
                    exportItem={selectedExportItem as ExportItem}
                    onSubmit={onExportItemEdit}
                />
            </Dialog>
            <ExportItemList exportItems={todoItems} onEdit={onEditAction} />
        </>
    );
};

export default TodoItemExport;
