import React, { useEffect } from "react";
import {
    Button, Container, Dialog, DialogActions, DialogContent,
    DialogContentText,
    DialogTitle, makeStyles, Paper, Typography,
} from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import Scanner from "../../../../Scanner";
import TodoListView from "../todo-item-list-view";
import TodoItemPriceSubmitDialog from "../todo-item-price-submit-dialog";
import useGroceriesTodoPurchasingController from "./use-groceries-todo-purchasing-controller";
import SelectTodoItemForProduct from "./todo-item-for-product-selector";
import TodoItem from "../../types";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            position: "fixed",
            bottom: 0,
            // height: 60
        },
    },
}));

const GroceriesTodoPurchasingModeView: React.FC<{}> = () => {
    const classes = useStyles();
    const purchasingController = useGroceriesTodoPurchasingController();
    const {
        openAddNewProductForm,
        todoItems,
        scannedProductResult,
        linkScannedProductTo,
        dismissSubmitingNewProduct,
        toggleTodoItemPurchaseStatus
    } = purchasingController;

    useEffect(() => {
        const { productToAdd } = purchasingController;
        if (purchasingController.openAddProductConfirmation && productToAdd !== null) {
            // eslint-disable-next-line no-alert
            const addingProductConfirmed = window.confirm(`${productToAdd.productFullName} wasn't added to the list.\n Do you want to add it and mark as purchased?`);
            if (addingProductConfirmed) {
                purchasingController.addPurchasedProduct(productToAdd);
            } else {
                purchasingController.dismissAddingProduct();
            }
        }
    }, [purchasingController.scannedProductResult, purchasingController.productToAdd]);

    const onTodoItemSubmit = (todoItem: TodoItem) => {
        linkScannedProductTo(todoItem);
        dismissSubmitingNewProduct();
        toggleTodoItemPurchaseStatus(todoItem, true);
    };

    const closeNewProductDialog = () => {
        dismissSubmitingNewProduct();
    };

    return (<>
        <Dialog open={openAddNewProductForm}>
            <DialogTitle>
                New product
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {/* eslint-disable-next-line max-len */}
                    Scanned barcode {scannedProductResult?.code} was not found in our DB.<br />
                    Follow steps below to add a new product.
                </DialogContentText>
                <Typography variant="inherit"></Typography>
                <SelectTodoItemForProduct
                    todoItems={todoItems}
                    onTodoItemSubmit={onTodoItemSubmit}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeNewProductDialog}>Cancel</Button>
            </DialogActions>
        </Dialog>
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
