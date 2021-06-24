import { ProductDetails } from "../../../../api/open-food-facts-api/open-food-facts.service";
import { BarcodeScanResult } from "../../../barcode-scanner/types";
import { ProductFormFields } from "../../../product-form";

export default function productDetailsToFormFields(
    barcodeScanResult: BarcodeScanResult,
    productDetails?: ProductDetails | null
): ProductFormFields {
    if (productDetails) {
        return {
            productBarcode: barcodeScanResult.code,
            productBarcodeType: barcodeScanResult.format,
            productCompanyName: productDetails.company,
            productCountry: "",
            productFullName: productDetails.name,
            productGeneralName: productDetails.name || "",
            image: productDetails.imageUrl
        };
    }

    return {
        productBarcode: barcodeScanResult.code,
        productBarcodeType: barcodeScanResult.format,
        productCompanyName: "",
        productCountry: "",
        productFullName: "",
        productGeneralName: "",
        image: null
    };
}
