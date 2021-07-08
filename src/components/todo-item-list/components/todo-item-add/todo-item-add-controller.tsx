import ProductApi from "../../../../api/ProductApi";
import TodoItem from "../../types";
import { useTodoItemListContext } from "../../../../pages/groceries-todo/context/TodoItemListContext";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import openFoodFactsService from "../../../../api/open-food-facts-api/open-food-facts.service";
import productDetailsToFormFields from "../utils/product-mapping-utils";
import useProductDialog from "../use-product-dialog";
import useNewProductDialog from "../use-new-product-dialog";

const useTodoItemAddController = () => {
    const newProductDialog = useNewProductDialog();

    const productConfirmationDialog = useProductDialog();

    const todoItemListContext = useTodoItemListContext();

    const addTodoItem = (todoItem: TodoItem) => {
        todoItemListContext.addItem(todoItem);
    };

    const onBarcodeDetected = async (result: BarcodeScanResult) => {
        const barcode = result.code;
        const barcodeType = result.format;

        const product = await ProductApi.findByBarcode(barcode, barcodeType);
        if (product == null) {
            const loadedExternalProduct = await openFoodFactsService.fetchProduct(barcode);
            const barcodeScanResult = {
                code: barcode,
                format: barcodeType,
            };

            newProductDialog.openDialog({
                barcodeScanResult,
                defaultProductFields: productDetailsToFormFields(result, loadedExternalProduct)
            });
        } else {
            productConfirmationDialog.openDialog({ product });
        }
    };

    return {
        openNewProductDialog: newProductDialog.isOpened,
        defaultNewProductFields: newProductDialog.payload?.defaultProductFields,
        lastBarcodeScanResult: newProductDialog.payload?.barcodeScanResult,
        onBarcodeDetected,
        addTodoItem,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setOpenNewProductDialog: (state: boolean) => newProductDialog.closeDialog(),
        productConfirmationDialog,
    };
};

export default useTodoItemAddController;
