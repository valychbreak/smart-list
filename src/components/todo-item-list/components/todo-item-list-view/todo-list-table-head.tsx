import {
    TableHead, TableRow, TableCell, Checkbox, TableSortLabel,
    makeStyles, SortDirection,
} from "@material-ui/core";
import React, { useContext } from "react";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import StoreSelect from "../../../store-select";
import { Store } from "../../types";
import GroceriesTodoStoreContext from "../groceries-todo-store-context/groceries-todo-store-context";

const useStyles = makeStyles(() => ({
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
    },
}));

const headCells = [
    {
        id: "generalName", numeric: false, disablePadding: true, label: "Name",
    },
    {
        id: "quantity", numeric: true, disablePadding: false, label: "Quantity",
    },
];

type EnhancedTableHeadProps = {
    showPurchaseAction: boolean;
    order: SortDirection;
    orderBy: string;
    numSelected: number;
    rowCount: number;
    onRequestSort(event: any, property: string): void;
    onSelectAllClick(event: any): void;
};

type TodoItemListHeaderProps = {
    showPurchaseAction: boolean;
    order: SortDirection;
    orderBy: string;
    onRequestSort(event: any, property: string): void;
};

export const TodoItemListHeader: React.FC<TodoItemListHeaderProps> = ({ ...props }) => {
    const {
        order, orderBy, onRequestSort,
    } = props;

    const todoItemListContext = useContext(TodoItemListContext);

    // FIXME: copied from groceries-todo-tool-bar component
    const selectedItemsCount = todoItemListContext.todoItems
        .filter((todoItem) => todoItem.isBought === true).length;

    const maxItemsCount = todoItemListContext.todoItems.length;

    const handleSelectAllClick = () => {
        const isPurchased = selectedItemsCount !== maxItemsCount;
        todoItemListContext.todoItems
            .forEach((todoItem) => todoItemListContext.toggleItemPurchased(todoItem, isPurchased));
    };

    return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <EnhancedTableHead
            numSelected={selectedItemsCount}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={onRequestSort}
            rowCount={maxItemsCount}
            showPurchaseAction={props.showPurchaseAction} />
    );
};

export function EnhancedTableHead(props: EnhancedTableHeadProps) {
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
    const {
        selectedStore, storeList, selectStore, clearSelection,
    } = useContext(GroceriesTodoStoreContext);

    const createSortHandler = (property: string) => (event: any) => {
        onRequestSort(event, property);
    };

    const onStoreSelect = (store: Store | null) => {
        if (store) {
            selectStore(store);
        } else {
            clearSelection();
        }
    };

    return (
        <TableHead>
            <TableRow>
                {showPurchaseAction
                    && <TableCell padding="none">
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
                            direction={orderBy === headCell.id ? order as "asc" | "desc" : "asc"}
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
                    <StoreSelect
                        selectedStore={selectedStore}
                        storeList={storeList}
                        onStoreSelect={(store) => onStoreSelect(store)}
                    />
                </TableCell>
                <TableCell padding="none"></TableCell>
            </TableRow>
        </TableHead>
    );
}
