import { Container, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import AddTodoItemComponent from "../todo-item-add";
import TodoListView from "../todo-item-list-view";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            position: "fixed",
            bottom: 0,
            // height: 60
        },
    },
}));

const GroceriesTodoPlanningModeView: React.FC<{}> = () => {
    const classes = useStyles();

    const onTodoItemPurchaseToggle = () => {
        throw Error("Purchasing is disabled");
    };

    return (<>
        <TodoListView showPurchaseAction={false}
            onTodoItemPurchaseToggle={onTodoItemPurchaseToggle} />

        <Container maxWidth="lg" disableGutters classes={classes}>
            <Paper>
                <AddTodoItemComponent />
            </Paper>
        </Container>
    </>);
};

export default GroceriesTodoPlanningModeView;
