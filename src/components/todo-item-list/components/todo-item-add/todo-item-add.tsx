import { Dialog, Fab, Grid } from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import Scanner from "../../../../Scanner";
import TodoItemAddForm from "./todo-item-add-form";
import useTodoItemAddController from "./todo-item-add-controller";

const AddTodoItemComponent = () => {
    const {
        openScanner,
        openNewProductDialog,
        lastBarcodeScanResult,
        enableScanner,
        disableScanner,
        onBarcodeDetected,
        addTodoItem,
    } = useTodoItemAddController();

    const history = useHistory();

    useEffect(() => {
        if (!openNewProductDialog || lastBarcodeScanResult === null) {
            return;
        }

        const { code, format } = lastBarcodeScanResult;
        // eslint-disable-next-line no-alert
        if (window.confirm(`Scanned barcode  ${code} (${format}) does not exist in our database. \nDo you want to go to 'Add new item' page?`)) {
            history.push("new-product");
        }
    }, [openNewProductDialog]);

    return (
        <>
            <Grid container justify="center" alignItems="center">
                <Grid item xs>
                    <Fab
                        data-test-id="open-scanner-btn"
                        color="inherit"
                        size="medium"
                        onClick={() => enableScanner()}
                    >
                        <SettingsOverscanIcon />
                    </Fab>
                    <Dialog open={openScanner} onClose={disableScanner}>
                        <Scanner onDetected={onBarcodeDetected} />
                    </Dialog>
                </Grid>
                <Grid item xs={10}>
                    <TodoItemAddForm onTodoItemSubmit={addTodoItem} />
                </Grid>
            </Grid>
        </>
    );
};

export default AddTodoItemComponent;
