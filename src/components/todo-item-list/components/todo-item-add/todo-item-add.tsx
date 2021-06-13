import { Dialog, DialogContent, DialogContentText, DialogTitle, Fab, Grid } from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import Scanner from "../../../../Scanner";
import TodoItemAddForm from "./todo-item-add-form";
import useTodoItemAddController from "./todo-item-add-controller";
import ProductForm from "../../../product-form";
import Product from "../../../../entity/Product";
import ProductApi from "../../../../api/ProductApi";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";

// export for testing only
export async function addProductToTodoItems(
    product: Product,
    addItem: (todoItem: TodoItem) => void
) {
    const savedProduct = await ProductApi.saveProduct(product);
    addItem(TodoItem.fromProduct(savedProduct));
}

const AddTodoItemComponent = () => {
    const {
        openScanner,
        openNewProductDialog,
        lastBarcodeScanResult,
        enableScanner,
        disableScanner,
        onBarcodeDetected,
        addTodoItem,
        setOpenNewProductDialog,
    } = useTodoItemAddController();

    const { addItem } = useTodoItemListContext();

    const onNewProductSubmit = async (product: Product) => {
        addProductToTodoItems(product, addItem);
        setOpenNewProductDialog(false);
    };

    return (
        <>
            <Dialog open={openNewProductDialog} onClose={() => setOpenNewProductDialog(false)}>
                <DialogTitle>New product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* eslint-disable-next-line max-len */}
                        Scanned barcode {lastBarcodeScanResult?.code} ({lastBarcodeScanResult?.format}) does not exist in our database.
                    </DialogContentText>
                    <DialogContentText>
                        Please, fill the following form to add a new product
                    </DialogContentText>
                    <ProductForm
                        shortForm
                        productBarcode={lastBarcodeScanResult?.code || ""}
                        productBarcodeType={lastBarcodeScanResult?.format || ""}
                        onProductSubmit={(product) => onNewProductSubmit(product)} />
                </DialogContent>
            </Dialog>
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
