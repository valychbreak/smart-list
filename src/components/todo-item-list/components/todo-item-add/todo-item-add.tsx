import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
    createStyles,
    Dialog, Fab, Grid, makeStyles,
} from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import ProductApi from "../../../../api/ProductApi";
import AddTodoItemForm from "../../../../pages/groceries-todo/components/AddTodoItemForm";
import TodoItem from "../../types";
import TodoItemListContext from "../../../../pages/groceries-todo/context/TodoItemListContext";
import Scanner from "../../../../Scanner";

const useStyles = makeStyles((theme) => createStyles({
    fab: {
        position: "fixed",
        bottom: theme.spacing(8),
        right: theme.spacing(2),
    },
    fabIcon: {
        marginRight: theme.spacing(1),
    },
}));

const AddTodoItemComponent = () => {
    const [isScannerEnabled, setScannerEnabled] = useState(false);
    const todoItemListContext = useContext(TodoItemListContext);
    const history = useHistory();

    const classes = useStyles();

    const enableScanner = () => {
        setScannerEnabled(true);
    };

    const disableScanner = () => {
        setScannerEnabled(false);
    };

    const onBarcodeDetected = (result: any) => {
        // Before scanner is unmounted, it still able to trigger barcodes detection.
        // Making sure that we trigger scan only once.
        if (!isScannerEnabled) {
            return;
        }

        disableScanner();

        const barcode = result.codeResult?.code;
        const barcodeType = result.codeResult?.format;

        if (barcode && barcodeType) {
            ProductApi.findByBarcode(barcode, barcodeType).then((product) => {
                if (product == null) {
                    // eslint-disable-next-line no-alert
                    if (window.confirm(`Scanned barcode  ${barcode} (${barcodeType}) does not exist in our database. \nDo you want to go to 'Add new item' page?`)) {
                        history.push("new-product");
                    }
                } else {
                    const newItem = TodoItem.fromProduct(product);
                    todoItemListContext.addItem(newItem);
                }
            });
        }
    };

    return (<>
        <Grid container justify="center" alignItems="center">
            {/* <Grid item xs>
                <IconButton onClick={() => enableScanner()}>
                    <SettingsOverscanIcon />
                </IconButton>

                <Dialog open={isScannerEnabled} onClose={disableScanner}>
                    <Scanner onDetected={onBarcodeDetected} />
                </Dialog>
            </Grid> */}
            <Grid item xs={11}>
                <AddTodoItemForm />
            </Grid>
        </Grid>
        <Fab color="inherit" size="medium" variant="extended" className={classes.fab} onClick={() => enableScanner()}>
            <SettingsOverscanIcon className={classes.fabIcon} />
            Scan
        </Fab>

        <Dialog open={isScannerEnabled} onClose={disableScanner}>
            <Scanner onDetected={onBarcodeDetected} />
        </Dialog>
    </>);
};

export default AddTodoItemComponent;
