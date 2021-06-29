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

    // workaround method, because of bad class design
    static constructorAll(
        id: number | null,
        productGeneralName: string,
        productBarcode: string,
        productBarcodeType: string,
        productFullName: string | null,
        productCountry: string | null,
        productCompanyName: string | null,
        image: string | null
    ): Product {
        const product = new Product(productGeneralName, productBarcode, productBarcodeType);
        product.id = id;
        product.productFullName = productFullName;
        product.productCountry = productCountry;
        product.productCompanyName = productCompanyName;
        product.image = image;
        return product;
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
        parsedProduct.image = productJson.image || null;

        return parsedProduct;
    }
}
