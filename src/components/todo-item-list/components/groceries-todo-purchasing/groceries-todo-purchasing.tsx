import React, { useEffect, useState } from "react";
import Scanner from "../../../../Scanner";
import TodoListView from "../todo-item-list-view";
import TodoItemPriceSubmitDialog from "../todo-item-price-submit-dialog";
import useGroceriesTodoPurchasingController from "./use-groceries-todo-purchasing-controller";
import scan from '../../../icons/scan.png'
import { QuaggaJSResultObject } from "@ericblade/quagga2";
import { useHistory } from "react-router-dom";
import { Button, Dialog, IconButton } from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";


const GroceriesTodoPurchasingModeView: React.FC<{}> = () => {

    const purchasingController = useGroceriesTodoPurchasingController();
    const history = useHistory();

    useEffect(() => {
        let scannedResult = purchasingController.scannedProductResult;
        let productToAdd = purchasingController.productToAdd;
        if (purchasingController.openAddNewProductForm && scannedResult !== null) {
            if (window.confirm(`There is no product with barcode ${scannedResult.code} in the list and in database.\nDo you want to go to 'Add new item' page?`)) {
                history.push('new-product');
            } else {
                purchasingController.dismissSubmitingNewProduct();
            }
        } else if (purchasingController.openAddProductConfirmation && productToAdd !== null) {
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

        <TodoListView showPurchaseAction={true} onTodoItemPurchaseToggle={purchasingController.toggleTodoItemPurchaseStatus}/>
        <hr />
        <table>
            <tbody>
                <tr>
                    <td colSpan={4}>
                        <Button variant="contained" onClick={() => purchasingController.enableScanner()} startIcon={<SettingsOverscanIcon />}>
                            Scan barcode
                        </Button>
                        <Dialog open={purchasingController.openScanner} onClose={() => purchasingController.disableScanner()}>
                            <Scanner onDetected={(result: any) => purchasingController.onBarcodeScan(result as QuaggaJSResultObject)} />
                        </Dialog>
                    </td>
                </tr>
                
                <tr>
                    <td colSpan={4}>
                        <p>You are currently in the purchase mode. Scan or type product's barcode to mark as purchased.</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </>)
}

export default GroceriesTodoPurchasingModeView;