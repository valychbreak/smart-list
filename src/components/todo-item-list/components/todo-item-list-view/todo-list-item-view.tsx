import React, { useContext } from "react";
import {
    TableRow, TableCell, Checkbox, IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem, { ProductPriceData, Store } from "../../types";
import CategorySelector from "../../../category-selector";
import Category from "../../../../entity/category";
import UserCategoryAPI from "../../../../api/UserCategoryAPI";
import TodoItemQuantityAdjustmentField from "../todo-item-quantity-adjustment-field";
import GroceriesTodoStoreContext from "../groceries-todo-store-context/groceries-todo-store-context";

interface StorePriceViewProps {
    store: Store | null;
    quantity: number;
    priceData: ProductPriceData;
}

function currencyFormat(amount: number) {
    return amount.toFixed(2);
}

function isLinkedTodoItem(todoItem: TodoItem): boolean {
    return !!todoItem.targetProduct;
}

const StorePriceView = (props: StorePriceViewProps) => {
    const { quantity, priceData } = props;
    const storeName = props.store?.name;

    const storePriceData = storeName ? priceData.getCounterpartyPrice(storeName) : undefined;
    if (storePriceData) {
        const storePrice = storePriceData.price;
        return <span>{currencyFormat(storePrice * quantity)} PLN</span>;
    }
    return <span>No data yet</span>;
};

interface TodoListItemViewProps {
    item: TodoItem;
    showPurchaseAction: boolean;
    onTodoItemPurchaseToggle(todoItem: TodoItem, isBought: boolean): void;
}

const TodoListItemView = (props: TodoListItemViewProps) => {
    const todoItemListProvider = useContext(TodoItemListContext);
    const { selectedStore } = useContext(GroceriesTodoStoreContext);

    function togglePurchase(toggle: boolean) {
        props.onTodoItemPurchaseToggle(props.item, toggle);
    }

    const deleteTodoItem = () => {
        todoItemListProvider.removeItem(props.item);
    };

    const todoItem = props.item;

    const todoItemName = isLinkedTodoItem(todoItem) ? `${todoItem.generalName}*` : todoItem.generalName;
    const isPurchased = props.item.isBought;

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
                    <Checkbox
                        data-test-id="todo-item-purchase-checkbox"
                        checked={isPurchased}
                        onChange={() => togglePurchase(!isPurchased)}
                        inputProps={{ "aria-labelledby": "todo-item-name" }}
                    />
                </TableCell>
            }
            <TableCell data-test-id="todo-item-name" component="th" id="todo-item-name" scope="row">
                {todoItemName}
            </TableCell>
            <TableCell>
                <TodoItemQuantityAdjustmentField todoItem={todoItem} />
            </TableCell>
            <TableCell>
                <StorePriceView
                    store={selectedStore}
                    quantity={todoItem.quantity}
                    priceData={todoItem.priceData} />
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
