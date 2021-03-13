
export default class Product {
    id: number | null = null;

    productGeneralName: string;
    productBarcode: string;
    productBarcodeType: string;
    
    productFullName: string | null = null;
    productCountry: string | null = null;
    productCompanyName: string | null = null;
    image: string | null = null;

    constructor(productGeneralName: string, productBarcode: string, productBarcodeType: string) {
        this.productGeneralName = productGeneralName;

        this.productBarcode = productBarcode;
        this.productBarcodeType = productBarcodeType;
    }
}
