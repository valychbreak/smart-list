import React, { useEffect, useState } from "react";
import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2";
import { BarcodeScanResult } from "./components/barcode-scanner/types";

type ScannerProps = {
    onDetected(result: BarcodeScanResult): void;
};

const Scanner: React.FC<ScannerProps> = (props: ScannerProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function onBarcodeDetected(result: QuaggaJSResultObject) {
        const { codeResult } = result;

        if (!codeResult.code) {
            return;
        }

        props.onDetected({
            code: codeResult.code,
            format: codeResult.format
        });
    }

    useEffect(() => {
        const markError = () => setErrorMessage("Camera was not found");

        Quagga.init(
            {
                inputStream: {
                    type: "LiveStream",
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment", // or user
                    },
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true,
                },
                numOfWorkers: 0,
                decoder: {
                    readers: ["ean_reader", "ean_8_reader"],
                },
                locate: true,
            },
            (err) => {
                if (err) {
                    markError();
                    return;
                }
                Quagga.start();
            },
        );
        Quagga.onDetected(onBarcodeDetected);
        return () => {
            Quagga.stop();
            Quagga.offDetected(onBarcodeDetected);
        };
    }, []);

    return <>
        {errorMessage && `Error ${errorMessage}`}
        <div id="interactive" className="viewport" />
    </>;
};

export default Scanner;
