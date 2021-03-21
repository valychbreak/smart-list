import Quagga from '@ericblade/quagga2';
import React, { Component, useEffect, useRef, useState } from 'react';
import Product from '../entity/Product';
import Scanner from '../Scanner';
import ProductForm from './ProductForm';

interface AddProductInfoPros {
    onProductSubmit(product: Product): void;
}

const AddProductInfo = (props: AddProductInfoPros) => {

    const [stage, setStage] = useState(1);
    const [barcodeResult, setBarcodeResult] = useState<any>();

    useEffect(() => {
        return function cleanup() {
            //setStage(1);
        }
    })

    const onBarcodeDetected = (result: any) => {
        console.log(result);
        setBarcodeResult(result);
        setStage(2);
    }

    const onProductSubmit = (product: Product) => {
        setStage(1);
        props.onProductSubmit(product);
    }

    return (
        <>
            <button onClick={() => setStage(1)}>Scan barcode</button> | <button onClick={() => setStage(2)}>Manual input</button>
            <br />
            {stage == 1 && <Scanner onDetected={onBarcodeDetected} />}
            {stage == 2 && <ProductForm productBarcode={barcodeResult?.codeResult?.code} productBarcodeType={barcodeResult?.codeResult?.format} onProductSubmit={onProductSubmit}/>}
        </>
    )
}

export default AddProductInfo;
