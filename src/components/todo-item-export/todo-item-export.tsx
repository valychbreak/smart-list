import _ from "lodash";
import { Box, Button, DialogContent, DialogTitle } from "@material-ui/core";
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
import useDialog from "../use-dialog";
import Dialog from "../dialog";

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

    const productEditState = useDialog<ExportItem>();
    const editState = useDialog<ExportItem>();

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

    async function onProductEditSubmit(product: Product) {
        const exportItem = productEditState.payload!;

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

        productEditState.closeDialog();
        await TodoProductItemsApi.update(updatedExportItem);

        updateViewItem(updatedExportItem);
    }

    const onEditSubmit = async (formData: ExportItemFormSubmitData) => {
        const { purchasedPrice, category, store } = formData;
        const exportItem = editState.payload!;

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

        editState.closeDialog();
        await TodoProductItemsApi.update(updatedExportItem);

        updateViewItem(updatedExportItem);

        if (formData.applyToProduct && updatedExportItem.targetProduct) {
            ProductApi.changeCategory(updatedExportItem.targetProduct, category);
        }
    };

    const showExport = () => {
        setOpenExportResultDialog(true);
    };

    return (
        <>
            <Dialog open={editState.isOpened} onClose={editState.closeDialog}>
                <ExportItemEditForm
                    exportItem={editState.payload}
                    onSubmit={onEditSubmit}
                    onClose={editState.closeDialog}
                />
            </Dialog>

            <Dialog open={productEditState.isOpened} onClose={productEditState.closeDialog}>
                <DialogTitle>
                    Edit {productEditState.payload?.targetProduct?.title}
                </DialogTitle>
                <DialogContent>
                    <ProductEditForm
                        product={productEditState.payload?.targetProduct!}
                        onProductSubmit={(product) => onProductEditSubmit(product)}
                        onCancel={productEditState.closeDialog}
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
                onEdit={editState.openDialog}
                onEditProduct={productEditState.openDialog}
            />
        </>
    );
};

export default TodoItemExport;
