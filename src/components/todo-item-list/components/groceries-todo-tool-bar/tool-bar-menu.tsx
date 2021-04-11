import { FormControlLabel, IconButton, ListItemText, Menu, MenuItem, Switch, ListItemIcon, MenuProps, withStyles, Button } from "@material-ui/core"
import React from "react"
import MenuIcon from "@material-ui/icons/Menu"
import { StyledMenu, useMenuController } from "../../../custom-menu"

type GroceriesTodoToolbarMenuProps = {
    onPurchaseModeToggle(toggle: boolean): void;
}
const GroceriesTodoToolbarMenu = (props: GroceriesTodoToolbarMenuProps) => {

    const [mode, setMode] = React.useState(false);

    const { open, anchorElement, openMenu, closeMenu } = useMenuController();

    const handleChangemode = (event: any) => {
        const checked = event.target.checked;
        setMode(checked);
        props.onPurchaseModeToggle(checked);
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
            <MenuItem onClick={closeMenu} >
                <ListItemText primary="Clear list" />
            </MenuItem>
            <MenuItem onClick={closeMenu} >
                <ListItemText primary="Export to CSV" />
            </MenuItem>
        </StyledMenu>
    </>)
}

export default GroceriesTodoToolbarMenu;
