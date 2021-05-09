import { useContext } from "react";
import { TableRow, TableCell, Checkbox, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";
import TodoItemQuantityAdjustmentField from "../todo-item-quantity-adjustment-field";

interface StorePriceViewProps {
    quantity: number;
    price: number | null;
}

function currencyFormat(amount: number) {
    return amount.toFixed(2);
}

function isLinkedTodoItem(todoItem: TodoItem): boolean {
    return !!todoItem.targetProduct;
}

export const StorePriceView = (props: StorePriceViewProps) => {
    const { quantity, price } = props;

    if (price) {
        return <span>{currencyFormat(price * quantity)} PLN</span>;
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

    const todoItem = props.item;

    function togglePurchase(toggle: boolean) {
        props.onTodoItemPurchaseToggle(props.item, toggle);
    }

    const deleteTodoItem = () => {
        todoItemListProvider.removeItem(props.item);
    };

    const todoItemName = isLinkedTodoItem(todoItem)
        ? `${todoItem.generalName}*`
        : todoItem.generalName;

    const isPurchased = props.item.isBought;

    const todoItemPrice = (
        isPurchased && todoItem.purchasedPrice
            ? todoItem.purchasedPrice
            : todoItem.productPrice
    );

    return (
        <TableRow
            hover
            role="checkbox"
            aria-checked={isPurchased}
            tabIndex={-1}
            selected={isPurchased}
        >
            {props.showPurchaseAction && (
                <TableCell padding="none">
                    <Checkbox
                        data-test-id="todo-item-purchase-checkbox"
                        checked={isPurchased}
                        onChange={() => togglePurchase(!isPurchased)}
                        inputProps={{ "aria-labelledby": "todo-item-name" }}
                    />
                </TableCell>
            )}
            <TableCell
                data-test-id="todo-item-name"
                component="th"
                id="todo-item-name"
                scope="row"
            >
                {todoItemName}
            </TableCell>
            <TableCell>
                <TodoItemQuantityAdjustmentField todoItem={todoItem} />
            </TableCell>
            <TableCell>
                <StorePriceView
                    quantity={todoItem.quantity}
                    price={todoItemPrice}
                />
            </TableCell>
            <TableCell padding="none">
                <IconButton onClick={deleteTodoItem}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default TodoListItemView;
