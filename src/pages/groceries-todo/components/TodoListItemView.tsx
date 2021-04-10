import React, { useContext, useReducer, useState } from "react";
import COUNTERPARTY_LIST from "../../../api/Constants";
import PriceData from "../../../entity/PriceData";
import TodoItemListContext from "../context/TodoItemListContext";
import TodoItem from "../../../components/todo-item-list/types";
import CategorySelector from "../../../components/category-selector";
import Category from "../../../entity/category";
import UserCategoryAPI from "../../../api/UserCategoryAPI";
import { TableRow, TableCell, Checkbox, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import TodoItemQuantityAdjustmentField from "../../../components/todo-item-list/components/todo-item-quantity-adjustment-field";


interface TodoListItemViewProps {
    item: TodoItem;
    showPurchaseAction: boolean;
    onTodoItemPurchaseToggle(todoItem: TodoItem, isBought: boolean): void;
}

const TodoListItemView = (props: TodoListItemViewProps) => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [isPurchased, setIsPurchased] = useState(props.item.isBought);

    const todoItemListProvider = useContext(TodoItemListContext);

    const handleClick = (e: any, todoItem: TodoItem) => {
        // purchase logic
    }

    function togglePurchase(toggle: boolean) {
        setIsPurchased(toggle);
        props.onTodoItemPurchaseToggle(props.item, toggle);
    }

    const deleteTodoItem = () => {
        todoItemListProvider.removeItem(props.item);
    }

    const todoItem = props.item;

    return (
        <TableRow
            hover
            onClick={(event) => handleClick(event, todoItem)}
            role="checkbox"
            aria-checked={isPurchased}
            tabIndex={-1}
            selected={isPurchased}
        >
            {props.showPurchaseAction && 
                <TableCell padding="none">
                    <Checkbox checked={isPurchased} onChange={() => togglePurchase(!isPurchased)} inputProps={{ "aria-labelledby": "todo-item-name" }}/>
                </TableCell>
            }
            <TableCell component="th" id="todo-item-name" scope="row">
                {todoItem.generalName}
            </TableCell>
            <TableCell>
                <TodoItemQuantityAdjustmentField todoItem={todoItem} />
            </TableCell>
            <TableCell>
                <CounterpartyPriceView counterparty="Auchan" priceData={todoItem.priceData.perCounterpartyPrice} />
            </TableCell>
            <TableCell padding="none">
                <IconButton onClick={deleteTodoItem}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

interface CounterpartyPriceViewProps {
    counterparty: string;
    priceData: { [id: string]: PriceData };
}

const CounterpartyPriceView = (props: CounterpartyPriceViewProps) => {

    if (props.priceData[props.counterparty]) {
        return <span>{props.priceData[props.counterparty].price} PLN</span>
    } else {
        return <span>No data yet</span>
    }
}

const ProductCategorySelector = (props: { item: TodoItem }) => {

    const onCategorySelect = (category: Category) => {
        const product = props.item.targetProduct;
        if (product !== undefined) {
            product.category = category;
            UserCategoryAPI.changeCategory(product, category);
        }
    }

    return (
        <CategorySelector defaultCategory={props.item.targetProduct?.category} onCategorySelect={onCategorySelect} />
    )
}


export default TodoListItemView;
