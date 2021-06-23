import { Dialog, DialogContent, DialogContentText, DialogTitle, Fab, Grid } from "@material-ui/core";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import Scanner from "../../../../Scanner";
import TodoItemAddForm from "./todo-item-add-form";
import useTodoItemAddController from "./todo-item-add-controller";
import ProductForm from "../../../product-form";
import ProductApi from "../../../../api/ProductApi";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import TodoItem from "../../types";
import ProductFormData from "../../../product-form/types";

// export for testing only
export async function addProductToTodoItems(
    productFormData: ProductFormData,
    addItem: (todoItem: TodoItem) => void
) {
    const savedProduct = await ProductApi.createNewProduct(productFormData);
    addItem(TodoItem.fromProduct(savedProduct));
}

const AddTodoItemComponent = () => {
    const {
        openScanner,
        openNewProductDialog,
        defaultNewProductFields,
        lastBarcodeScanResult,
        enableScanner,
        disableScanner,
        onBarcodeDetected,
        addTodoItem,
        setOpenNewProductDialog,
    } = useTodoItemAddController();

    const { addItem } = useTodoItemListContext();

    const onNewProductSubmit = async (productFormData: ProductFormData) => {
        addProductToTodoItems(productFormData, addItem);
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
                        defaultFieldValues={defaultNewProductFields}
                        onProductSubmit={
                            (productFormData) => onNewProductSubmit(productFormData)
                        }
                    />
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
