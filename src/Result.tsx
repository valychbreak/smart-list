import React from "react";
import { BarcodeScanResult } from "./components/barcode-scanner/types";

type ResultProps = {
    result: BarcodeScanResult;
};

const Result: React.FC<ResultProps> = (props: ResultProps) => {
    const { result } = props;

    if (!result) {
        return null;
    }
    return (
        <li >
            {result.code} [{result.format}]
        </li>
    );
};

export default Result;
