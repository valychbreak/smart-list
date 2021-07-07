import { useState } from "react";

const useBarcodeScanner = () => {
    const [isScannerEnabled, setScannerEnabled] = useState(false);

    return {
        isScannerEnabled,
        enableScanner: () => setScannerEnabled(true),
        disableScanner: () => setScannerEnabled(false)
    };
};

export default useBarcodeScanner;
