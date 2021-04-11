import { Grid, Typography } from "@material-ui/core";
import React from "react";
import TodoItem from "../../types";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";

function ccyFormat(num: number) {
    // doesn't work
    // return `${num.toFixed(2)}`;
    return `${num}`;
}

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
        <Grid container>
            <Grid item xs={12}>
                Total: {ccyFormat(100)}
            </Grid>
        </Grid>
    </>)
}

export default GroceriesTodoPlanningModeView;