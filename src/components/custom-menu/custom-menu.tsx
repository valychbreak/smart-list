import { Menu, MenuProps, withStyles } from "@material-ui/core";
import React from "react";

export const useMenuController = () => {
    const [anchorElement, setAnchorElement] = React.useState(null);

    const openMenu = (event: any) => {
        setAnchorElement(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorElement(null);
    };

    return {
        open: Boolean(anchorElement),
        anchorElement,
        openMenu,
        closeMenu,
    };
};

export const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5",
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props} />
));
