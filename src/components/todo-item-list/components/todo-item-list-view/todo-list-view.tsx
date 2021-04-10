import React, { useContext } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import TodoItem from "../../types";
import TodoListItemView from "../../../../pages/groceries-todo/components/TodoListItemView";
import remove from '../../../icons/remove.jfif';
import add from '../../../icons/add2.png';
import COUNTERPARTY_LIST from "../../../../api/Constants";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import './todo-list-view.css'
import { Checkbox, InputBase, makeStyles, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, withStyles } from "@material-ui/core";

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


const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Name" },
    { id: "quantity", numeric: true, disablePadding: false, label: "Quantity" }
];

function EnhancedTableHead(props: any) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort
    } = props;
    const createSortHandler = (property: string) => (event: any) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="none">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ "aria-label": "select all desserts" }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding="none"
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell padding="none">
                    <Select
                        id="price1"
                        //onChange={handleChange}
                        value="Auchan"
                        input={<BootstrapInput />}
                    >
                        <MenuItem value="Auchan">
                            <em>Auchan</em>
                        </MenuItem>
                        {COUNTERPARTY_LIST.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === "Auchan"}
                            //onClick={handleChange}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </TableCell>
                <TableCell padding="none"></TableCell>
            </TableRow>
        </TableHead>
    );
}

function stableSort(array: any[], comparator: any) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function ccyFormat(num: number) {
    // doesn't work
    // return `${num.toFixed(2)}`;
    return `${num}`;
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

const BootstrapInput = withStyles((theme) => ({}))(InputBase);

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

    const handleClick = (e: any, todoItem: TodoItem) => {
        // purchase logic
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
                />
                <TableBody>
                    {stableSort(todoItemListContext.todoItems, getComparator(order, orderBy))
                        .map((todoItem: TodoItem, index) => {
                            const isItemSelected = todoItem.isBought;
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, todoItem)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={index}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="none">
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{ "aria-labelledby": labelId }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                    >
                                        {todoItem.generalName}
                                    </TableCell>
                                    <TableCell padding="none">
                                        <div className="quantity-input">
                                            <button className="quantity-input__modifier quantity-input__modifier--left">
                                                &mdash;
                                            </button>
                                            <input
                                                id="quantity"
                                                className="quantity-input__screen"
                                                type="text"
                                                value={todoItem.quantity}
                                            />
                                            <button className="quantity-input__modifier quantity-input__modifier--right">
                                                &#xff0b;
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell padding="none">
                                        {ccyFormat(todoItem.priceData.perCounterpartyPrice["Auchan"].price)}
                                    </TableCell>
                                    <TableCell padding="none">
                                        <DeleteIcon />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
        <table>
            <thead>
                <tr className="cpty">
                    <td className="T_action_button" hidden={!showPurchaseAction}>
                        Purchased
                    </td>
                    <td>
                        Item list
                    </td>
                    <td>
                        Quantity
                    </td>
                    <td>
                        Latest price
                    </td>
                    {COUNTERPARTY_LIST.map((counterparty: string, idx: number) => {
                        return <td className="cpty" key={idx}>
                            {counterparty}
                            <img src={remove} alt="remove" className="icons" />
                        </td>
                    })}
                    <td className="T_action_button">
                        <img src={add} alt="add" className="icons" />
                    </td>
                </tr>
            </thead>
            <tbody>
                {todoItemListContext.todoItems.map((item: TodoItem, idx: number) => (
                    <TodoListItemView item={item}
                        showPurchaseAction={showPurchaseAction}
                        onTodoItemPurchaseToggle={props.onTodoItemPurchaseToggle}
                        key={idx} />
                ))}
                <tr>
                    <td hidden={!showPurchaseAction} />
                    <td colSpan={3} />
                    {COUNTERPARTY_LIST.map((counterparty: string, idx: number) => {
                        return <td className="cpty" key={idx}>
                            [total_sum]
                        </td>
                    })}
                </tr>
            </tbody>
        </table>

    </>);
}

export default TodoListView;
