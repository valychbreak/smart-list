import React, { useState } from "react";
import openFoodFactsService from "../../api/open-food-facts-api/open-food-facts.service";
import { BarcodeScanResult } from "../../components/barcode-scanner/types";
import Result from "../../Result";
import Scanner from "../../Scanner";

const ScanTest = () => {
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState<BarcodeScanResult[]>([]);
    const [scannedResult, setScannedResult] = useState<BarcodeScanResult | null>(null);

    const [fetchedData, setFetchedData] = useState("<nothing>");

    function scan() {
        setScanning(!scanning);
    }

    async function fetchOpenFoodFactsProduct(barcode: string) {
        const result = await openFoodFactsService.fetchProduct(barcode);
        setFetchedData(`From OpenFoodFacts: Name: ${result?.name}; Fetched code: ${result?.barcode}`);
    }

    function onDetected(result: BarcodeScanResult) {
        const newResults = results.concat(result);

        let hasTwoOccurances = false;
        let currentCode = newResults[0].code;
        for (let i = 1; i < newResults.length; i + 1) {
            const { code } = newResults[i];
            if (currentCode === code) {
                hasTwoOccurances = true;
                break;
            } else {
                currentCode = code;
            }
        }

        if (hasTwoOccurances) {
            setScanning(false);
            setScannedResult(result);
            setResults([]);

            fetchOpenFoodFactsProduct(result.code);
        } else {
            setResults(newResults);
        }
    }

    return (
        <>
            <h2>Actions</h2>
            <button onClick={scan}>{scanning ? "Cancel" : "Scan"}</button>
            <hr />

            {fetchedData} <br />

            {scannedResult ? <p>Scanned code: {scannedResult.code}</p> : null}

            <ul className="results">
                {results.map((result: BarcodeScanResult, idx) => (
                    <Result key={idx} result={result} />
                ))}
            </ul>
            {scanning ? <Scanner onDetected={onDetected} /> : null}

        </>
    );
};

export default ScanTest;
