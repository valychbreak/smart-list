import {
    Button, IconButton, ListItemText, MenuItem,
} from "@material-ui/core";
import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AccountBox, AccountCircle } from "@material-ui/icons";
import { AuthenticationContext } from "../authentication";
import { StyledMenu, useMenuController } from "../custom-menu";

function ProfileBar() {
    const {
        open, anchorElement, openMenu, closeMenu,
    } = useMenuController();
    const authContext = useContext(AuthenticationContext);
    const history = useHistory();

    function signout() {
        authContext.signout().then(() => history.push("/"));
    }

    return authContext.isAuthenticated() === true
        ? <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={openMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <StyledMenu open={open} anchorEl={anchorElement} onClose={closeMenu}>
                <MenuItem component={Link} to='/profile' onClick={closeMenu}>
                    <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem onClick={signout} >
                    <ListItemText primary="Sign out" />
                </MenuItem>
            </StyledMenu>
        </>
        : <Button color="inherit" component={Link} to='/login' startIcon={<AccountBox />}>Login</Button>;
}

export default ProfileBar;
