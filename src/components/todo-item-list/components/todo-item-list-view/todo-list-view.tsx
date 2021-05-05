import React, { useContext } from "react";
import {
    makeStyles, SortDirection, Table, TableBody, TableCell, TableContainer, TableFooter, TableRow,
} from "@material-ui/core";
import TodoListItemView from "./todo-list-item-view";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import "./todo-list-view.css";
import { TodoItemListHeader } from "./todo-list-table-head";
import useTodoItemsTotalPriceController from "../use-todo-items-total-price-controller";
import TodoItem from "../../types";
import { GroceriesTodoStoreContext } from "../groceries-todo-store-context";

const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        marginBottom: theme.spacing(2),
    },
    table: {},
    container: {

    },
}));

type SortElement = {
    todoItem: TodoItem;
    index: number;
};
function stableSort(array: TodoItem[], comparator: any): TodoItem[] {
    const stabilizedThis = array.map((el, index): SortElement => ({ todoItem: el, index }));

    stabilizedThis.sort((a: SortElement, b: SortElement) => {
        const order = comparator(a.todoItem, b.todoItem);
        if (order !== 0) return order;
        return a.index - b.index;
    });
    return stabilizedThis.map((el) => el.todoItem);
}

function descendingComparator(left: any, right: any, orderBy: string) {
    let rightProperty = right[orderBy];
    let leftProperty = left[orderBy];

    if (typeof rightProperty === "string") {
        rightProperty = rightProperty.toLowerCase();
        leftProperty = leftProperty.toLowerCase();
    }

    if (rightProperty < leftProperty) {
        return -1;
    }
    if (rightProperty > leftProperty) {
        return 1;
    }
    return 0;
}

function getComparator(order: SortDirection, orderBy: string) {
    return order === "desc"
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function currencyFormat(num: number) {
    return `${num.toFixed(2)}`;
}

interface TodoListViewProps {
    showPurchaseAction?: boolean;
    onTodoItemPurchaseToggle(todoItem: TodoItem, isBought: boolean): void;
}

const DEFAULT_SORTING_PROPERTY = "id";

const TodoListView: React.FC<TodoListViewProps> = ({
    showPurchaseAction = false,
    ...props
}) => {
    const classes = useStyles();
    const { selectedStore } = useContext(GroceriesTodoStoreContext);
    const todoItemListContext = useContext(TodoItemListContext);
    const todoItemsTotalPriceController = useTodoItemsTotalPriceController();

    const totalPrice = selectedStore
        ? currencyFormat(
            todoItemsTotalPriceController.totalPriceByCounterparty(selectedStore.name),
        )
        : 0;

    const [order, setOrder] = React.useState<SortDirection>("asc");
    const [orderBy, setOrderBy] = React.useState(DEFAULT_SORTING_PROPERTY);

    const setDefaultSorting = () => {
        setOrder("asc");
        setOrderBy(DEFAULT_SORTING_PROPERTY);
    };

    const handleRequestSort = (event: any, property: string) => {
        if (orderBy === property && order === "desc") {
            setDefaultSorting();
            return;
        }

        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    return (<>
        <TableContainer className={classes.container}>
            <Table
                stickyHeader
                className={classes.table}
                aria-labelledby="tableTitle"
                size="small"
                aria-label="enhanced table"
            >
                <TodoItemListHeader
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    showPurchaseAction={showPurchaseAction}
                />
                <TableBody>
                    {stableSort(todoItemListContext.todoItems, getComparator(order, orderBy))
                        .map((todoItem: TodoItem) => (
                            <TodoListItemView item={todoItem}
                                showPurchaseAction={showPurchaseAction}
                                onTodoItemPurchaseToggle={props.onTodoItemPurchaseToggle}
                                key={todoItem.id} />
                        ))
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={showPurchaseAction ? 2 : 1} />
                        <TableCell align="right">
                            Total:
                        </TableCell>
                        <TableCell>
                            {totalPrice} PLN
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </>);
};

export default TodoListView;
