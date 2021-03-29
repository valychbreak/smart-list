import React, { useState } from "react";
import Scanner from "../../../../Scanner";
import CustomDialog from "../../../custom-dialog";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";
import TodoItemPriceSubmitDialog from "../todo-item-price-submit-dialog";
import useGroceriesTodoPurchasingController from "./use-groceries-todo-purchasing-controller";
import scan from '../../../icons/scan.png'
import { QuaggaJSResultObject } from "@ericblade/quagga2";


const GroceriesTodoPurchasingModeView: React.FC<{}> = () => {

    const [isScanning, setScanning] = useState(false);
    const purchasingController = useGroceriesTodoPurchasingController();

    const enableScanner = () => {
        setScanning(true);
    }

    const disableScanner = () => {
        setScanning(false);
    }
    return (<>
        <TodoItemPriceSubmitDialog open={purchasingController.openPriceSubmission} 
                                   selectedItem={purchasingController.selectedItem} 
                                   handleClose={purchasingController.onPriceSubmissionClose} />

        <TodoListView showPurchaseAction={true} onTodoItemPurchaseToggle={purchasingController.onItemPurchaseToggle}/>
        <hr />
        <table>
            <tbody>
                <tr>
                    <td colSpan={4}>
                        <label htmlFor="show" className="show-btn" title="Enable scanner">
                            <img src={scan} onClick={() => enableScanner()} alt="remove" className="icon_scan" />
                        </label>
                        <CustomDialog open={isScanning} handleClose={() => disableScanner()}>
                            <Scanner onDetected={(result: any) => purchasingController.onBarcodeScan(result as QuaggaJSResultObject)} />
                        </CustomDialog>
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