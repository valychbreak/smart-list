import { Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";

function ccyFormat(num: number) {
    return `${num.toFixed(2)}`;
}

const useTodoItemsTotalPriceController = () => {
    const todoItemListContext = useContext(TodoItemListContext);

    const totalPriceByCounterparty = (counterparty: string): number => {
        return todoItemListContext.todoItems
            .map(todoItem => {
                const priceData = todoItem.priceData.perCounterpartyPrice[counterparty];
                return priceData ? priceData.price : 0;
            })
            .reduce((previousValue: number, currentValue: number) => {
                return previousValue + currentValue;
            } , 0);
    }

    return {
        totalPriceByCounterparty: totalPriceByCounterparty
    }
}

const GroceriesTodoPlanningModeView: React.FC<{}> = () => {

    const todoItemsTotalPriceController = useTodoItemsTotalPriceController();

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
                Total: {ccyFormat(todoItemsTotalPriceController.totalPriceByCounterparty("Auchan"))}
            </Grid>
        </Grid>
    </>)
}

export default GroceriesTodoPlanningModeView;