import React, { useContext, useState } from "react";
import ProductApi from "../../../../api/ProductApi";
import AddTodoItemForm from "../../../../pages/groceries-todo/components/AddTodoItemForm";
import TodoItem from "../../../../pages/groceries-todo/components/TodoItem";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import Scanner from "../../../../Scanner";
import CustomDialog from "../../../custom-dialog";
import scan from '../../../icons/scan.png';



const AddTodoItemComponent = (props: any) => {
    const [isScannerEnabled, setScannerEnabled] = useState(false);
    const todoItemListContext = useContext(TodoItemListContext);

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
                        props.history.push('new-product');
                    }
                } else {
                    const newItem = new TodoItem(Date.now(), product.productGeneralName);
                    newItem.quantity = 1;
                    newItem.targetProduct = product;
                    todoItemListContext.addItem(newItem);
                }
            })
        }
    }

    return (
        <tr>
            <td className="T_action_button">
                <div className="center">
                    <label htmlFor="show" className="show-btn" title="Enable scanner">
                        <img src={scan} onClick={() => enableScanner()} alt="remove" className="icon_scan" />
                    </label>

                    <CustomDialog open={isScannerEnabled} handleClose={disableScanner}>
                        <Scanner onDetected={onBarcodeDetected} />
                    </CustomDialog>
                </div>
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
