import axios from "axios";
import Product from "../entity/Product";
import LocalDB from "./LocalDB";

interface ProductApi {
    getProducts(): Promise<Product[]>;
    saveProduct(product: Product): Promise<Product>;
    findBy(generalName: string): Promise<Product[]>;
    findMatchingBy(query: string): Promise<Product[]>;
    findByBarcode(barcode: string, barcodeType: string): Promise<Product | null>;
}

class MockedProductApi implements ProductApi {

    productCache: Product[];

    constructor() {
        this.productCache = [];
    }

    findMatchingBy(query: string): Promise<Product[]> {
        return LocalDB.findByGeneralNameOrFullName(query);
    }

    findBy(generalName: string): Promise<Product[]> {
        return LocalDB.findProductsBy(generalName);
    }

    async findByBarcode(barcode: string, barcodeType: string): Promise<Product | null> {
        const products = await LocalDB.loadProducts();
        let product = products.find(product => {
            return product.productBarcode === barcode && product.productBarcodeType === barcodeType
        });
        return product ? product : null;
    }

    async getProducts(): Promise<Product[]> {
        return LocalDB.loadProducts();
    }

    async saveProduct(product: Product): Promise<Product> {
        return LocalDB.saveProduct(product);
    }
}

export default new MockedProductApi() as ProductApi;
