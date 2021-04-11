import { Grid, Typography } from "@material-ui/core";
import React from "react";
import TodoItem from "../../types";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";

const GroceriesTodoPlanningModeView: React.FC<{}> = () => {

    const onTodoItemPurchaseToggle = (todoItem: TodoItem, isBought: boolean) => {
        throw Error("Purchasing is disabled")
    }

    return (<>
        <TodoListView showPurchaseAction={false} 
                      onTodoItemPurchaseToggle={onTodoItemPurchaseToggle} />
        
        <Grid container spacing={3}>
                <AddTodoItemComponent />
        </Grid>
    </>)
}

export default GroceriesTodoPlanningModeView;