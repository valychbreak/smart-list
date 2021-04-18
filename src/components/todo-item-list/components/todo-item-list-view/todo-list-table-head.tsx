import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Select, MenuItem, withStyles, InputBase, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import GroceriesTodoStoreContext from "../groceries-todo-store-context/groceries-todo-store-context";


const useStyles = makeStyles((theme) => ({
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute"
    }
}));

const BootstrapInput = withStyles((theme) => ({}))(InputBase);

const headCells = [
    { id: "generalName", numeric: false, disablePadding: true, label: "Name" },
    { id: "quantity", numeric: true, disablePadding: false, label: "Quantity" }
];

type EnhancedTableHeadProps = {
    showPurchaseAction: boolean;
    order: string;
    orderBy: string;
    numSelected: number;
    rowCount: number;
    onRequestSort(event: any, property: string): void;
    onSelectAllClick(): void;
}

type TodoItemListHeaderProps = {
    showPurchaseAction: boolean;
    order: string;
    orderBy: string;
    onRequestSort(event: any, property: string): void;
};

export const TodoItemListHeader: React.FC<TodoItemListHeaderProps> = ({...props}) => {
    const {
        order, orderBy, onRequestSort
    } = props;

    const todoItemListContext = useContext(TodoItemListContext);

    // FIXME: copied from groceries-todo-tool-bar component
    const selectedItemsCount = todoItemListContext.todoItems.filter(todoItem => todoItem.isBought === true).length;
    const maxItemsCount = todoItemListContext.todoItems.length;

    const handleSelectAllClick = (event: any) => {
        const isPurchased = selectedItemsCount != maxItemsCount;
        for (let todoItem of todoItemListContext.todoItems) {
            todoItemListContext.toggleItemPurchased(todoItem, isPurchased);
        }
    };

    return (
        <EnhancedTableHead 
            numSelected={selectedItemsCount}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={onRequestSort}
            rowCount={maxItemsCount}
            showPurchaseAction={props.showPurchaseAction} />
    )
}

export function EnhancedTableHead(props: any) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        showPurchaseAction,
    } = props;

    const classes = useStyles();
    const { selectedStore, storeList, selectStore, clearSelection } = useContext(GroceriesTodoStoreContext);

    const createSortHandler = (property: string) => (event: any) => {
        onRequestSort(event, property);
    };

    const onStoreSelect = (event: any) => {
        const value = event.target.value as string;
        const store = storeList.find(store => store.name === value);
        if (store) {
            selectStore(store);
        } else {
            clearSelection();
        }
    }

    return (
        <TableHead>
            <TableRow>
                {showPurchaseAction && 
                    <TableCell padding="none">
                        <Checkbox
                            // disabling due to issue with re-rendering not happening
                            disabled
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ "aria-label": "select all desserts" }}
                        />
                    </TableCell>
                }
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
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
                <TableCell>
                    <Select
                        onChange={onStoreSelect}
                        value={selectedStore ? selectedStore.name : "None"}
                        input={<BootstrapInput />}
                    >
                        <MenuItem value="None">
                            None
                        </MenuItem>
                        {storeList.map((store) => (
                            <MenuItem key={store.id} value={store.name}>
                                {store.name}
                            </MenuItem>
                        ))}
                    </Select>
                </TableCell>
                <TableCell padding="none"></TableCell>
            </TableRow>
        </TableHead>
    );
}