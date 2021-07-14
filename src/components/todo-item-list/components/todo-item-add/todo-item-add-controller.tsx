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

            newProductDialog.openDialog({
                barcodeScanResult: result,
                defaultProductFields: productDetailsToFormFields(result, loadedExternalProduct)
            });
        } else {
            productConfirmationDialog.openDialog({ product });
        }
    };

    return {
        onBarcodeDetected,
        addTodoItem,
        productConfirmationDialog,
        newProductDialog,
    };
};

export default useTodoItemAddController;
