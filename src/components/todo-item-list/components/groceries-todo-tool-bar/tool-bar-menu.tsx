import { FormControlLabel, IconButton, ListItemText, Menu, MenuItem, Switch, ListItemIcon, MenuProps, withStyles } from "@material-ui/core"
import React from "react"
import MenuIcon from "@material-ui/icons/Menu"

type GroceriesTodoToolbarMenuProps = {
    onPurchaseModeToggle(toggle: boolean): void;
}
const GroceriesTodoToolbarMenu = (props: GroceriesTodoToolbarMenuProps) => {

    const [mode, setMode] = React.useState(false);

    const handleChangemode = (event: any) => {
        const checked = event.target.checked;
        setMode(checked);
        props.onPurchaseModeToggle(checked);
    };


    return (<>
        <StyledMenu open={true}>
            <MenuItem>
                <FormControlLabel
                    control={<Switch checked={mode} onChange={handleChangemode} />}
                    label="Purchase mode"
                />
            </MenuItem>
            <MenuItem>
                <ListItemText primary="Clear list" />
            </MenuItem>
            <MenuItem>
                <ListItemText primary="Export to CSV" />
            </MenuItem>
        </StyledMenu>
    </>)
}

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5"
    }
})((props: MenuProps) => {
    const [anchorElement, setAnchorElement] = React.useState(null);

    const {open, ...otherProps} = props;

    const openMenu = (event: any) => {
        setAnchorElement(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorElement(null);
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
        <Menu
            anchorEl={anchorElement}
            open={Boolean(anchorElement)}
            onClose={closeMenu}
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            {...otherProps} />
    </>)
});

export default GroceriesTodoToolbarMenu;
