import { FormControlLabel, IconButton, ListItemText, Menu, MenuItem, Switch, ListItemIcon, MenuProps, withStyles, Button } from "@material-ui/core"
import React, { useContext } from "react"
import MenuIcon from "@material-ui/icons/Menu"
import { StyledMenu, useMenuController } from "../../../custom-menu"
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext"

type GroceriesTodoToolbarMenuProps = {
    onPurchaseModeToggle(toggle: boolean): void;
}
const GroceriesTodoToolbarMenu = (props: GroceriesTodoToolbarMenuProps) => {

    const [mode, setMode] = React.useState(false);
    const { open, anchorElement, openMenu, closeMenu } = useMenuController();
    const todoItemListContext = useContext(TodoItemListContext);

    const handleChangemode = (event: any) => {
        const checked = event.target.checked;
        setMode(checked);
        props.onPurchaseModeToggle(checked);
    };

    const clearTodoList = () => {
        closeMenu();
        if (window.confirm("Are you sure you want to clear the list? CANNOT BE UNDONE!")) {
            todoItemListContext.clearItems();
        }
    }


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
    </>)
}

export default GroceriesTodoToolbarMenu;
