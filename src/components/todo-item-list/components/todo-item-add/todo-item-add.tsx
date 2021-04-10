import React, { useContext, useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import AddTodoItemForm from "../../../../pages/groceries-todo/components/AddTodoItemForm";
import TodoItem from "../../types";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import Scanner from "../../../../Scanner";
import { useHistory } from "react-router";
import { Dialog, IconButton } from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";


const AddTodoItemComponent = (props: any) => {
    const [isScannerEnabled, setScannerEnabled] = useState(false);
    const todoItemListContext = useContext(TodoItemListContext);
    const history = useHistory();

    const enableScanner = () => {
        setScannerEnabled(true);
    }

    const disableScanner = () => {
        setScannerEnabled(false);
    }
    
    const onBarcodeDetected = (result: any) => {
        disableScanner();

        let barcode = result.codeResult?.code;
        let barcodeType = result.codeResult?.format;

        if (barcode && barcodeType) {
            ProductApi.findByBarcode(barcode, barcodeType).then(product => {
                if (product == null) {
                    if (window.confirm(`Scanned barcode  ${barcode} (${barcodeType}) does not exist in our database. \nDo you want to go to 'Add new item' page?`)) {
                        history.push('new-product');
                    }
                } else {
                    const newItem = TodoItem.fromProduct(product);
                    todoItemListContext.addItem(newItem);
                }
            })
        }
    }

    return (
        <tr>
            <td>
                <IconButton onClick={() => enableScanner()}>
                    <SettingsOverscanIcon />
                </IconButton>

                <Dialog open={isScannerEnabled} onClose={disableScanner}>
                    <Scanner onDetected={onBarcodeDetected} />
                </Dialog>
            </td>
            <td colSpan={2}>
                <AddTodoItemForm />
            </td>
            <td colSpan={3}>
            </td>
        </tr>
    )
}

export default AddTodoItemComponent;
