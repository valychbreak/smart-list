import _ from "lodash";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Alert } from "@material-ui/lab";
import { ListAlt } from "@material-ui/icons";
import ProductApi from "../../api/ProductApi";
import TodoProductItemsApi from "../../api/TodoProductItemsApi";
import ExportItem from "./export-item";
import ExportItemEditForm, { ExportItemFormSubmitData } from "./export-item-form";
import ExportItemList from "./export-item-list";
import ExportResultView from "./export-result-view";
import Product from "../../entity/Product";
import ProductEditForm from "../product-edit-form";

export type ExportItemsGrouped = {
    categoryName: string;
    storeName: string;
    exportItems: ExportItem[];
};

export function getExportResult(exportItems: ExportItem[]): ExportItemsGrouped[] {
    return _.chain(exportItems)
        .groupBy((exportItem) => exportItem.category?.name)
        .flatMap((exportItemsByCategory, key) => (
            _.chain(exportItemsByCategory)
                .groupBy((exportItem) => exportItem.purchasedStore?.name)
                .map((exportItemsByStore, storeName) => (
                    {
                        categoryName: key,
                        storeName,
                        exportItems: exportItemsByStore
                    } as ExportItemsGrouped
                ))
                .value()
        ))
        .value();
}

const TodoItemExport = () => {
    const [todoItems, setTodoItems] = useState<ExportItem[]>([]);
    const [openExportResultDialog, setOpenExportResultDialog] = useState<boolean>(false);
    const exportItemsGrouped = openExportResultDialog ? getExportResult(todoItems) : [];

    const [showProductEditDialog, setShowProductEditDialog] = useState(false);

    const [selectedExportItem, setSelectedExportItem] = useState<ExportItem | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);

    useEffect(() => {
        TodoProductItemsApi.fetchTodoProductItems().then((loadedTodoItems) => {
            const exportItems: ExportItem[] = loadedTodoItems
                .filter((todoItem) => todoItem.isBought)
                .map((todoItem) => (
                    ExportItem.fromTodoItem(todoItem)
                ));

            setTodoItems(exportItems);
        });
    }, []);

    const updateViewItem = (item: ExportItem) => {
        setTodoItems(
            todoItems.map((exportItem) => (
                exportItem.id === item.id
                    ? item
                    : exportItem
            ))
        );
    };

    const onEditAction = (exportItem: ExportItem) => {
        setSelectedExportItem(exportItem);
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setShowEditDialog(false);
    };

    const onProductEditAction = (exportItem: ExportItem) => {
        setSelectedExportItem(exportItem);
        setShowProductEditDialog(true);
    };

    function closeProductEditDialog() {
        setShowProductEditDialog(false);
    }

    async function onProductEditSubmit(product: Product) {
        closeProductEditDialog();

        const exportItem = selectedExportItem!;

        const updatedExportItem = new ExportItem(
            exportItem.id,
            product.productGeneralName,
            exportItem.quantity,
            exportItem.isBought,
            exportItem.productPrice,
            exportItem.purchasedPrice,
            exportItem.purchasedStore,
            exportItem.category,
            product
        );

        await TodoProductItemsApi.update(updatedExportItem);

        updateViewItem(updatedExportItem);
    }

    const onEditSubmit = async (formData: ExportItemFormSubmitData) => {
        const { purchasedPrice, category, store } = formData;
        const exportItem = selectedExportItem!;

        const updatedExportItem = new ExportItem(
            exportItem.id,
            exportItem.generalName,
            exportItem.quantity,
            exportItem.isBought,
            exportItem.productPrice,
            purchasedPrice,
            store,
            category,
            exportItem.targetProduct
        );

        await TodoProductItemsApi.update(updatedExportItem);

        updateViewItem(updatedExportItem);

        if (formData.applyToProduct && updatedExportItem.targetProduct) {
            ProductApi.changeCategory(updatedExportItem.targetProduct, category);
        }

        closeEditDialog();
    };

    const showExport = () => {
        setOpenExportResultDialog(true);
    };

    return (
        <>
            <Dialog open={showEditDialog} onClose={closeEditDialog}>
                <ExportItemEditForm
                    exportItem={selectedExportItem as ExportItem}
                    onSubmit={onEditSubmit}
                    onClose={() => closeEditDialog()}
                />
            </Dialog>

            <Dialog open={showProductEditDialog} onClose={closeProductEditDialog}>
                <DialogTitle>
                    Edit {selectedExportItem?.targetProduct?.productFullName
                        || selectedExportItem?.targetProduct?.productGeneralName}
                </DialogTitle>
                <DialogContent>
                    <ProductEditForm
                        product={selectedExportItem?.targetProduct!}
                        onProductSubmit={(product) => onProductEditSubmit(product)}
                        onCancel={closeProductEditDialog}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openExportResultDialog}
                onClose={() => setOpenExportResultDialog(false)}
            >
                <ExportResultView exportItemsGrouped={exportItemsGrouped} />
            </Dialog>

            <Alert severity="info">Showing only purchased items</Alert>
            <Box marginY={1}>
                <Button variant="outlined"
                    startIcon={<ListAlt />}
                    onClick={showExport}
                >
                    Show export
                </Button>
            </Box>
            <ExportItemList
                exportItems={todoItems}
                onEdit={onEditAction}
                onEditProduct={onProductEditAction}
            />
        </>
    );
};

export default TodoItemExport;
