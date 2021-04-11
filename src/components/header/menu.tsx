import { FormControlLabel, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuProps, Switch, withStyles } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import AssignmentIcon from "@material-ui/icons/Assignment";
import BorderInnerIcon from "@material-ui/icons/BorderInner";
import SearchIcon from "@material-ui/icons/Search";
import VideocamIcon from "@material-ui/icons/Videocam";
import React from "react"
import { AccountBox, Home } from "@material-ui/icons";
import { Link } from "react-router-dom";

const AppMenu = () => {

    const [anchorElement, setAnchorElement] = React.useState(null);
    const [mode, setMode] = React.useState(false);

    const handleChangemode = (event: any) => {
        setMode(event.target.checked);
    };

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

        <StyledMenu
            id="customized-menu"
            anchorEl={anchorElement}
            keepMounted
            open={Boolean(anchorElement)}
            onClose={closeMenu}
        >
            <MenuItem>
                <FormControlLabel
                    control={<Switch checked={mode} onChange={handleChangemode} />}
                    label="Purchase mode"
                />
            </MenuItem>
            <MenuItem component={Link} to='/' onClick={closeMenu}>
                <ListItemIcon>
                    <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </MenuItem>
            <MenuItem component={Link} to='/groceries-todo' onClick={closeMenu}>
                <ListItemIcon>
                    <AssignmentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Groceries to buy" />
            </MenuItem>
            <MenuItem component={Link} to='/new-product' onClick={closeMenu}>
                <ListItemIcon>
                    <BorderInnerIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Add new product" />
            </MenuItem>
            <MenuItem component={Link} to='/browse' onClick={closeMenu}>
                <ListItemIcon>
                    <SearchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Browse products" />
            </MenuItem>
            <MenuItem component={Link} to='/scan-test' onClick={closeMenu}>
                <ListItemIcon>
                    <VideocamIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Test scanner" />
            </MenuItem>
            <MenuItem component={Link} to='/login' onClick={closeMenu}>
                <ListItemIcon>
                    <AccountBox fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Login" />
            </MenuItem>
        </StyledMenu>
    </>)
}

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5"
    }
})((props: MenuProps) => (
    <Menu
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
        {...props}
    />
));

export default AppMenu;
