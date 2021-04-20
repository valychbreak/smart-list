import React, { useState } from "react";
import Result from "../../Result";
import Scanner from "../../Scanner";

const ScanTest = () => {
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState<any>([]);
    const [scannedResult, setScannedResult] = useState<any>(null);

    function scan() {
        setScanning(!scanning);
    }

    function onDetected(result: any) {
        const newResults = results.concat(result);

        let hasTwoOccurances = false;
        let currentCode = newResults[0].codeResult.code;
        for (let i = 1; i < newResults.length; i + 1) {
            const { code } = newResults[i].codeResult;
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
        } else {
            setResults(newResults);
        }
    }

    return (
        <>
            <h2>Actions</h2>
            <button onClick={scan}>{scanning ? "Cancel" : "Scan"}</button>
            <hr />

            {scannedResult ? <p>Scanned code: {scannedResult.codeResult.code}</p> : null}

            <ul className="results">
                {results.map((result: any) => (
                    <Result key={result.codeResult.code} result={result} />
                ))}
            </ul>
            {scanning ? <Scanner onDetected={(result: any) => onDetected(result)} /> : null}

        </>
    );
};

export default ScanTest;
