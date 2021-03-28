import React, { useState } from "react";
import './GroceriesTodoPage.css'
import TodoListView from "../../components/todo-item-list/components/todo-item-list-view";
import { TodoItemListContextProvider } from "./context/TodoItemListContextProvider";
import AddTodoItemComponent from "../../components/todo-item-list/components/todo-item-add";
import TodoItemPriceSubmitDialog from "../../components/todo-item-list/components/todo-item-price-submit-dialog";
import useGroceriesTodoController, { Mode } from "../../components/todo-item-list/components/use-groceries-todo-controller";
import TodoItem from "./components/TodoItem";
import GroceriesTodoPlanningModeView from "../../components/todo-item-list/components/groceries-todo-planning";
import GroceriesTodoPurchasingModeView from "../../components/todo-item-list/components/groceries-todo-purchasing";


const GroceriesTodoPage = () => {

    const controller = useGroceriesTodoController();

    return (<>
        <legend>Purchase list</legend>
        <div>
            <TodoItemListContextProvider>

                {controller.currentMode === Mode.PLANNING && 
                    <GroceriesTodoPlanningModeView />
                }

                {controller.currentMode === Mode.PURCHASING && <>
                    <GroceriesTodoPurchasingModeView />
                </>}

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
            </TodoItemListContextProvider>
        </div>
    </>);
}


export default GroceriesTodoPage;
