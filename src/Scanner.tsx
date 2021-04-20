import React, { useEffect, useState } from "react";
import Quagga from "@ericblade/quagga2";

type ScannerProps = {
    onDetected(result: any): void;
};

const Scanner: React.FC<ScannerProps> = (props: ScannerProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function onBarcodeDetected(result: any) {
        props.onDetected(result);
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
