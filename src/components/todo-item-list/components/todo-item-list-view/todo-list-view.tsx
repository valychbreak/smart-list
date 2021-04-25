import React, { useContext } from "react";
import {
    makeStyles, SortDirection, Table, TableBody, TableCell, TableContainer, TableFooter, TableRow,
} from "@material-ui/core";
import TodoListItemView from "../../../../pages/groceries-todo/components/TodoListItemView";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import "./todo-list-view.css";
import { TodoItemListHeader } from "./todo-list-table-head";
import useTodoItemsTotalPriceController from "../use-todo-items-total-price-controller";
import TodoItem from "../../types";

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

function descendingComparator(a: any, b: any, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
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

const TodoListView: React.FC<TodoListViewProps> = ({
    showPurchaseAction = false,
    ...props
}) => {
    const classes = useStyles();
    const todoItemListContext = useContext(TodoItemListContext);
    const todoItemsTotalPriceController = useTodoItemsTotalPriceController();

    const [order, setOrder] = React.useState<SortDirection>("asc");
    const [orderBy, setOrderBy] = React.useState("generalName");

    const handleRequestSort = (event: any, property: string) => {
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
                            {currencyFormat(todoItemsTotalPriceController.totalPriceByCounterparty("Auchan"))} PLN
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </>);
};

export default TodoListView;
