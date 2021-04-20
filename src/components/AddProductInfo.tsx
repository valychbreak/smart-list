import { Dialog } from "@material-ui/core";
import { useState } from "react";
import Product from "../entity/Product";
import Scanner from "../Scanner";
import ProductForm from "./ProductForm";

interface AddProductInfoPros {
    onProductSubmit(product: Product): void;
}

const INITIAL_STAGE = 0;

const AddProductInfo = (props: AddProductInfoPros) => {
    const [stage, setStage] = useState(INITIAL_STAGE);
    const [barcodeResult, setBarcodeResult] = useState<any>();

    const onBarcodeDetected = (result: any) => {
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

    return (
        <>
            <button onClick={() => setStage(1)}>Scan barcode</button>
            |
            <button onClick={() => setStage(2)}>Manual input</button>
            <br />
            <Dialog open={stage === 1} onClose={onDialogClose}>
                <Scanner onDetected={onBarcodeDetected} />
            </Dialog>
            {stage === 2 && (
                <ProductForm productBarcode={barcodeResult?.codeResult?.code}
                    productBarcodeType={barcodeResult?.codeResult?.format}
                    onProductSubmit={onProductSubmit}/>
            )}
        </>
    );
};

export default AddProductInfo;
