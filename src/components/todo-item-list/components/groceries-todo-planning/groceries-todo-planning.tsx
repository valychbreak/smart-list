import { Grid } from "@material-ui/core";
import React from "react";
import TodoItem from "../../types";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";
import { useTodoItemsTotalPriceController } from "../use-todo-items-total-price-controller";

const GroceriesTodoPlanningModeView: React.FC<{}> = () => {

    const onTodoItemPurchaseToggle = (todoItem: TodoItem, isBought: boolean) => {
        throw Error("Purchasing is disabled")
    }

    return (<>
        <TodoListView showPurchaseAction={false} 
                      onTodoItemPurchaseToggle={onTodoItemPurchaseToggle} />
        
        <Grid container>
            <Grid item xs={12}>
                <AddTodoItemComponent />
            </Grid>
        </Grid>
    </>)
}

export default GroceriesTodoPlanningModeView;