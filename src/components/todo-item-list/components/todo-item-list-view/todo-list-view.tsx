import React, { useContext } from "react";
import TodoItem from "../../types";
import TodoListItemView from "../../../../pages/groceries-todo/components/TodoListItemView";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import './todo-list-view.css'
import { makeStyles, Table, TableBody, TableContainer } from "@material-ui/core";
import { EnhancedTableHead } from "./todo-list-table-head";

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
    },
}));

type SortElement = {
    todoItem: TodoItem;
    index: number;
}
function stableSort(array: TodoItem[], comparator: any): TodoItem[] {
    const stabilizedThis = array.map((el, index): SortElement => {
        return { todoItem: el, index: index }
    });

    stabilizedThis.sort((a: SortElement, b: SortElement) => {
        const order = comparator(a.todoItem, b.todoItem);
        if (order !== 0) return order;
        return a.index - b.index;
    });
    return stabilizedThis.map((el) => el.todoItem);
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
    const [orderBy, setOrderBy] = React.useState("generalName");

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
                            return (
                                <TodoListItemView item={todoItem}
                                    showPurchaseAction={showPurchaseAction}
                                    onTodoItemPurchaseToggle={props.onTodoItemPurchaseToggle}
                                    key={todoItem.id} />
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}

export default TodoListView;
