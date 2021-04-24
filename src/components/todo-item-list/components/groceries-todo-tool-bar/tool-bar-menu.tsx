import {
    FormControlLabel, IconButton, ListItemText, MenuItem, Switch,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { StyledMenu, useMenuController } from "../../../custom-menu";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { Mode } from "../use-groceries-todo-controller";

export type GroceriesTodoToolbarMenuProps = {
    currentMode: Mode;
    onPurchaseModeToggle(toggle: boolean): void;
};

const GroceriesTodoToolbarMenu = (props: GroceriesTodoToolbarMenuProps) => {
    const [mode, setMode] = React.useState(false);
    const {
        open, anchorElement, openMenu, closeMenu,
    } = useMenuController();
    const todoItemListContext = useContext(TodoItemListContext);

    useEffect(() => {
        setMode(props.currentMode === Mode.PURCHASING);
    }, [props.currentMode]);

    const handleChangemode = (event: any) => {
        const { checked } = event.target;
        setMode(checked);
        props.onPurchaseModeToggle(checked);
    };

    const clearTodoList = () => {
        closeMenu();
        // eslint-disable-next-line no-alert
        if (window.confirm("Are you sure you want to clear the list? CANNOT BE UNDONE!")) {
            todoItemListContext.clearItems();
        }
    };

    return (<>
        <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={openMenu}
        >
            <MenuIcon />
        </IconButton>
        <StyledMenu open={open} anchorEl={anchorElement} onClose={closeMenu}>
            <MenuItem>
                <FormControlLabel
                    control={<Switch checked={mode} onChange={handleChangemode} />}
                    label="Purchase mode"
                />
            </MenuItem>
            <MenuItem onClick={clearTodoList} >
                <ListItemText primary="Clear list" />
            </MenuItem>
            <MenuItem onClick={closeMenu} >
                <ListItemText primary="Export to CSV" />
            </MenuItem>
        </StyledMenu>
    </>);
};

export default GroceriesTodoToolbarMenu;
