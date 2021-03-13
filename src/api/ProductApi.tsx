import axios from "axios";
import Product from "../entity/Product";
import LocalDB from "./LocalDB";

interface ProductApi {
    getProducts(): Promise<Product[]>;
    saveProduct(product: Product): Promise<Product>;
}

class MockedProductApi implements ProductApi {

    productCache: Product[];

    constructor() {
        this.productCache = [];
    }

    async getProducts(): Promise<Product[]> {
        return LocalDB.loadProducts();
    }

    async saveProduct(product: Product): Promise<Product> {
        return LocalDB.saveProduct(product);
    }
}

export default new MockedProductApi() as ProductApi;
