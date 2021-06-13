import { Dialog } from "@material-ui/core";
import { useState } from "react";
import Product from "../entity/Product";
import Scanner from "../Scanner";
import { BarcodeScanResult } from "./barcode-scanner/types";
import ProductForm from "./product-form";

interface AddProductInfoPros {
    onProductSubmit(product: Product): void;
}

const INITIAL_STAGE = 0;

const AddProductInfo = (props: AddProductInfoPros) => {
    const [stage, setStage] = useState(INITIAL_STAGE);
    const [barcodeResult, setBarcodeResult] = useState<BarcodeScanResult>();

    const onBarcodeDetected = (result: BarcodeScanResult) => {
        setBarcodeResult(result);
        setStage(2);
    };

    const onProductSubmit = (product: Product) => {
        setStage(INITIAL_STAGE);
        props.onProductSubmit(product);
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
                <ProductForm productBarcode={barcode}
                    productBarcodeType={barcodeType}
                    onProductSubmit={onProductSubmit}/>
            </>}
        </>
    );
};

export default AddProductInfo;
