import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Button, Container, Dialog, makeStyles, Paper,
} from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import Scanner from "../../../../Scanner";
import TodoListView from "../todo-item-list-view";
import TodoItemPriceSubmitDialog from "../todo-item-price-submit-dialog";
import useGroceriesTodoPurchasingController from "./use-groceries-todo-purchasing-controller";

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
    const history = useHistory();

    useEffect(() => {
        const scannedResult = purchasingController.scannedProductResult;
        const { productToAdd } = purchasingController;
        if (purchasingController.openAddNewProductForm && scannedResult !== null) {
            // eslint-disable-next-line no-alert
            if (window.confirm(`There is no product with barcode ${scannedResult.code} in the list and in database.\nDo you want to go to 'Add new item' page?`)) {
                history.push("new-product");
            } else {
                purchasingController.dismissSubmitingNewProduct();
            }
        } else if (purchasingController.openAddProductConfirmation && productToAdd !== null) {
            // eslint-disable-next-line no-alert
            const addingProductConfirmed = window.confirm(`${productToAdd.productFullName} wasn't added to the list.\n Do you want to add it and mark as purchased?`);
            if (addingProductConfirmed) {
                purchasingController.addPurchasedProduct(productToAdd);
            } else {
                purchasingController.dismissAddingProduct();
            }
        }
    }, [purchasingController.scannedProductResult, purchasingController.productToAdd]);

    return (<>
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
                    <Scanner onDetected={(result) => purchasingController.onBarcodeScan(result)} />
                </Dialog>
            </Paper>
        </Container>
    </>);
};

export default GroceriesTodoPurchasingModeView;
