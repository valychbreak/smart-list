import {
    IconButton, ListItemIcon, ListItemText, MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BorderInnerIcon from "@material-ui/icons/BorderInner";
import SearchIcon from "@material-ui/icons/Search";
import VideocamIcon from "@material-ui/icons/Videocam";
import { Home } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { StyledMenu, useMenuController } from "../custom-menu";

const AppMenu = () => {
    const {
        open, anchorElement, openMenu, closeMenu,
    } = useMenuController();

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
            open={open}
            onClose={closeMenu}
        >
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
        </StyledMenu>
    </>);
};

export default AppMenu;
