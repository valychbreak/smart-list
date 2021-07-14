import { useState } from "react";
import Scanner, { ScannerProps } from "./quagga-scanner";
import { BarcodeScanResult } from "./types";

const EXPECTED_CONSECUTIVE_OCCURRENCES = 3;

const ImprovedScannerContainer = (props: ScannerProps) => {
    const [scannedResults, setScannedResults] = useState<BarcodeScanResult[]>([]);

    const onBarcodeDetected = (barcodeScanResult: BarcodeScanResult) => {
        const newResults = scannedResults.concat(barcodeScanResult)
            .slice(-EXPECTED_CONSECUTIVE_OCCURRENCES);

        const occurences = newResults
            .filter((scannedResult) => scannedResult.code === barcodeScanResult.code)
            .length;

        if (occurences >= EXPECTED_CONSECUTIVE_OCCURRENCES) {
            props.onDetected(barcodeScanResult);
            setScannedResults([]);
        } else {
            setScannedResults(newResults);
        }
    };

    return <Scanner onDetected={(scanResult) => onBarcodeDetected(scanResult)} />;
};

export default ImprovedScannerContainer;
