import React, { useState } from "react";
import { TodoItemListContextProvider } from "../../pages/groceries-todo/context/TodoItemListContextProvider";
import useGroceriesTodoController, { Mode } from "./components/use-groceries-todo-controller";
import GroceriesTodoPlanningModeView from "./components/groceries-todo-planning";
import GroceriesTodoPurchasingModeView from "./components/groceries-todo-purchasing";
import GroceriesTodoToolbar from "./components/groceries-todo-tool-bar";
import { GroceriesTodoStoreContextProvider } from "./components/groceries-todo-store-context";


const GroceriesTodoPage = () => {

    const controller = useGroceriesTodoController();

    const switchMode = (isPurchaseMode: boolean) => {
        if (isPurchaseMode) {
            controller.enablePurchasingMode();
        } else {
            controller.enablePlanningMode();
        }
    }

    return (<>
        <TodoItemListContextProvider>
            <GroceriesTodoStoreContextProvider>
                <GroceriesTodoToolbar onPurchaseModeToggle={switchMode} />
                {controller.currentMode === Mode.PLANNING && <>
                    <GroceriesTodoPlanningModeView />
                </>}

                {controller.currentMode === Mode.PURCHASING && <>
                    <GroceriesTodoPurchasingModeView />
                </>}
            </GroceriesTodoStoreContextProvider>
        </TodoItemListContextProvider>
    </>);
}


export default GroceriesTodoPage;
