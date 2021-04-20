import Category from "./category";

export default class Product {
    id: number | null = null;

    productGeneralName: string;

    productBarcode: string;

    productBarcodeType: string;

    productFullName: string | null = null;

    productCountry: string | null = null;

    productCompanyName: string | null = null;

    image: string | null = null;

    category: Category | null = null;

    constructor(productGeneralName: string, productBarcode: string, productBarcodeType: string) {
        this.productGeneralName = productGeneralName;

        this.productBarcode = productBarcode;
        this.productBarcodeType = productBarcodeType;
    }

    static from(productJson: any): Product {
        const parsedProduct = new Product(
            productJson.productGeneralName,
            productJson.productBarcode,
            productJson.productBarcodeType,
        );

        parsedProduct.id = productJson.id;
        parsedProduct.productFullName = productJson.productFullName;
        parsedProduct.productCompanyName = productJson.productCompanyName;
        parsedProduct.productCountry = productJson.productCountry;

        return parsedProduct;
    }
}
