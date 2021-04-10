import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Select, MenuItem, withStyles, InputBase } from "@material-ui/core";
import React from "react";
import COUNTERPARTY_LIST from "../../../../api/Constants";


const BootstrapInput = withStyles((theme) => ({}))(InputBase);

const headCells = [
    { id: "generalName", numeric: false, disablePadding: true, label: "Name" },
    { id: "quantity", numeric: true, disablePadding: false, label: "Quantity" }
];

export function EnhancedTableHead(props: any) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        showPurchaseAction,
    } = props;
    const createSortHandler = (property: string) => (event: any) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {showPurchaseAction && 
                    <TableCell padding="none">
                        <Checkbox
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