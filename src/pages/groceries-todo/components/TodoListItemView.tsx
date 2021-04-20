import React, { useContext, useState } from "react";
import {
    TableRow, TableCell, Checkbox, IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PriceData from "../../../entity/PriceData";
import TodoItemListContext from "../context/TodoItemListContext";
import TodoItem, { Store } from "../../../components/todo-item-list/types";
import CategorySelector from "../../../components/category-selector";
import Category from "../../../entity/category";
import UserCategoryAPI from "../../../api/UserCategoryAPI";
import TodoItemQuantityAdjustmentField from "../../../components/todo-item-list/components/todo-item-quantity-adjustment-field";
import GroceriesTodoStoreContext from "../../../components/todo-item-list/components/groceries-todo-store-context/groceries-todo-store-context";

interface StorePriceViewProps {
    store: Store | null;
    quantity: number;
    priceData: { [id: string]: PriceData };
}

function currencyFormat(amount: number) {
    return amount.toFixed(2);
}

const StorePriceView = (props: StorePriceViewProps) => {
    const { quantity } = props;
    const storeName = props.store?.name;

    if (storeName && props.priceData[storeName]) {
        return <span>{currencyFormat(props.priceData[storeName].price * quantity)} PLN</span>;
    }
    return <span>No data yet</span>;
};

interface TodoListItemViewProps {
    item: TodoItem;
    showPurchaseAction: boolean;
    onTodoItemPurchaseToggle(todoItem: TodoItem, isBought: boolean): void;
}

const TodoListItemView = (props: TodoListItemViewProps) => {
    const [isPurchased, setIsPurchased] = useState(props.item.isBought);

    const todoItemListProvider = useContext(TodoItemListContext);
    const { selectedStore } = useContext(GroceriesTodoStoreContext);

    function togglePurchase(toggle: boolean) {
        setIsPurchased(toggle);
        props.onTodoItemPurchaseToggle(props.item, toggle);
    }

    const deleteTodoItem = () => {
        todoItemListProvider.removeItem(props.item);
    };

    const todoItem = props.item;

    return (
        <TableRow
            hover
            role="checkbox"
            aria-checked={isPurchased}
            tabIndex={-1}
            selected={isPurchased}
        >
            {props.showPurchaseAction
                && <TableCell padding="none">
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
                <StorePriceView
                    store={selectedStore}
                    quantity={todoItem.quantity}
                    priceData={todoItem.priceData.perCounterpartyPrice} />
            </TableCell>
            <TableCell padding="none">
                <IconButton onClick={deleteTodoItem}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductCategorySelector = (props: { item: TodoItem }) => {
    const onCategorySelect = (category: Category) => {
        const product = props.item.targetProduct;
        if (product !== undefined) {
            product.category = category;
            UserCategoryAPI.changeCategory(product, category);
        }
    };

    return (
        <CategorySelector
            defaultCategory={props.item.targetProduct?.category}
            onCategorySelect={onCategorySelect} />
    );
};

export default TodoListItemView;
