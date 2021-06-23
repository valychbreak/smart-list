import { Dialog } from "@material-ui/core";
import { useState } from "react";
import openFoodFactsService from "../api/open-food-facts-api/open-food-facts.service";
import Scanner from "../Scanner";
import { BarcodeScanResult } from "./barcode-scanner/types";
import ProductForm, { ProductFormFields } from "./product-form";
import ProductFormData from "./product-form/types";
import productDetailsToFormFields from "./todo-item-list/components/utils/product-mapping-utils";

interface AddProductInfoProps {
    onProductSubmit(productFormData: ProductFormData): void;
}

const INITIAL_STAGE = 0;

const AddProductInfo = (props: AddProductInfoProps) => {
    const [stage, setStage] = useState(INITIAL_STAGE);
    const [barcodeResult, setBarcodeResult] = useState<BarcodeScanResult>();

    const [
        newProductDefaultFields, setNewProductDefaultFields
    ] = useState<ProductFormFields | undefined>(undefined);

    const onBarcodeDetected = async (result: BarcodeScanResult) => {
        setBarcodeResult(result);

        const loadedExternalProduct = await openFoodFactsService.fetchProduct(result.code);
        setNewProductDefaultFields(
            productDetailsToFormFields(result, loadedExternalProduct)
        );

        setStage(2);
    };

    const onProductSubmit = (productFormData: ProductFormData) => {
        setStage(INITIAL_STAGE);
        props.onProductSubmit(productFormData);
    };

    const onDialogClose = () => {
        setStage(INITIAL_STAGE);
    };

    const barcode: string = barcodeResult?.code || "";
    const barcodeType: string = barcodeResult?.format || "";

    return (
        <>
            <button onClick={() => setStage(1)}>Scan barcode</button>
            |
            <button onClick={() => setStage(2)}>Manual input</button>
            <br />
            <Dialog open={stage === 1} onClose={onDialogClose}>
                <Scanner onDetected={onBarcodeDetected} />
            </Dialog>
            {stage === 2 && <>
                <div>
                    <p>Barcode (change if scanned incorrectly): {barcode}</p>
                    <p>Barcode format: {barcodeType}</p>
                </div>
                <ProductForm
                    defaultFieldValues={newProductDefaultFields}
                    onProductSubmit={(productFormData) => onProductSubmit(productFormData)}/>
            </>}
        </>
    );
};

export default AddProductInfo;
