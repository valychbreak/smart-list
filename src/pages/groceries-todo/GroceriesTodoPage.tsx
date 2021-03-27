import React from "react";
import './GroceriesTodoPage.css'
import TodoListView from "../../components/todo-item-list/components/todo-item-list-view";
import { TodoItemListContextProvider } from "./context/TodoItemListContextProvider";
import { RouteComponentProps, withRouter } from "react-router";
import AddTodoItemComponent from "../../components/todo-item-list/components/todo-item-add";
import TodoItemPriceSubmitDialog from "../../components/todo-item-list/components/todo-item-price-submit-dialog";
import useGroceriesTodoController, { Mode } from "../../components/todo-item-list/components/use-groceries-todo-controller";


const GroceriesTodoPage = (props: RouteComponentProps) => {

    const controller = useGroceriesTodoController();

    return (<>
        <legend>Purchase list</legend>
        <div>
            <TodoItemListContextProvider onItemPurchaseToggle={controller.onItemPurchaseToggle}>

                <TodoItemPriceSubmitDialog open={controller.openPriceSubmission} 
                                            selectedItem={controller.selectedItem} 
                                            handleClose={controller.onPriceSubmissionClose} />

                <TodoListView showPurchaseAction={controller.showPurchaseAction}/>
                <hr />

                <table>
                    <tbody>
                        <AddTodoItemComponent />
                        <tr>
                            <td colSpan={2}>
                                <div className="myBTN">
                                    {controller.currentMode === Mode.PLANNING && 
                                        <button onClick={controller.enablePurchasingMode}>Purchase mode</button>
                                    }
                                    {controller.currentMode === Mode.PURCHASING && 
                                        <button onClick={controller.enablePlanningMode}>Exit Purchase mode</button>
                                    }
                                </div>
                                <div className="myBTN">
                                    <button>Export to csv</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                {controller.currentMode === Mode.PLANNING && 
                                    <p>You are currently in the list preparation mode. Add items you are planning to buy by scanning barcode or typing Product General Name (e.g. milk, tea, bread).</p>
                                }
                                {controller.currentMode === Mode.PURCHASING && 
                                    <p>You are currently in the purchase mode. Scan or type product's barcode to mark as purchased.</p>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </TodoItemListContextProvider>
        </div>
    </>);
}


export default withRouter(GroceriesTodoPage);
