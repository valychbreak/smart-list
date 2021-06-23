import React, { useState } from "react";
import {
    Box,
    Button, Container, Dialog, DialogActions, DialogContent,
    DialogContentText,
    DialogTitle, Link, makeStyles, Paper,
} from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import Scanner from "../../../../Scanner";
import TodoListView from "../todo-item-list-view";
import TodoItemPriceSubmitDialog from "../todo-item-price-submit-dialog";
import useGroceriesTodoPurchasingController from "./use-groceries-todo-purchasing-controller";
import SelectTodoItemForProduct from "./todo-item-for-product-selector";
import TodoItem from "../../types";
import ProductForm from "../../../product-form";
import ScannedProductDialogView from "./scanned-product-dialog-view";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            position: "fixed",
            bottom: 0,
            // height: 60
        },
    }
}));

const GroceriesTodoPurchasingModeView: React.FC<{}> = () => {
    const [displayNewProductForm, setDisplayNewProductForm] = useState(false);

    const classes = useStyles();
    const purchasingController = useGroceriesTodoPurchasingController();
    const {
        openAddNewProductForm,
        newProductDefaultFields,
        openAddProductConfirmation,
        productToAdd,
        todoItems,
        scannedProductResult,
        toggleTodoItemPurchaseStatusWithScannedResult,
        dismissSubmitingNewProduct,
        addTodoItemFromNewProduct,
    } = purchasingController;

    const onTodoItemSubmit = (todoItem: TodoItem) => {
        toggleTodoItemPurchaseStatusWithScannedResult(todoItem);
    };

    const closeNewProductDialog = () => {
        dismissSubmitingNewProduct();
    };

    const closeAddProductConfirmation = () => {
        purchasingController.dismissAddingProduct();
    };

    const addScannedProductToTodoItems = () => {
        if (!productToAdd) {
            return;
        }

        purchasingController.addPurchasedProduct(productToAdd);
        closeAddProductConfirmation();
    };

    return (<>
        <Dialog open={openAddNewProductForm}>
            <DialogTitle>
                New product
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {/* eslint-disable-next-line max-len */}
                    Scanned barcode {scannedProductResult?.code} was not found in our DB.
                </DialogContentText>
                {!displayNewProductForm && <>
                    <DialogContentText>
                        Select item from the list that you want to link scanned product
                        to:
                    </DialogContentText>
                    <SelectTodoItemForProduct
                        todoItems={todoItems}
                        onTodoItemSubmit={onTodoItemSubmit}
                    />
                    <DialogContentText>
                        <Box marginTop={2}>
                            {"Also, you can "}
                            <Link onClick={() => setDisplayNewProductForm(true)}>
                                Add new product
                            </Link>
                            {" instead."}
                        </Box>
                    </DialogContentText>
                </>}

                {displayNewProductForm && <>
                    <DialogContentText>
                        {/* eslint-disable-next-line max-len */}
                        Fill in the form to add new product:
                    </DialogContentText>
                    <ProductForm
                        shortForm
                        defaultFieldValues={newProductDefaultFields}
                        onProductSubmit={
                            (productFormData) => addTodoItemFromNewProduct(productFormData)
                        }
                    />
                    <DialogContentText>
                        <Box marginTop={2}>
                            {"Also, you can "}
                            <Link onClick={() => setDisplayNewProductForm(false)}>
                                Select from groceries list
                            </Link>
                            {" instead."}
                        </Box>
                    </DialogContentText>
                </>}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeNewProductDialog}>Cancel</Button>
            </DialogActions>
        </Dialog>

        {productToAdd && (
            <Dialog open={openAddProductConfirmation}>
                <DialogTitle>Add product to groceries list?</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        <ScannedProductDialogView product={productToAdd} />
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <DialogContentText>
                        Do you want to add scanned product to groceries list and mark as purchased?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeAddProductConfirmation()} color="primary">
                        No
                    </Button>
                    <Button onClick={() => addScannedProductToTodoItems()} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )}

        <TodoItemPriceSubmitDialog open={purchasingController.openPriceSubmission}
            selectedItem={purchasingController.selectedItem}
            handleClose={purchasingController.onPriceSubmissionClose} />

        <TodoListView
            showPurchaseAction={true}
            onTodoItemPurchaseToggle={purchasingController.toggleTodoItemPurchaseStatus}/>

        <Container maxWidth="lg" disableGutters classes={classes}>
            <Paper>
                <Button variant="contained" onClick={() => purchasingController.enableScanner()} startIcon={<SettingsOverscanIcon />}>
                    Scan barcode
                </Button>
                <Dialog
                    open={purchasingController.openScanner}
                    onClose={() => purchasingController.disableScanner()}>
                    <Scanner onDetected={purchasingController.onBarcodeScan} />
                </Dialog>
            </Paper>
        </Container>
    </>);
};

export default GroceriesTodoPurchasingModeView;
