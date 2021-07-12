import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import SpeedDial, { CloseReason, OpenReason } from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) => createStyles({
    speedDial: {
        position: "absolute",
        "&.MuiSpeedDial-directionLeft": {
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
    },
}));

const actions = [
    { icon: <AddIcon />, name: "Manual" },
    { icon: <SettingsOverscanIcon />, name: "Scan" },
];

const AddProductComponent = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClose = (event: React.SyntheticEvent<{}>, reason: CloseReason) => {
        if (reason === "toggle") {
            setOpen(false);
        }
    };

    const handleOpen = (event: React.SyntheticEvent<{}>, reason: OpenReason) => {
        if (reason === "toggle") {
            setOpen(true);
        }
    };

    return (
        <SpeedDial FabProps={{ size: "large" }}
            ariaLabel="Add"
            className={classes.speedDial}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            open={open}
            onOpen={handleOpen}
            direction="left"
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={() => {}}
                />
            ))}
        </SpeedDial>
    );
};

export default AddProductComponent;
