import Product from "../../entity/Product";

export default class ProductPersistance {
    readonly id: number;

    readonly generalName: string;
    readonly barcode: string;
    readonly barcodeType: string;
    
    readonly fullName: string | null = null;
    readonly releaseCountry: string | null = null;
    readonly releaseCompanyName: string | null = null;
    readonly image: string | null = null;

    private constructor(id: number, generalName: string, barcode: string, barcodeType: string, fullName?: string, 
                        releaseCountry?: string, releaseCompanyName?: string, image?: string) {
        this.id = id;
        this.generalName = generalName;
        this.barcode = barcode;
        this.barcodeType = barcodeType;

        if (fullName) {
            this.fullName = fullName;
        }

        if (releaseCountry) {
            this.releaseCountry = releaseCountry;
        }

        if (releaseCompanyName) {
            this.releaseCompanyName = releaseCompanyName;
        }

        if (image) {
            this.image = image;
        }
    }

    public static fromJson(json: any) {
        return new ProductPersistance(json.id, json.generalName, json.barcode, json.barcodeType, json.fullName, json.releaseCountry, json.releaseCompanyName)
    }
}

export class ProductPersistanceBuilder {
    private json: any = {};

    public static from(product: Product) {
        const builder = new ProductPersistanceBuilder()
            .id(product.id !== null ? product.id : Date.now())
            .generalName(product.productGeneralName)
            .barcode(product.productBarcode, product.productBarcodeType);

        if (product.productFullName !== null) {
            builder.fullName(product.productFullName);
        }

        if (product.productCountry !== null) {
            builder.releaseCountry(product.productCountry);
        }

        if (product.productCompanyName !== null) {
            builder.releaseCountry(product.productCompanyName);
        }
            
        return builder;

    }

    id(id: number): ProductPersistanceBuilder {
        this.json.id = id;
        return this;
    }

    generalName(generalName: string): ProductPersistanceBuilder {
        this.json.generalName = generalName;
        return this;
    }

    barcode(barcode: string, barcodeType: string): ProductPersistanceBuilder {
        this.json.barcode = barcode;
        this.json.barcodeType = barcodeType;
        return this;
    }

    fullName(fullName: string): ProductPersistanceBuilder {
        this.json.fullName = fullName;
        return this;
    }

    releaseCountry(releaseCountry: string): ProductPersistanceBuilder {
        this.json.releaseCountry = releaseCountry;
        return this;
    }

    releaseCompanyName(releaseCompanyName: string): ProductPersistanceBuilder {
        this.json.releaseCompanyName = releaseCompanyName;
        return this;
    }

    build(): ProductPersistance {
        return ProductPersistance.fromJson(this.json);
    }
}
