import { Dialog } from "@material-ui/core";
import { useState } from "react";
import Scanner from "../Scanner";
import { BarcodeScanResult } from "./barcode-scanner/types";
import ProductForm from "./product-form";
import ProductFormData from "./product-form/types";
import productDetailsToFormFields from "./todo-item-list/components/utils/product-mapping-utils";

interface AddProductInfoProps {
    onProductSubmit(productFormData: ProductFormData): void;
}

const INITIAL_STAGE = 0;

const AddProductInfo = (props: AddProductInfoProps) => {
    const [stage, setStage] = useState(INITIAL_STAGE);
    const [barcodeResult, setBarcodeResult] = useState<BarcodeScanResult>();

    const onBarcodeDetected = (result: BarcodeScanResult) => {
        setBarcodeResult(result);
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

    let productDefaultFields;
    if (barcodeResult) {
        productDefaultFields = productDetailsToFormFields(barcodeResult);
    }

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
                    defaultFieldValues={productDefaultFields}
                    onProductSubmit={(productFormData) => onProductSubmit(productFormData)}/>
            </>}
        </>
    );
};

export default AddProductInfo;
