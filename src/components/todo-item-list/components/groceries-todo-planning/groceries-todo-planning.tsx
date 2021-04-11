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
        <hr />
        <Grid container spacing={3}>
                <AddTodoItemComponent />
        </Grid>
        <Grid container>
            <Grid item xs={12}>
                <Typography>You are currently in the list preparation mode. Add items you are planning to buy by scanning barcode or typing Product General Name (e.g. milk, tea, bread).</Typography>
            </Grid>
        </Grid>
    </>)
}

export default GroceriesTodoPlanningModeView;