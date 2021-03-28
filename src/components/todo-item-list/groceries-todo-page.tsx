import React, { useState } from "react";
import './groceries-todo-page.css'
import { TodoItemListContextProvider } from "../../pages/groceries-todo/context/TodoItemListContextProvider";
import useGroceriesTodoController, { Mode } from "./components/use-groceries-todo-controller";
import GroceriesTodoPlanningModeView from "./components/groceries-todo-planning";
import GroceriesTodoPurchasingModeView from "./components/groceries-todo-purchasing";


const GroceriesTodoPage = () => {

    const controller = useGroceriesTodoController();

    return (<>
        <legend>Purchase list</legend>
        <div>
            <TodoItemListContextProvider>

                {controller.currentMode === Mode.PLANNING && <>
                    <GroceriesTodoPlanningModeView />
                    <div className="myBTN">
                        <button onClick={controller.enablePurchasingMode}>Purchase mode</button>
                    </div>
                </>}

                {controller.currentMode === Mode.PURCHASING && <>
                    <GroceriesTodoPurchasingModeView />
                    <div className="myBTN">
                        <button onClick={controller.enablePlanningMode}>Exit Purchase mode</button>
                    </div>
                </>}

                <div className="myBTN">
                    <button>Export to csv</button>
                </div>
            </TodoItemListContextProvider>
        </div>
    </>);
}


export default GroceriesTodoPage;
