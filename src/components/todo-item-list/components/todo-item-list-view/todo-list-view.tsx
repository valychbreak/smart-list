import React, { useContext } from "react";

import TodoItem from "../../types";
import TodoListItemView from "../../../../pages/groceries-todo/components/TodoListItemView";
import remove from '../../../icons/remove.jfif';
import add from '../../../icons/add2.png';
import COUNTERPARTY_LIST from "../../../../api/Constants";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import './todo-list-view.css'
import { Checkbox, InputBase, makeStyles, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, withStyles } from "@material-ui/core";
import { EnhancedTableHead } from "./todo-list-table-head";
import TodoItemQuantityAdjustmentField from "../todo-item-quantity-adjustment-field";
import QuantityField from "../../../quantity-field";

const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        marginBottom: theme.spacing(2)
    },
    table: {},
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute"
    },
    container: {
        maxHeight: 360
    }
}));

function stableSort(array: any[], comparator: any) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function getComparator(order: string, orderBy: string) {
    return order === "desc"
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
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

    // FIXME: copied from groceries-todo-tool-bar component
    const selectedItemsCount = todoItemListContext.todoItems.filter(todoItem => todoItem.isBought === true).length;
    const maxItemsCount = todoItemListContext.todoItems.length;

    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("quantity");

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: any) => {

    };

    const clearTodoList = () => {
        if (window.confirm("Are you sure you want to clear the list? CANNOT BE UNDONE!")) {
            todoItemListContext.clearItems();
        }
    }

    return (<>
        <button onClick={e => clearTodoList()}>CLEAR LIST</button>
        <TableContainer className={classes.container}>
            <Table
                stickyHeader
                className={classes.table}
                aria-labelledby="tableTitle"
                size="small"
                aria-label="enhanced table"
            >
                <EnhancedTableHead
                    classes={classes}
                    numSelected={selectedItemsCount}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={maxItemsCount}
                    showPurchaseAction={showPurchaseAction}
                />
                <TableBody>
                    {stableSort(todoItemListContext.todoItems, getComparator(order, orderBy))
                        .map((todoItem: TodoItem, idx: number) => {
                            return <TodoListItemView item={todoItem}
                                        showPurchaseAction={showPurchaseAction}
                                        onTodoItemPurchaseToggle={props.onTodoItemPurchaseToggle}
                                        key={idx} />
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}

export default TodoListView;
