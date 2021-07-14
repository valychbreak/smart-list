import {
    IconButton, lighten, makeStyles, Toolbar, Tooltip, Typography,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import clsx from "clsx";
import React, { useContext } from "react";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import GroceriesTodoToolbarMenu, { GroceriesTodoToolbarMenuProps } from "./tool-bar-menu";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === "light"
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: "1 1 100%",
    },
}));

function formatDate(date: Date) {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) { month = `0${month}`; }
    if (day.length < 2) { day = `0${day}`; }

    return [day, month, year].join("-");
}

type GroceriesTodoToolbarProps = {} & GroceriesTodoToolbarMenuProps;

const GroceriesTodoToolbar = (props: GroceriesTodoToolbarProps) => {
    const classes = useToolbarStyles();

    const todoItemListContext = useContext(TodoItemListContext);

    const selectedItemsCount = todoItemListContext.todoItems
        .filter((todoItem) => todoItem.isBought === true)
        .length;

    const maxItemsCount = todoItemListContext.todoItems.length;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: selectedItemsCount > 0,
            })}
        >
            <GroceriesTodoToolbarMenu
                currentMode={props.currentMode}
                onPurchaseModeToggle={props.onPurchaseModeToggle} />

            {selectedItemsCount > 0 ? (
                <Typography
                    className={classes.title}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {maxItemsCount - selectedItemsCount} items left
                </Typography>
            ) : (
                <Typography className={classes.title} id="tableTitle" component="div">
                    List of {formatDate(new Date())} ({maxItemsCount} items)
                </Typography>
            )}

            {selectedItemsCount > 0 ? (
                <Tooltip title="Hide selected">
                    {/* span is required for the tool tip until IconButton is enabled again */}
                    <span>
                        <IconButton disabled>
                            <FilterListIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list"></IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

export default GroceriesTodoToolbar;
